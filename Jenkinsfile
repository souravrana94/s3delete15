pipeline {
  agent any
  environment {
    registry_master = 'evolv-workout-front'
  }
  stages {
    stage('Build'){
      stages{
        stage('Main Build') {
          steps {
            echo "Building for main"
            sh "docker build . -t $registry_master:latest --memory=800m"
          }
        }
      }
    }
    stage('Push to ECR') {
      stages {
        stage('Push Main Image ECR') {
          steps {
              script{
                docker.withRegistry(
                  'https://227644801203.dkr.ecr.us-east-2.amazonaws.com',
                  'ecr:us-east-2:aws'
                ) {
                  docker.image('$registry_master:latest').push('$BUILD_NUMBER')
                }
              }
            }
          }
      }
    }
    stage('Stop Builds') {
      stages{ 
        stage('Stop Main build') {
          steps {
            sh 'docker stop main-evolv-workout || true && docker rm main-evolv-workout || true'
          }
        }
      }
    }
    stage('Deployment') {
      stages {
        stage('Deploy Main') {
            steps {
            sh "docker run -p 8091:3000 --name main-evolv-workout -d $registry_master:latest"
            }
        }
      }
    }
    stage('Cleanup Workspace') {
      steps {
        sh 'docker image prune -a -f'
        sh 'docker container prune -f'
        sh 'docker volume prune -f'
      }
    }

  }  
}