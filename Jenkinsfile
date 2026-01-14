pipeline {
<<<<<<< HEAD
    agent {
        docker {
            image 'node:18'
        }
    }

    stages {

=======
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                echo 'Code already cloned by Jenkins'
            }
        }

>>>>>>> 65929749f2ce12cb0ba887cde65013314a760be5
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

<<<<<<< HEAD
        stage('Success') {
            steps {
                echo '✅ MERN Jenkins Pipeline Completed Successfully'
=======
        stage('Pipeline Finished') {
            steps {
                echo 'MERN pipeline completed successfully 🎉'
>>>>>>> 65929749f2ce12cb0ba887cde65013314a760be5
            }
        }
    }
}
