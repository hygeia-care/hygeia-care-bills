FROM node:16-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY bin/ ./bin
COPY public ./public
COPY routes/ ./routes
COPY models/ ./models
COPY services/ ./services
COPY db.js .
COPY app.js .
COPY dbTests.js .
COPY verifyJWTToken.js .
COPY .env .

EXPOSE 3337

CMD npm start