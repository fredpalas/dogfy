FROM node:22

WORKDIR /code

COPY package.json package-lock.json ./
RUN npm install
