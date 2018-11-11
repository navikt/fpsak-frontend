pipeline {
    agent {
        node {
            label 'DOCKER2'
        }
    }
    stages {
        stage('Deploy til t10') {
            steps {
                script {
                    dir ('k8s') {
                        echo '$TAG_NAME'
                        def tag = sh(returnStdout: true, script: "git tag --contains | head -1").trim()
                        echo tag
                        sh 'k config use-context preprod-fss'
                        sh "sed \'s/default/t10/g;s/RELEASE_VERSION/$TAG_NAME\' app.yaml | k apply -f -"
                    }
                }
            }
        }
    }
}
