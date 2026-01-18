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
