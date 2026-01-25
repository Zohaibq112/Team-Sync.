FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy TS config & source code
COPY tsconfig.json ./
COPY src ./src



# Copy env file
COPY .env .env

# Build TS -> JS
RUN npm run build

# Copy package.json to dist
COPY package.json ./dist/

EXPOSE 9000

CMD ["node", "dist/index.js"]
