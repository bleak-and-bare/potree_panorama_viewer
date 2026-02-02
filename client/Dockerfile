FROM node:22.18-alpine AS potree-builder

WORKDIR /potree
COPY public/potree .

RUN npm i -g gulp-cli
RUN npm install

FROM oven/bun:latest AS builder

WORKDIR /app

ARG VITE_PANO_IMAGES
ARG VITE_PANO_INFOS
ARG VITE_POINTCLOUD
ARG VITE_PANO_LIST

ENV VITE_PANO_IMAGES=$VITE_PANO_IMAGES
ENV VITE_PANO_INFOS=$VITE_PANO_INFOS
ENV VITE_POINTCLOUD=$VITE_POINTCLOUD
ENV VITE_PANO_LIST=$VITE_PANO_LIST

COPY package.json bun.lock ./
RUN bun install

COPY . .
COPY --from=potree-builder /potree ./public/potree/

RUN bun run build

# served from nginx
