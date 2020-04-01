FROM mhart/alpine-node:10
COPY . /www/
WORKDIR /www
ARG container_port=3000
ENV PORT=$container_port
EXPOSE $PORT
RUN npm install
CMD npm start
