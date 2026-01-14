pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                echo 'Code already cloned by Jenkins'
            }
        }

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

        stage('Pipeline Finished') {
            steps {
                echo 'MERN pipeline completed successfully 🎉'
            }
        }
    }
}
