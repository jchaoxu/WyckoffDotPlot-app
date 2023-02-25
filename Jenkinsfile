pipeline {
    agent any

    stages {
        stage('Build') {
            parallel ui: {
                steps {
                    echo 'Building Ui...'
                }
            },
            api: {
                steps {
                    echo 'Building Api...'
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
