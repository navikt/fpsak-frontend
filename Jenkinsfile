pipeline {
    agent {
        node {
            label 'DOCKER2'
        }
    }
    parameters {
        string(defaultValue: "t10", description: 'Miljø*', name: 'miljø')
        string(defaultValue: '', description: 'Versjon Nummer*', name: 'versjonNummer')
    }
    stages {
        stage('Deploy Til Miljø') {
            steps {
                script {
                    dir ('k8s') {
                        def props = readProperties  interpolate: true, file: "application.${miljø}.variabler.properties"
                        def value = "s/RELEASE_VERSION/${versjonNummer}/g"
                        props.each{ k,v -> value=value+";s%$k%$v%g" }
                        sh "k config use-context $props.CONTEXT_NAME"
                        sh "sed \'$value\' app.yaml | k apply -f -"
                        addBadge icon: '', id: '', link: '', text: "${miljø}-${versjonNummer}"
                    }
                }
            }
        }
    }
}
