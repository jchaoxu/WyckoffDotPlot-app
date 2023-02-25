pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building Ui...'
                echo 'Building Api...'
            }
        }
        stage('Deploy') {
            steps {
                echo "Deploying branch ${env.BRANCH_NAME}"
            }
        }
    }
}
