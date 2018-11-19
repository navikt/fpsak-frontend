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
                        def namespace = "${miljø}"
                        if("${miljø}"=="p"){
                            ingress=ingress+"fpsak-frontend.nav.no"
                            namespace="default"
                        }else{
                            ingress=ingress+"fpsak-frontend-${miljø}.nais.preprod.local"
                        }
                        echo "$ingress"
                        sh 'k config use-context preprod-fss'
                        sh "k apply -f configmap.${miljø}.variabler.yaml"
                        sh "sed \'s/default/$namespace/g;s/RELEASE_VERSION/${versjonNummer}/g;s%INGRESS_URL%$ingress%g\' app.yaml"
                    }
                }
            }
        }
    }
}
