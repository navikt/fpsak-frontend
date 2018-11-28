

Hvis man trenger å hente bare ID_Token sessionen.

```lua
access_by_lua_block {
    local session = require("resty.session").open()
    if session.data.enc_id_token then
        ngx.var.proxy_id_cookie = session.data.enc_id_token
    end        
}

# dette funger ikke...
proxy_redirect   "~*${APP_API_PATH}(.+)$" "${APP_API_PATH}$1";
header_filter_by_lua_block {
    if ngx.header.location and ngx.var.host ~= "localhost" then
        -- local location_path = string.match(ngx.header.location, ":${APP_PORT}(.*)")
        -- ngx.header["Location"] = "https://" .. ngx.var.host .. location_path
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
