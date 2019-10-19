# Choosing Base Image
FROM node:10.16.0

RUN mkdir /authentication
WORKDIR /authentication

COPY package.json /authentication
COPY package-lock.json /authentication


RUN npm install -g nodemon
RUN npm install

# Copy source code
COPY . /authentication

# Expose API port to the outside
EXPOSE 3001

# Launch application
CMD nodemon src/server.js
