pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        UI_DEPLOYMENT = credentials('dotAppUiDeployTrigger');
        API_DEPLOYMENT = credentials('dotAppApiDeployTrigger');
    }
    stages {
        stage('Docker Login') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Building Ui...'
                sh 'docker build -t $DOCKERHUB_CREDENTIALS_USR/dot-ui:latest ./ui'
                echo 'Building Api...'
                sh 'docker build -t $DOCKERHUB_CREDENTIALS_USR/dot-api:latest ./api'
                echo "Deploying branch ${env.BRANCH_NAME}"
                echo "Pushing UI image"
                sh 'docker push $DOCKERHUB_CREDENTIALS_USR/dot-ui:latest'
                echo "Pushing API iamge"
                sh 'docker push $DOCKERHUB_CREDENTIALS_USR/dot-api:latest'
                echo "Deploying UI"
                sh '$UI_DEPLOYMENT'
                echo "Deploying API"
                sh '$API_DEPLOYMENT'
            }
        }
        stage ('Cleaning') {
            steps {
                sh 'docker system prune -f'
            }
        }
    }
}
