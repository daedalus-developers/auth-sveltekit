FROM node:20.11-alpine AS base

RUN npm install -g pnpm@latest

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile


COPY . .

RUN pnpm build

EXPOSE 3000


CMD ["node", "-r", "dotenv/config", "build"]


