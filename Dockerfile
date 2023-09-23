FROM nginx:latest
COPY ./MovieApp/* /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]