FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_BASE_PATH=/penzgtu-abitur/
ARG VITE_API_BASE_URL=/penzgtu-abitur/api

ENV VITE_BASE_PATH=$VITE_BASE_PATH
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
