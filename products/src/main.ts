import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ProductsModule } from './products.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);
  app.connectMicroservice({
    transport: Transport.NATS,
    options: {
      servers: [process.env.NATS_URL],
    },
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
