pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "teamsync-${BUILD_NUMBER}"
        AWS_REGION           = 'us-east-1'
        ECR_REPO_BACKEND     = 'team-sync-backend'
        ECR_REPO_FRONTEND    = 'team-sync-frontend'
        IMAGE_TAG            = "${BUILD_NUMBER}"
        EC2_HOST             = '100.54.39.187'
        EC2_USER             = 'ec2-user'
    }

    stages {

        stage('Cleanup') {
            steps {
                sh 'docker-compose down -v || true'
                sh 'docker rm -f backend frontend || true'
                sh 'docker network prune -f || true'
                sh 'docker ps -a'
            }
        }

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Zohaibq112/Team-Sync.git'
            }
        }

        stage('Check Docker') {
            steps {
                sh 'docker --version'
                sh 'docker-compose version'
                echo 'Docker and Compose OK'
            }
        }

        stage('Build Images') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Start Containers') {
            steps {
                sh 'docker-compose up -d'
                sh 'sleep 20'
                sh 'docker-compose ps'
            }
        }

        stage('Run Selenium Tests') {
            steps {
                sh '''
                    cd tests/selenium
                    export SELENIUM_HOST=host.docker.internal
                    export FRONTEND_HOST=host.docker.internal
                    npm install
                    node login.test.js
                '''
            }
        }

        stage('Push Backend to ECR') {
            steps {
                withCredentials([
                    [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials'],
                    string(credentialsId: 'ecr-registry', variable: 'ECR_REGISTRY')
                ]) {
                    sh '''
                        echo === Logging into ECR ===
                        aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

                        echo === Tagging Backend Image ===
                        docker tag teamsync-${BUILD_NUMBER}_backend:latest $ECR_REGISTRY/$ECR_REPO_BACKEND:$IMAGE_TAG
                        docker tag teamsync-${BUILD_NUMBER}_backend:latest $ECR_REGISTRY/$ECR_REPO_BACKEND:latest

                        echo === Pushing Backend to ECR ===
                        docker push $ECR_REGISTRY/$ECR_REPO_BACKEND:$IMAGE_TAG
                        docker push $ECR_REGISTRY/$ECR_REPO_BACKEND:latest
                        echo === Backend Push Complete ===
                    '''
                }
            }
        }

        stage('Push Frontend to ECR') {
            steps {
                withCredentials([
                    [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials'],
                    string(credentialsId: 'ecr-registry', variable: 'ECR_REGISTRY')
                ]) {
                    sh '''
                        echo === Tagging Frontend Image ===
                        docker tag teamsync-${BUILD_NUMBER}_frontend:latest $ECR_REGISTRY/$ECR_REPO_FRONTEND:$IMAGE_TAG
                        docker tag teamsync-${BUILD_NUMBER}_frontend:latest $ECR_REGISTRY/$ECR_REPO_FRONTEND:latest

                        echo === Pushing Frontend to ECR ===
                        docker push $ECR_REGISTRY/$ECR_REPO_FRONTEND:$IMAGE_TAG
                        docker push $ECR_REGISTRY/$ECR_REPO_FRONTEND:latest
                        echo === Frontend Push Complete ===
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY'),
                    [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials'],
                    string(credentialsId: 'ecr-registry', variable: 'ECR_REGISTRY'),
                    string(credentialsId: 'mongodb-uri', variable: 'MONGODB_URI')
                ]) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no -i $SSH_KEY $EC2_USER@$EC2_HOST "
                            echo === Installing Docker if not present ===
                            which docker || (yum update -y && yum install -y docker && service docker start && usermod -a -G docker ec2-user)
                            service docker start || true

                            echo === Installing AWS CLI if not present ===
                            which aws || yum install -y aws-cli

                            echo === Logging into ECR ===
                            aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

                            echo === Stopping existing containers ===
                            docker stop backend frontend || true
                            docker rm backend frontend || true

                            echo === Pulling latest images ===
                            docker pull $ECR_REGISTRY/$ECR_REPO_BACKEND:latest
                            docker pull $ECR_REGISTRY/$ECR_REPO_FRONTEND:latest

                            echo === Starting backend ===
                            docker run -d \
                                -p 3000:3000 \
                                -e MONGODB_URI=$MONGODB_URI \
                                -e PORT=3000 \
                                --restart always \
                                --name backend \
                                $ECR_REGISTRY/$ECR_REPO_BACKEND:latest

                            echo === Starting frontend ===
                            docker run -d \
                                -p 80:80 \
                                --restart always \
                                --name frontend \
                                $ECR_REGISTRY/$ECR_REPO_FRONTEND:latest

                            echo === Deployment complete ===
                            docker ps
                        "
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                sh 'sleep 15'
                sh 'curl -f http://$EC2_HOST:3000/api/health || exit 1'
                echo 'Backend is healthy'
            }
        }
    }

    post {
        always {
            node('') {
                sh 'docker-compose down -v || true'
            }
        }
        failure {
            node('') {
                sh 'docker-compose logs --tail 50 backend || true'
                sh 'docker-compose logs --tail 50 frontend || true'
                sh 'docker-compose logs --tail 50 selenium || true'
            }
        }
        success {
            echo 'All tests passed and deployment successful!'
        }
    }
}