FROM node:latest as nodey
WORKDIR /app

COPY . .
RUN npm set registry=https://registry.npmjs.org/
RUN npm install
RUN npm install -g @angular/cli
RUN ng build --configuration production


FROM nginx:alpine
COPY --from=nodey /app/dist/queen_bee_web /usr/share/nginx/html
