FROM node:14
WORKDIR .
COPY package*.json ./
RUN npm install express axios
COPY . .
EXPOSE 8080
CMD ["node", "index.js"]