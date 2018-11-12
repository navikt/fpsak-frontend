pipeline {
    agent {
        node {
            label 'DOCKER2'
        }
    }
    stages {
        stage('Tag') {
            def latestTag = sh 'git describe --abbrev=0 --tags'
            echo "$latestTag"
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
