# Requirements

- docker
- docker-compose

# Run

```
$ docker-compose up --build
```

# API

By default listening on port 3000

- `/api/products/profitable`
- `/api/products/often_bought`
- `/api/products/often_bought_yesterday`

# Architecture overview

There are two services - orders and products.

The `orders` service is responsible for fetching data from external API and producing a `new_order` event. Besides that the service stores orders in the database. Thanks to that the `orders` service is aware of which order was already processed(order id is unique, so there is no way to process the same order twice) and which pages from the external endpoint can be skipped.

The `products` service process `new_order` event and aggregates data. It provides REST API for getting the most profitable and often bought products.

Separation of services allows scaling `products` services horizontally. The `orders` service emits a lot of events, so there can be a need to spawn many `products` services to speed up order processing.
