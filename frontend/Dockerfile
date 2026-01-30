# Stage 1: Build the Angular app
FROM node:20-alpine as build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code and build
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove the default Nginx "Welcome" pages
RUN rm -rf /usr/share/nginx/html/*

# Copy your custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# COPY the build output. 
# The '*' wildcard ensures we catch the folder name (e.g., dist/apartment-rental/browser)
COPY --from=build /app/dist/*/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]