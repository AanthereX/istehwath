FROM node:18 as build

WORKDIR /app

COPY  package*.json ./
# COPY patches .
COPY patches ./patches


RUN npm install

COPY . .

RUN npx patch-package react-stepper-horizontal


RUN npm run build


FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist /usr/share/nginx/html

COPY inject-runtime-env.sh /usr/share/nginx/html/inject-runtime-env.sh
RUN chmod +x /usr/share/nginx/html/inject-runtime-env.sh

EXPOSE 80

CMD ["/bin/sh", "-c", "/usr/share/nginx/html/inject-runtime-env.sh && nginx -g 'daemon off;'"]

