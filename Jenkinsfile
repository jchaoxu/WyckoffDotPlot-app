pipeline {
    agent any

    stage('Build') {
        parallel ui: {
            echo 'Building Ui...'
        },
        api: {
            echo 'Building Api...'
        }
    }
    stage('Deploy') {
        echo "Deploying branch ${env.BRANCH_NAME}"
    }
}
