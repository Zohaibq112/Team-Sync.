pipeline {
    agent any

    stages {

        stage('Install Backend') {
            steps {
                sh 'docker run --rm -v %cd%/backend:/app -w /app node:18 npm install'
            }
        }

        stage('Install Frontend') {
            steps {
                sh 'docker run --rm -v %cd%/client:/app -w /app node:18 npm install'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'docker run --rm -v %cd%/client:/app -w /app node:18 npm run build'
            }
        }

        stage('Result') {
            steps {
                echo '✅ MERN project build successful'
            }
        }
    }
}
