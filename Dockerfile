FROM node:16

# 기본 리눅스 명령어 설치
RUN apt update && apt install -y vim

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# 앱을 빌드하고 실행하기 위한 스크립트 실행
RUN npm run build

EXPOSE 3002

# 앱을 실행하기 위한 스크립트 실행
# CMD ["npm", "start" ]

CMD ["npm","run","start:stage" ]

