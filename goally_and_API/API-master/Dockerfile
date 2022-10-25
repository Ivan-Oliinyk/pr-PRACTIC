FROM node:14.9.0


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./


RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]