pipeline {
    agent any
    
    environment {
        COMPOSE_PROJECT_NAME = "teamsync-${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Zohaibq112/Team-Sync.git'
            }
        }

        stage('Check Docker') {
            steps {
                sh 'docker --version'
                sh 'docker-compose version'
                echo "Docker & Compose OK"
            }
        }

        stage('Build Images') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Start Containers') {
            steps {
                sh '''
                    docker-compose up -d
                    sleep 20
                    docker-compose ps
                '''
            }
        }

       stage('Run Selenium Tests') {
    steps {
        sh '''
            cd tests/selenium
            export SELENIUM_HOST=team-sync-selenium
            export FRONTEND_HOST=teamsync-17_frontend_1
            export FRONTEND_PORT=80
            npm install
            node login.test.js
        '''
    }
}
    }

    post {
        always {
            sh 'docker-compose down -v'
        }

        failure {
            sh '''
                docker-compose logs backend --tail=50
                docker-compose logs frontend --tail=50
                docker-compose logs selenium --tail=50
            '''
        }

        success {
            echo "All tests passed!"
        }
    }
}
