FROM node:24.13.0-alpine AS build

WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:24.13.0-alpine

ENV NODE_ENV=production
WORKDIR /opt/app

COPY --chown=node:node --from=build /opt/app/node_modules ./node_modules
COPY --chown=node:node --from=build /opt/app/dist ./dist
COPY --chown=node:node --from=build /opt/app/config ./config
COPY --chown=node:node --from=build /opt/app/package.json ./package.json

RUN mkdir -p logs && chown node:node logs

USER node
EXPOSE 3000 9229
CMD ["npm", "start"]
