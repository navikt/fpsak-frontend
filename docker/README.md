

Hvis man trenger å hente bare ID_Token sessionen.

```lua
access_by_lua_block {
    local session = require("resty.session").open()
    if session.data.enc_id_token then
        ngx.var.proxy_id_cookie = session.data.enc_id_token
    end        
}
```
