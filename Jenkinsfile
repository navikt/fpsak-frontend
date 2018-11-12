pipeline {
    agent {
        node {
            label 'DOCKER2'
        }
    }
    stages {
        stage('Tag') {
            def latestTag = sh 'git tag --sort version:refname | tail -1'
        }
        stage('Build image') {
            steps {
                echo 'Starting to build docker image'


            }
        }
        stage('Deploy til preprod') {
            steps {
                echo 'TODO teste'

            }
        }
    }
}
