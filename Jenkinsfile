pipeline {
	agent any
	stages{
		stage('Build'){
			steps{
				sh 'yarn'
			}
		}
		stage('Deploy'){
			steps{
				sh 'yarn start'
			}
		}
	}
}
