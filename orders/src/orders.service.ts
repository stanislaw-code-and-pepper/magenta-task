import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';

const API_URL = 'https://recruitment-api.dev.flipfit.io/orders';
const PAGE_SIZE = 1000;

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @Inject('ORDERS_SERVICE') private client: ClientProxy,
  ) {}

  private readonly logger = new Logger(OrdersService.name);

  async processPage(page: number, skip: number) {
    this.logger.debug(`Fetching orders - page ${page}`);

    const orders = await this.httpService.axiosRef.get<[Order]>(
      `${API_URL}?_page=${page}&_limit=${PAGE_SIZE}`,
    );

    return Promise.all(
      orders.data.slice(skip).map((order) => {
        const createdOrder = new this.orderModel(order);
        this.logger.debug('Saving order', createdOrder.id);
        return Promise.all([
          createdOrder.save(),
          this.client.emit('new_order', order),
        ]);
      }),
    );
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async fetchOrders() {
    this.logger.debug('Fetching orders');

    const numberOfOrders = await this.orderModel.collection.countDocuments();
    const ordersOnLastPage = numberOfOrders % PAGE_SIZE;

    this.logger.debug('Current number of orders', numberOfOrders);

    let currentPage = Math.floor(numberOfOrders / PAGE_SIZE) + 1;
    let orders = [];

    do {
      orders = await this.processPage(currentPage, ordersOnLastPage);
      currentPage++;
    } while (orders.length > ordersOnLastPage);
  }

  onModuleInit() {
    this.fetchOrders();
  }
}
