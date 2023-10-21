pipeline {
	agent any
	tools{
        nodejs 'NodeJS18.7'
    }
	stages {
		stage('Build') {
			steps {
				git branch: 'main', url: 'https://github.com/chowsowying/3x03-Project.git', credentialsId: 'wangu'
			}
		}
        stage('Install Dependencies') {
            steps {
                script {
                    dir('frontend') {
                        sh 'npm i'
                    }
                    dir('backend') {
                        sh 'npm i'
                    }
                }
            }
        }
		stage('Test') {
			steps {
				dependencyCheck additionalArguments: '--format HTML --format XML', odcInstallation: 'OWASP Dependency Check'
				echo'Unit testing'
				echo 'selenium ? test'
			}
		}
	}	
	post {
		success {
			dependencyCheckPublisher pattern: 'dependency-check-report.xml'
		}
	}
}
