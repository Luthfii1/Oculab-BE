FROM node:23-slim-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Optional default port (can be overridden by Compose)
ENV PORT=3000

EXPOSE 3000 3003  
# This is just documentation; actual binding is done by Compose

CMD ["npm", "run", "dev"]