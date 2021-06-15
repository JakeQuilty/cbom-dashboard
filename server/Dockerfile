FROM node:16.3.0

WORKDIR /cbom-maker

COPY ["package.json", "package-lock.json", "./"]
RUN npm install --production
COPY . .

EXPOSE 3080

CMD ["node", "server.js"]