FROM node:20.9.0 AS build
 
WORKDIR /app
COPY package*.json ./
COPY . .

RUN npm install 


RUN npm run build 

FROM nginx:1.25.4-alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ /usr/share/nginx/html
EXPOSE 80
RUN apk update
RUN apk add ca-certificates wget && wget https://gist.githubusercontent.com/selise-devops/bdc7d8c76ed3a63b33d2bb0a402e9f8b/raw/652e7909f2f1c22edeabdf6efb987b2c9612b87e/nginx.conf -O /etc/nginx/conf.d/default.conf && wget https://gist.githubusercontent.com/selise-devops/66e78c001afa5bddcc5eeb93fa444205/raw/2c3a60741eddb65158269111a341593aef52126f/zgip.conf -O /etc/nginx/nginx.conf && rm -rf /var/cache/apk/*