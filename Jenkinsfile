pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "teamsync-${BUILD_NUMBER}"
        AWS_REGION           = 'us-east-1'
        ECR_REGISTRY         = credentials('ecr-registry')       // 123456789.dkr.ecr.us-east-1.amazonaws.com
        ECR_REPO_BACKEND     = 'team-sync-backend'
        ECR_REPO_FRONTEND    = 'team-sync-frontend'
        IMAGE_TAG            = "${BUILD_NUMBER}"
        EC2_HOST             = '98.92.46.165'
        EC2_USER             = 'ec2-user'
        MONGODB_URI          = credentials('mongodb-uri')
    }

    stages {

        // ─── 1. Checkout ────────────────────────────────────────
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Zohaibq112/Team-Sync.git'
            }
        }

        // ─── 2. Check Docker ────────────────────────────────────
        stage('Check Docker') {
            steps {
                sh 'docker --version'
                sh 'docker-compose version'
                echo "Docker & Compose OK ✅"
            }
        }

        // ─── 3. Build Images ────────────────────────────────────
        stage('Build Images') {
            steps {
                sh 'docker-compose build'
            }
        }

        // ─── 4. Start Containers ────────────────────────────────
        stage('Start Containers') {
            steps {
                sh '''
                    docker-compose up -d
                    sleep 20
                    docker-compose ps
                '''
            }
        }

        // ─── 5. Run Selenium Tests ──────────────────────────────
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

        // ─── 6. Push Backend Image to ECR ───────────────────────
        stage('Push Backend to ECR') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-credentials'
                ]]) {
                    sh '''
                        aws ecr get-login-password --region $AWS_REGION | \
                        docker login --username AWS --password-stdin $ECR_REGISTRY

                        docker tag backend-container:latest $ECR_REGISTRY/$ECR_REPO_BACKEND:$IMAGE_TAG
                        docker tag backend-container:latest $ECR_REGISTRY/$ECR_REPO_BACKEND:latest

                        docker push $ECR_REGISTRY/$ECR_REPO_BACKEND:$IMAGE_TAG
                        docker push $ECR_REGISTRY/$ECR_REPO_BACKEND:latest
                    '''
                }
            }
        }

        // ─── 7. Push Frontend Image to ECR ──────────────────────
        stage('Push Frontend to ECR') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-credentials'
                ]]) {
                    sh '''
                        docker tag frontend-container:latest $ECR_REGISTRY/$ECR_REPO_FRONTEND:$IMAGE_TAG
                        docker tag frontend-container:latest $ECR_REGISTRY/$ECR_REPO_FRONTEND:latest

                        docker push $ECR_REGISTRY/$ECR_REPO_FRONTEND:$IMAGE_TAG
                        docker push $ECR_REGISTRY/$ECR_REPO_FRONTEND:latest
                    '''
                }
            }
        }

        // ─── 8. Deploy to EC2 ───────────────────────────────────
        stage('Deploy to EC2') {
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'ec2-ssh-key',
                        keyFileVariable: 'SSH_KEY'
                    ),
                    [$class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'aws-credentials'
                    ]
                ]) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no -i $SSH_KEY $EC2_USER@$EC2_HOST "
                            # Login to ECR
                            aws ecr get-login-password --region $AWS_REGION | \
                            docker login --username AWS --password-stdin $ECR_REGISTRY

                            # Pull latest images
                            docker pull $ECR_REGISTRY/$ECR_REPO_BACKEND:latest
                            docker pull $ECR_REGISTRY/$ECR_REPO_FRONTEND:latest

                            # Stop and remove old containers
                            docker stop backend frontend || true
                            docker rm backend frontend   || true

                            # Start backend
                            docker run -d \
                                -p 3000:3000 \
                                -e MONGODB_URI='$MONGODB_URI' \
                                -e PORT=3000 \
                                --restart always \
                                --name backend \
                                $ECR_REGISTRY/$ECR_REPO_BACKEND:latest

                            # Start frontend
                            docker run -d \
                                -p 80:80 \
                                -e VITE_API_URL=http://$EC2_HOST:3000 \
                                --restart always \
                                --name frontend \
                                $ECR_REGISTRY/$ECR_REPO_FRONTEND:latest
                        "
                    '''
                }
            }
        }

        // ─── 9. Health Check ────────────────────────────────────
        stage('Health Check') {
            steps {
                sh '''
                    sleep 10
                    curl -f http://$EC2_HOST:3000/api/health || exit 1
                    echo "Backend is healthy ✅"
                '''
            }
        }
    }

    // ─── Post Actions ────────────────────────────────────────
    post {
        always {
            sh 'docker-compose down -v'
        }

        failure {
            sh '''
                docker-compose logs backend  --tail=50
                docker-compose logs frontend --tail=50
                docker-compose logs selenium --tail=50
            '''
        }

        success {
            echo "✅ All tests passed and deployment successful!"
        }
    }
}