FROM nginx:latest
COPY app.js /usr/share/nginx/html
COPY index.html /usr/share/nginx/html
COPY Loading_icon.gif /usr/share/nginx/html
COPY Popcorn_Time_logo.png /usr/share/nginx/html
COPY youtube.png /usr/share/nginx/html
COPY styles.css /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]