FROM mcr.microsoft.com/playwright:v1.42.1-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx playwright install --with-deps

CMD ["npx", "ts-node", "-r", "tsconfig-paths/register", "node_modules/.bin/playwright", "test"]
