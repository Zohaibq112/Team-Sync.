pipeline {
    agent any
    
    environment {
        DOCKER_HOST = 'unix:///var/run/docker.sock'
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
                script {
                    sh 'docker --version'
                    sh 'docker-compose --version'
                    echo "✅ Docker and Docker-Compose are available!"
                }
            }
        }

        stage('Build Images') {
            steps {
                script {
                    sh '''
                        echo "=== Building all images with docker-compose ==="
                        docker-compose build
                    '''
                }
            }
        }

        stage('Start Containers') {
            steps {
                script {
                    sh '''
                        echo "=== Starting containers ==="
                        docker-compose up -d
                        
                        echo "=== Waiting for services to start ==="
                        sleep 20
                        
                        echo "=== Container Status ==="
                        docker-compose ps
                    '''
                }
            }
        }

        stage('Run Selenium Tests') {
            steps {
                script {
                    sh '''
                        echo "=== Running Selenium Tests ==="
                        # Check if test file exists
                        if [ -f "tests/selenium/login.test.js" ]; then
                            # Install dependencies and run tests
                            cd tests/selenium
                            npm init -y
                            npm install selenium-webdriver
                            node login.test.js
                        else
                            echo "Test file not found at tests/selenium/login.test.js"
                            # Find any test files
                            find . -name "*.test.js" 2>/dev/null || echo "No test files found"
                        fi
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                echo "🧹 Cleaning up..."
                sh 'docker-compose down -v'
            }
        }

        failure {
            script {
                echo "❌ Tests failed. Getting logs..."
                sh '''
                    docker-compose logs backend --tail=50
                    docker-compose logs frontend --tail=50
                    docker-compose logs selenium --tail=50
                '''
            }
        }

        success {
            echo "✅ All tests passed!"
        }
    }
}