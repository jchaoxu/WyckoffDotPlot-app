pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
    }
    stages {
        stage('Build') {
            steps {
                echo 'Building Ui...'
                sh "docker build -t dot-ui/${env.BRANCH_NAME} ./ui"
                echo 'Building Api...'
                sh "docker build -t dot-api/${env.BRANCH_NAME} ./api"
            }
        }
        stage('Deploy') {
            steps {
                echo "Deploying branch ${env.BRANCH_NAME}"
            }
        }
        stage ('Cleaning') {
            steps {
                sh 'docker system prune -f'
            }
        }
    }
}
