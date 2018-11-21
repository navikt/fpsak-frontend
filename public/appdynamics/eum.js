(function (config, eumgw, jsag) {
  window['adrum-start-time'] = new Date().getTime();
  if (window.location.href.indexOf('fpsak.nais.adeo.no') > -1 || window.location.href.indexOf('app.adeo.no') > -1) {
    config.appKey = 'EUM-AAB-AVP';
  } else {
    config.appKey = 'EUM-AAB-AVR';
  }
  config.beaconUrlHttp = `https://${eumgw}`;
  config.beaconUrlHttps = `https://${eumgw}`;
  config.adrumExtUrlHttp = `https://${jsag}`;
  config.adrumExtUrlHttps = `https://${jsag}`;
  config.xd = { enable: false };
  config.spa = { spa2: true };
  const jsagent = document.createElement('script');
  jsagent.src = `https://${jsag}/adrum/adrum.js`;
  jsagent.type = 'text/javascript';
  jsagent.async = true;
  document.head.appendChild(jsagent);
}(window['adrum-config'] || (window['adrum-config'] = {}), 'eumgw.adeo.no', 'jsagent.adeo.no'));
