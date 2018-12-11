
local session = require("resty.session").open()
if session.data.enc_id_token and ngx.var.cookie_ADRUM and ngx.var.cookie_ADRUM ~= session.data.ADRUM then
    session.data.ADRUM = ngx.var.cookie_ADRUM
    session:save()
end

