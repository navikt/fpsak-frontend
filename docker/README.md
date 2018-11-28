

Hvis man trenger å hente bare ID_Token sessionen.

```lua
access_by_lua_block {
    local session = require("resty.session").open()
    if session.data.enc_id_token then
        ngx.var.proxy_id_cookie = session.data.enc_id_token
    end        
}
```



Konfig er skreddersydd til openam hos NAV.

### TODO 
* Ta i bruk REDIS for å lagre sessionsdata.
* Lage dette om til et baseimage for gjenbrukbarhet.
* Lese location config fra en mappe for customization.
* Gjøre app-dynamics til en del av baseimage.
* 
