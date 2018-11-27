--
-- Created by IntelliJ IDEA.
-- User: J138369
-- Date: 11/23/18
-- Time: 5:37 PM
-- To change this template use File | Settings | File Templates.
--
local session = require("resty.session").open()
if session.data.enc_id_token and ngx.var.cookie_ADRUM and ngx.var.cookie_ADRUM ~= session.data.ADRUM then
    session.data.ADRUM = ngx.var.cookie_ADRUM
    session:save()
end

