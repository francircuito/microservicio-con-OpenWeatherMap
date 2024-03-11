FROM node:18

WORKDIR /src/app

COPY package*.json ./
COPY . /src/app

RUN npm i

EXPOSE 80

CMD ["node", "/src/app/index.js"]