FROM node:16
WORKDIR /usr/src/app/
COPY . .
RUN npm clean-install
RUN npm run build

FROM nginx
WORKDIR /usr/src/app/
COPY --from=0 /usr/src/app/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /usr/src/app/build /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
