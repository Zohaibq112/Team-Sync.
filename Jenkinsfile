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

        stage('Check Docker Availability') {
            steps {
                script {
                    try {
                        // Check if docker command exists
                        sh 'docker --version'
                        echo "✅ Docker is available!"
                    } catch (Exception e) {
                        echo "❌ Docker is NOT available!"
                        echo "Please make sure:"
                        echo "1. Docker is installed on the host machine"
                        echo "2. The Jenkins container has the Docker socket mounted"
                        echo "3. Run this command on your host to fix:"
                        echo "   docker exec -it jenkins_container_name sh -c 'apt-get update && apt-get install -y docker.io'"
                        currentBuild.result = 'FAILURE'
                        error("Docker is required but not found")
                    }
                }
            }
        }

        stage('Build and Test') {
            steps {
                script {
                    // Use docker compose directly (not inside a docker container)
                    sh '''
                        echo "=== Building images ==="
                        docker compose build
                        
                        echo "=== Starting containers ==="
                        docker compose down --remove-orphans || true
                        docker compose up -d
                        
                        echo "=== Waiting for services ==="
                        timeout=60
                        elapsed=0
                        while [ $elapsed -lt $timeout ]; do
                            if curl -s http://localhost:3000/health > /dev/null 2>&1; then
                                echo "✅ Backend is up!"
                                break
                            fi
                            echo "Waiting for backend... ($elapsed/$timeout)"
                            sleep 3
                            elapsed=$((elapsed+3))
                        done
                        
                        echo "=== Running Selenium Tests ==="
                        # Run tests in a node container
                        docker run --rm --network="host" -v ${PWD}:/app -w /app node:18 sh -c "npm install && node tests/selenium/login.test.js"
                        
                        echo "=== Container Status ==="
                        docker compose ps
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                echo "🧹 Cleaning up..."
                try {
                    sh 'docker compose down -v --remove-orphans'
                } catch (Exception e) {
                    echo "Cleanup warning: ${e.message}"
                }
            }
        }

        failure {
            script {
                echo "❌ Tests failed. Getting logs..."
                try {
                    sh '''
                        echo "=== Backend Logs ==="
                        docker compose logs backend --tail=50
                    '''
                } catch (Exception e) {
                    echo "Could not capture logs"
                }
            }
        }

        success {
            echo "✅ All tests passed!"
        }
    }
}