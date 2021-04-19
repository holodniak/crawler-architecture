FROM node:12-alpine3.12

ENV LANGUAGE=pt-BR

# Install packages
RUN apk --no-cache add chromium 

# Create Directory for the Container
WORKDIR /usr/src/app

# Only copy the package.json file to work directory
COPY package.json .

# Install all Packages
RUN npm install -g typescript ts-node
RUN npm install

# Copy all other source code to work directory
ADD . /usr/src/app

# Start
CMD [ "npm", "start" ]