pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "teamsync-${BUILD_NUMBER}"
        AWS_REGION           = 'us-east-1'
        ECR_REPO_BACKEND     = 'team-sync-backend'
        ECR_REPO_FRONTEND    = 'team-sync-frontend'
        IMAGE_TAG            = "${BUILD_NUMBER}"
        EC2_HOST             = '44.220.177.147'
        EC2_USER             = 'ec2-user'
    }

    stages {

        // 0. Verify AWS
        stage('Verify AWS') {
            steps {
                withCredentials([
                    [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']
                ]) {
                    sh '''
                        aws sts get-caller-identity
                        aws ecr describe-repositories --region $AWS_REGION
                    '''
                }
            }
        }

        // 1. Cleanup
        stage('Cleanup') {
            steps {
                sh '''
                    docker-compose down -v || true
                    docker rm -f backend frontend || true
                    docker network prune -f || true
                    docker ps -a
                '''
            }
        }

        // 2. Checkout
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Zohaibq112/Team-Sync.git'
            }
        }

        // 3. Check Docker
        stage('Check Docker') {
            steps {
                sh 'docker --version'
                sh 'docker-compose version'
                echo "Docker and Compose OK"
            }
        }

        // 4. Build Images
        stage('Build Images') {
            steps {
                sh 'docker-compose build'
            }
        }

        // 5. Start Containers
        stage('Start Containers') {
            steps {
                sh '''
                    docker-compose up -d
                    sleep 20
                    docker-compose ps
                '''
            }
        }

        // 6. Run Selenium Tests
        stage('Run Selenium Tests') {
            steps {
                sh '''
                    cd tests/selenium
                    export FRONTEND_HOST=host.docker.internal
                    export BACKEND_HOST=host.docker.internal
                    npm install
                    node login.test.js
                '''
            }
        }

        // 7. Push Backend Image to ECR
        stage('Push Backend to ECR') {
            steps {
                withCredentials([
                    [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials'],
                    string(credentialsId: 'ecr-registry', variable: 'ECR_REGISTRY')
                ]) {
                    sh '''
                        echo "=== Logging into ECR ==="
                        aws ecr get-login-password --region $AWS_REGION | \
                        docker login --username AWS --password-stdin $ECR_REGISTRY

                        echo "=== Tagging Backend Image ==="
                        docker tag ${COMPOSE_PROJECT_NAME}_backend:latest $ECR_REGISTRY/$ECR_REPO_BACKEND:$IMAGE_TAG
                        docker tag ${COMPOSE_PROJECT_NAME}_backend:latest $ECR_REGISTRY/$ECR_REPO_BACKEND:latest

                        echo "=== Pushing Backend to ECR ==="
                        docker push $ECR_REGISTRY/$ECR_REPO_BACKEND:$IMAGE_TAG
                        docker push $ECR_REGISTRY/$ECR_REPO_BACKEND:latest
                        echo "=== Backend Push Complete ==="
                    '''
                }
            }
        }

        // 8. Push Frontend Image to ECR
        stage('Push Frontend to ECR') {
            steps {
                withCredentials([
                    [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials'],
                    string(credentialsId: 'ecr-registry', variable: 'ECR_REGISTRY')
                ]) {
                    sh '''
                        echo "=== Tagging Frontend Image ==="
                        docker tag ${COMPOSE_PROJECT_NAME}_frontend:latest $ECR_REGISTRY/$ECR_REPO_FRONTEND:$IMAGE_TAG
                        docker tag ${COMPOSE_PROJECT_NAME}_frontend:latest $ECR_REGISTRY/$ECR_REPO_FRONTEND:latest

                        echo "=== Pushing Frontend to ECR ==="
                        docker push $ECR_REGISTRY/$ECR_REPO_FRONTEND:$IMAGE_TAG
                        docker push $ECR_REGISTRY/$ECR_REPO_FRONTEND:latest
                        echo "=== Frontend Push Complete ==="
                    '''
                }
            }
        }

        // 9. Deploy to EC2
        stage('Deploy to EC2') {
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY'),
                    [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials'],
                    string(credentialsId: 'ecr-registry', variable: 'ECR_REGISTRY'),
                    string(credentialsId: 'mongodb-uri',  variable: 'MONGODB_URI')
                ]) {
                    sh '''
                        echo "=== Deploying to EC2 ==="
                        ssh -o StrictHostKeyChecking=no -i $SSH_KEY $EC2_USER@$EC2_HOST "
                            aws ecr get-login-password --region $AWS_REGION | \
                            docker login --username AWS --password-stdin $ECR_REGISTRY

                            docker pull $ECR_REGISTRY/$ECR_REPO_BACKEND:latest
                            docker pull $ECR_REGISTRY/$ECR_REPO_FRONTEND:latest

                            docker stop backend frontend || true
                            docker rm backend frontend   || true

                            docker run -d \
                                -p 3000:3000 \
                                -e MONGODB_URI='$MONGODB_URI' \
                                -e PORT=3000 \
                                --restart always \
                                --name backend \
                                $ECR_REGISTRY/$ECR_REPO_BACKEND:latest

                            docker run -d \
                                -p 80:80 \
                                -e VITE_API_URL=http://$EC2_HOST:3000 \
                                --restart always \
                                --name frontend \
                                $ECR_REGISTRY/$ECR_REPO_FRONTEND:latest

                            echo 'Deployment complete'
                            docker ps
                        "
                    '''
                }
            }
        }

        // 10. Health Check
        stage('Health Check') {
            steps {
                sh '''
                    sleep 10
                    curl -f http://$EC2_HOST:3000/api/health || exit 1
                    echo "Backend is healthy"
                '''
            }
        }
    }

    // Post Actions
    post {
        always {
            node('') {
                sh 'docker-compose down -v || true'
            }
        }
        failure {
            node('') {
                sh '''
                    docker-compose logs --tail 50 backend  || true
                    docker-compose logs --tail 50 frontend || true
                    docker-compose logs --tail 50 selenium || true
                '''
            }
        }
        success {
            echo "All tests passed and deployment successful!"
        }
    }
}