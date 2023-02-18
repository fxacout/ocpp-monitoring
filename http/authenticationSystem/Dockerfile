FROM node:16-bullseye

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . .

RUN yarn
RUN yarn build
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source


EXPOSE 8080
CMD [ "yarn", "watch:dev" ]