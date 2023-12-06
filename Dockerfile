FROM node:18.12.1-alpine3.17 as builder
WORKDIR /home/node/app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --development

FROM node:18.12.1-alpine3.17
ENV NODE_ENV=development

ENV ENV_SILENT=true
ENV HOST=0.0.0.0
ENV PORT=3355
ENV APP_KEY=cgL_ZdIvPxVsi3w5gnGcqoCgMRKEZPvK
ENV DRIVE_DISK=local
ENV APP_NAME=crypwal_be_crypto_transfer_module
ENV DB_CONNECTION=mysql
ENV MYSQL_HOST=192.169.1.4
ENV MYSQL_PORT=3306
ENV MYSQL_USER=devuser
ENV MYSQL_PASSWORD=pwdev123!
ENV MYSQL_DB_NAME=SBT
ENV RABBIT_USER='usrblockchain'
ENV RABBIT_PASS='usrblockchain'
ENV HOSTNAME='192.169.2.5'
ENV VHOST='/blockchain'

WORKDIR /home/node/app
COPY --from=builder /home/node/app/build .

RUN npm ci --development
EXPOSE 3355
CMD [ "node", "server.js" ]
