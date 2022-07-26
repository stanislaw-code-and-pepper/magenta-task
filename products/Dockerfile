FROM node:16-alpine
RUN npm install -g npm
RUN mkdir -p /var/www/products
WORKDIR /var/www/products
ADD . /var/www/products
RUN npm install
# CMD npm run build && npm run start:prod
CMD npm start