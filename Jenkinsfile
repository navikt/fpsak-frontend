
pipeline {
    agent {
        node {
            label 'DOCKER2'
        }
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Tag') {
            steps {
                script {
                    latestTag = sh(returnStdout: true, script: "git describe --abbrev=0 --tags").trim()
                }
                echo "${latestTag}"
            }
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
