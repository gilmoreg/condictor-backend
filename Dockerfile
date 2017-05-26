FROM node:7.10
LABEL maintainer "gilmoreg@live.com"

RUN npm install -g forever

# Prevent npm install from running unless package.json changes
COPY ./package.json src/
RUN cd src && npm install --only=production

COPY . /src

WORKDIR src/

EXPOSE 3000

CMD ["npm", "start"]