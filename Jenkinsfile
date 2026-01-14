pipeline {
    agent {
        docker {
            image 'node:18'
        }
    }

    stages {

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('client') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('client') {
                    sh 'npm run build'
                }
            }
        }

        stage('Success') {
            steps {
                echo '✅ MERN Jenkins Pipeline Completed Successfully'
            }
        }
    }
}
