pipeline {
    agent any

    stages {
        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build'
            }
        }

    stage('Run Containers') {
    steps {
        sh '''
          docker-compose down --remove-orphans || true
          docker-compose up -d --force-recreate
        '''
    }
}


        stage('Verify') {
            steps {
                sh 'docker-compose ps'
            }
        }
    }
}
