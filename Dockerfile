FROM node:13-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY bin/ ./bin
COPY public ./public
COPY routes/ ./routes
# COPY services/ ./services
COPY app.js .

EXPOSE 3337

CMD npm start