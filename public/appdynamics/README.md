## Oppsett av Appdynamics EUM (end user monitoring)

Vi pakker bare raskt gjennom webpack. kjør kommandoen på rot for å få med babel-config.
```bash
webpack-cli ./public/appdynamics/eum.js -o ./public/appdynamics/eum.min.js --mode production --module-bind js=babel-loader
```
