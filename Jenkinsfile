HEAD
pipeline {
    agent any

    stages {

        stage('Install Backend Dependencies') {
            steps {
                sh '''
                docker run --rm \
                -v $WORKSPACE/backend:/app \
                -w /app \
                node:18 \
                npm install
                '''
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                sh '''
                docker run --rm \
                -v $WORKSPACE/client:/app \
                -w /app \
                node:18 \
                npm install
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                docker run --rm \
                -v $WORKSPACE/client:/app \
                -w /app \
                node:18 \
                npm run build
                '''
            }
        }

        stage('Result') {
            steps {
                echo '✅ MERN project build successful'
            }
        }
    }
}
version: "3.8"

services:
  backend:
    build: ./backend
    container_name: mern-backend
    ports:
      - "9000:9000"
    env_file:
      - ./backend/.env

  frontend:
    build: ./client
    container_name: mern-frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
34d8db629b6ac59924844ec7cfb45d20901b2f21
