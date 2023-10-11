pipeline {
    agent any
    stages {
        stage('Pull') {
            steps {
                echo 'Pulling...'
                echo 'Running pull...'
            }
        }
        stage('Push') {
            steps {
                echo 'Pushing...'
                echo 'Running push...'
            }
        }
    }
    
    post {
        success {
            echo 'Success...'
            echo 'Pull or Push status success'
        }
        failure {
            echo 'Failure...'
            echo 'Jialat :x not my fault!'
        }
    }

}
