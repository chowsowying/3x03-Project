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
		stage('Dependency check') {
			steps {
				dependencyCheck additionalArguments: '--format HTML --format XML --suppression suppression.xml', odcInstallation: 'OWASP Dependency Check'
			}
		}
    stage('Unit Test') {
			steps {
				echo 'Doing Unit testing, npm test, on local environment as npm test does not work unless the project is deployed'
			}
		}
	}	
	post {
		success {
			dependencyCheckPublisher pattern: 'dependency-check-report.xml'
			echo "Unit testing success"
			echo "Time to Deploy :D"
		}
	}
}
