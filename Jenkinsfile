pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                parallel {
                    ui: {
                        echo 'Building Ui...'
                    }
                    api: {
                        echo 'Building Api...'
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                echo "Deploying branch ${env.BRANCH_NAME}"
            }
        }
    }
}
