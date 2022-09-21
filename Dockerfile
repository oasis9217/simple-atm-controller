FROM node:16

RUN mkdir -p /opt/atm
COPY . /opt/atm
WORKDIR /opt/atm

RUN npm install

CMD ["npm", "run", "demo"]