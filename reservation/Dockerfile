# Choosing Base Image
FROM node:10.16.0

RUN mkdir /reservation
WORKDIR /reservation

COPY package.json /reservation
COPY package-lock.json /reservation


RUN npm install -g nodemon
RUN npm install

# Copy source code
COPY . /reservation

# Expose API port to the outside
EXPOSE 3000

# Launch application
CMD nodemon src/server.js
