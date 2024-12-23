FROM node:18.14.2 AS frontend-builder

# FRONTEND
# install npm packages
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# production build of react
COPY frontend/public ./public
COPY frontend/src ./src
COPY frontend/tsconfig.json frontend/tailwind.config.js ./
RUN npm run build


FROM node:18.14.2 AS runner

## BACKEND
# install npm packages
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install ts-node

# copy production build from frontend-builder
COPY --from=frontend-builder /app/frontend/build ./frontend/build
# we have shared data types between frontend and backend
COPY --from=frontend-builder /app/frontend/src/utils/data.ts ./frontend/src/utils/data.ts

# copy server files 
COPY src ./src
COPY scripts ./scripts

# run server
ENTRYPOINT ["npm", "run" ,"production"]