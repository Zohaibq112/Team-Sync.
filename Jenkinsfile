pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Run Containers') {
            steps {
                sh '''
                docker compose down || true
                docker compose up -d
                '''
            }
        }

        stage('Verify') {
            steps {
                sh 'docker ps'
                echo '✅ MERN application is running'
            }
        }
    }
}
