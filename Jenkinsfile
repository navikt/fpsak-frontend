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

                        def naisNamespace
                        if (miljø == "p") {
                            naisNamespace = "default"
                        } else {
                            naisNamespace = miljø
                        }
                        def exitCode=sh returnStatus: true, script: "k rollout status -n${naisNamespace} deployment/fpsak-frontend"
                        echo "exit code is $exitCode"

                        if(exitCode == 0) {
                            def veraPayload = "{\"environment\": \"${miljø}\",\"application\": \"fpsak-frontend\",\"version\": \"${versjonNummer}\",\"deployedBy\": \"Jenkins\"}"
                            def response = httpRequest([
                                    url                   : "https://vera.adeo.no/api/v1/deploylog",
                                    consoleLogResponseBody: true,
                                    contentType           : "APPLICATION_JSON",
                                    httpMode              : "POST",
                                    requestBody           : veraPayload,
                                    ignoreSslErrors       : true
                            ])
                        }



                        addBadge icon: '', id: '', link: '', text: "${miljø}-${versjonNummer}"
                    }
                }
            }
        }
    }
}
