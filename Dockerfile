FROM node:19.9.0
WORKDIR /home/node/back-end
COPY package.json .
RUN npm install --quiet
RUN npm uninstall bcrypt
RUN npm uninstall nodemon
RUN npm install bcrypt
RUN npm install -g nodemon