FROM node:16
WORKDIR /usr/src/app/
COPY . .
RUN npm install
RUN npm run build

FROM nginx
WORKDIR /usr/src/app/
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./build /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]