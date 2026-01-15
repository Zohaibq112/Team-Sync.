pipeline {
    agent any

    stages {

        stage('Backend Install') {
            steps {
                sh 'docker run --rm -v $PWD/backend:/app -w /app node:18 npm install'
            }
        }

        stage('Frontend Install') {
            steps {
                sh 'docker run --rm -v $PWD/client:/app -w /app node:18 npm install'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'docker run --rm -v $PWD/client:/app -w /app node:18 npm run build'
            }
        }

        stage('Done') {
            steps {
                echo '✅ Build finished successfully'
            }
        }
    }
}
