pipeline {
    agent {
        // This runs the pipeline inside a Docker container with Docker pre-installed
        docker {
            image 'docker:latest'
            args '-v /var/run/docker.sock:/var/run/docker.sock -v /usr/bin/docker-compose:/usr/bin/docker-compose'
            label 'master' // or any agent label you have
        }
    }

    environment {
        DOCKER_HOST = 'unix:///var/run/docker.sock'
        COMPOSE_PROJECT_NAME = 'teamsync-${BUILD_NUMBER}'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Zohaibq112/Team-Sync.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Using Docker Pipeline Plugin to build images
                    def customImage = docker.build("teamsync-backend:${BUILD_NUMBER}", "./backend")
                    // You can also build multiple images
                    sh 'docker compose build'
                }
            }
        }

        stage('Start Containers') {
            steps {
                script {
                    try {
                        sh '''
                            docker compose down --remove-orphans || true
                            docker compose up -d backend frontend selenium
                        '''
                    } catch (Exception e) {
                        error "Failed to start containers: ${e.message}"
                    }
                }
            }
        }

        stage('Wait for Services') {
            steps {
                script {
                    // Better than sleep - wait for services to be healthy
                    sh '''
                        timeout=30
                        elapsed=0
                        while [ $elapsed -lt $timeout ]; do
                            if curl -s http://localhost:3000/health > /dev/null; then
                                echo "Backend is up!"
                                break
                            fi
                            sleep 2
                            elapsed=$((elapsed+2))
                        done
                    '''
                }
            }
        }

        stage('Run Selenium Tests') {
            steps {
                script {
                    // Using Docker Pipeline Plugin to run tests in container
                    docker.image('node:18').inside {
                        sh '''
                            npm install
                            node tests/selenium/login.test.js
                        '''
                    }
                }
            }
        }

        stage('Verify') {
            steps {
                script {
                    sh 'docker compose ps'
                    
                    // Using Docker Pipeline Plugin to inspect containers
                    def containers = docker.getContainers({
                        it.contains('teamsync')
                    })
                    echo "Running containers: ${containers}"
                }
            }
        }
    }

    post {
        always {
            script {
                echo "🧹 Cleaning up containers..."
                try {
                    sh 'docker compose down -v --remove-orphans'
                    
                    // Clean up images older than 5 builds
                    sh '''
                        docker image prune -f --filter "until=24h"
                    '''
                } catch (Exception e) {
                    echo "Cleanup warning: ${e.message}"
                }
            }
        }

        failure {
            script {
                echo "❌ Tests failed. Check logs above."
                // Capture container logs for debugging
                sh '''
                    docker compose logs backend --tail=50
                    docker compose logs selenium --tail=50
                '''
            }
        }

        success {
            echo "✅ Tests passed. Containers are valid."
        }
    }
}