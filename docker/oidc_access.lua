local cookie_secure = "secure; "
local cookie_domain = ""
local is_authorized = false;
-- creating the proxy cookie string
local proxy_cookie = {}

if ngx.var.host == "localhost" then
    ngx.var.app_baseurl = "http://localhost:" .. ngx.var.server_port
    local openidc = require("resty.openidc")
    openidc.set_logging(nil, { DEBUG = ngx.INFO })
    ngx.var.session_cookie_secure = "off"
    cookie_secure = ""
else
    ngx.var.session_cookie_secure = "on"
    cookie_domain = "domain=." .. string.match(ngx.var.host, "%.(.*)") .. "; "
end

local opts = {
    redirect_uri = ngx.var.app_baseurl .. ngx.var.app_callback_path,
    client_id = ngx.var.oidc_agentname,
    client_secret = ngx.var.oidc_password,
    scope = "openid",
    ssl_verify = "no",
    token_endpoint_auth_method = "client_secret_basic",
    discovery = ngx.var.oidc_host_url .. "/oauth2/.well-known/openid-configuration",
    access_token_expires_leeway = 240,
    renew_access_token_on_expiry = true,
    auth_accept_token_as = "cookie:ID_token",
    session_contents = {
        id_token = true,
        enc_id_token = true,
        user = true,
        access_token = true
    }
}

-- If request comes with an Authorization-header we just pass that through.
if ngx.req.get_headers()["Authorization"] then
    is_authorized = true
end

-- Allow for session less authentication. For instance for running cypress tests.
if ngx.var.cookie_ID_token then
    local json, err = require("resty.openidc").jwt_verify(ngx.var.cookie_ID_token, opts)
    if json and not err then
        proxy_cookie.ID_token = ngx.var.cookie_ID_token
        is_authorized = true
    end
end

-- if not autorized then we start that flow.
-- no session is needed if we don't need to get an ID_token.
if not is_authorized then
    -- starting session manual to set some default cookies, etc
    local session, err_session = require("resty.session").start()

    if not session and err_session then
        ngx.status = 500
        ngx.header.content_type = 'text/plain';
        ngx.say("Problem with getting the session: ", err_session)
        ngx.exit(ngx.HTTP_INTERNAL_SERVER_ERROR)
    end

    if ngx.var.cookie_ADRUM and ngx.var.cookie_ADRUM ~= session.data.ADRUM then
        session.data.ADRUM = ngx.var.cookie_ADRUM
    end

    -- syncing cookie from request
    if ngx.var.cookie_ID_token then
        local json, err = require("resty.openidc").jwt_verify(ngx.var.cookie_ID_token, opts)
        -- manually setting access_token_expiration so that an old token get expired
        if json then
            session.data.access_token_expiration = json.exp
        else
            session.data.access_token_expiration = 0
        end
    end

    local unauth_action
    -- dont reautenticate on XHR
    if ngx.var.http_x_requested_with == "XMLHttpRequest" then
        unauth_action = 'pass'
    end

    local res, err = require("resty.openidc").authenticate(opts, nil, unauth_action, session)

    if err then
        ngx.status = 500
        ngx.header.content_type = 'text/plain';
        ngx.say(err)
        ngx.exit(ngx.HTTP_INTERNAL_SERVER_ERROR)
    end

    if ngx.var.uri == ngx.var.app_callback_path then
        return ngx.redirect(ngx.var.app_path_prefix)
    end

    -- syncing cookie from auth result
    if session.data.enc_id_token and ngx.var.cookie_ID_token ~= session.data.enc_id_token then
        -- manually setting access_token_expiration so that it will refresh correctly
        session.data.access_token_expiration = session.data.id_token.exp;
        ngx.header['Set-Cookie'] = 'ID_token=' .. session.data.enc_id_token .. '; ' .. cookie_secure .. cookie_domain .. 'path=/; SameSite=Lax; HttpOnly'
    end

    -- adding ADRUM cookie from session if existing
    if session.data.ADRUM then
        proxy_cookie.ADRUM = session.data.ADRUM
    end

    -- adding ID_token if logged in
    if session.data.enc_id_token then
        proxy_cookie.ID_token = session.data.enc_id_token
    end
end

if not proxy_cookie.ADRUM and ngx.var.cookie_ADRUM then
    proxy_cookie.ADRUM = ngx.var.cookie_ADRUM
end

local proxy_cookie_string = ""
for k, v in pairs(proxy_cookie) do
    proxy_cookie_string = proxy_cookie_string .. k .. "=" .. v .. ";"
end
ngx.var.proxy_cookie = proxy_cookie_string
