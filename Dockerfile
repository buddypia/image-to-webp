FROM node:16
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y vim

RUN wget https://storage.googleapis.com/downloads.webmproject.org/releases/webp/libwebp-1.2.1-linux-x86-64.tar.gz
RUN tar xvzf libwebp-1.2.1-linux-x86-64.tar.gz
ENV PATH $PATH:/usr/src/app/libwebp-1.2.1-linux-x86-64/bin

COPY . .

WORKDIR /usr/src/app/
RUN yarn install --production=false

CMD ["yarn", "start"]
