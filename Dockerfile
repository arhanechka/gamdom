FROM mcr.microsoft.com/playwright:v1.42.1-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx playwright install --with-deps

ARG TEST_CMD="test"
ENV TEST_CMD=$TEST_CMD

CMD ["sh", "-c", "npx $TEST_CMD"]