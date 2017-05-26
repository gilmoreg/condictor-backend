FROM node:7.10
LABEL maintainer "gilmoreg@live.com"

# Prevent npm install from running unless package.json changes
COPY ./package.json src/
RUN cd src && npm install

COPY . /src

WORKDIR src/

CMD ["npm", "start"]