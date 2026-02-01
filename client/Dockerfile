FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

EXPOSE $PORT

CMD ["bun", "run", "dev", "--host"]
