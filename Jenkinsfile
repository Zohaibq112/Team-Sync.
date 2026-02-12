pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Zohaibq112/Team-Sync.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Start Containers') {
            steps {
                sh '''
                  docker compose down --remove-orphans || true
                  docker compose up -d backend frontend selenium
                '''
            }
        }

        stage('Wait for Services') {
            steps {
                sh 'sleep 15'
            }
        }

        stage('Run Selenium Tests') {
            steps {
                sh 'node tests/selenium/login.test.js'
            }
        }

        stage('Verify') {
            steps {
                sh 'docker compose ps'
            }
        }
    }

    post {
        failure {
            echo "❌ Tests failed. Stopping containers."
            sh 'docker compose down'
        }

        success {
            echo "✅ Tests passed. Containers are valid."
        }
    }
}
