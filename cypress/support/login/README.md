# OpenID Connect

`cypress.env.json`

```json 
{
  "OIDC_AGENTNAME": "xxx",
  "OIDC_COOKIE_NAME": "xxx",
  "OIDC_HOST_URL": "https://xxx.no:443/isso/oauth2",
  "OIDC_PASSWORD": "xxx",
  "OIDC_REDIRECT_URI": "xxx",
}
```

merk redirect uri skal bare være en uri som fungerer med brukernavn og passord.



```bash
node ./cypress/support/login/examples/get-token-with-axios.js
```

