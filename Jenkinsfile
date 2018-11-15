pipeline {
    agent {
        node {
            label 'DOCKER2'
        }
    }
    parameters {
        string(defaultValue: "t10", description: 'Miljø', name: 'miljø')
        string(defaultValue: '', description: 'Versjon Nummer', name: 'versjonNummer')
    }

    stages {
        stage('Deploy til t10') {
            steps {
                script {
                    dir ('k8s') {
                        def tag = sh(returnStdout: true, script: "git tag --contains | head -1").trim()
                        echo tag
                        sh 'k config use-context preprod-fss'
                        sh "k apply -f configmap.${miljø}.variabler.yaml"
                        sh "sed \'s/default/${miljø}/g;s/RELEASE_VERSION/${versjonNummer}/g\' app.yaml | k apply -f -"
                    }
                }
            }
        }
    }
}
