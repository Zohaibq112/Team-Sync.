pipeline {
    agent any

    stages {
        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Run Containers') {
            steps {
                sh '''
                  docker-compose down || true
                  docker-compose up -d
                '''
            }
        }

        stage('Verify') {
            steps {
                sh 'docker-compose ps'
            }
        }
    }
}
