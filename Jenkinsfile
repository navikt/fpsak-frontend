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
                        def ingress = "https://"
                        if("${miljø}"=="p"){
                            ingress=ingress+"fpsak-frontend-t10.nais.preprod.local"
                        }else{
                            ingress=ingress+"fpsak-frontend-${miljø}.nais.preprod.local"
                        }
                        echo "$ingress"
                        def tag = sh(returnStdout: true, script: "git tag --contains | head -1").trim()
                        echo tag
                        sh 'k config use-context preprod-fss'
                        sh "k apply -f configmap.${miljø}.variabler.yaml"
                        sh "sed \'s/default/${miljø}/g;s/RELEASE_VERSION/${versjonNummer}/g;s/ingress/${versjonNummer}/g\' app.yaml"
                    }
                }
            }
        }
    }
}
