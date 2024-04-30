FROM node:14
WORKDIR .
COPY package*.json ./
RUN npm install express axios redis hot-shots
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]