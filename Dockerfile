FROM node:24.0.2-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci


FROM dependencies AS test
COPY . .

ENV DATABASE_URL="mysql://username:password@localhost:3306/myENV db"

RUN npx prisma generate
RUN npm test


FROM test AS build

RUN npm run build



FROM node:24.0.2-alpine AS final

WORKDIR /app

COPY --from=build /app/package.json /app/package-lock.json ./

RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts

USER node

EXPOSE ${APP_PORT}

CMD ["sh", "-c", "npx prisma migrate deploy && exec node dist/src/index.js"]