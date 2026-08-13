FROM node:24.13.0-alpine AS build

WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:24.13.0-alpine

ENV NODE_ENV=production
WORKDIR /opt/app

COPY --from=build /opt/app/node_modules ./node_modules
COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/config ./config
COPY --from=build /opt/app/package.json ./package.json

USER node
EXPOSE 3000 9229
CMD ["npm", "start"]
