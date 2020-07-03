Håndterer rest-kall mot backend via Axios.

Eksempel: 
```javascript
import { createRequestApi, RequestConfig } from '@fpsak-frontend/rest-api';

const contextPath = 'fpsak';
const requestConfigs: [
    new RequestConfig('FAGSAK_SOK', '/api/fagsak/sok').withGetMethod(),
    new RequestConfig('LAGRE_FAGSAK', '/api/fagsak/lagre').withPostMethod()
];
const requestApi = createRequestApi(contextPath, requestConfigs);

//Utfør kall (responsen vil være et Promise med data på formatet {payload: responsdata})
const params = {saksnummer: 1};
const payload = requestApi.getRequestRunner('FAGSAK_SOK').startProcess(params);
```


Forenkling av oppsett av endepunktene ved bruk av builder:
```javascript
import { createRequestApi, RestApiConfigBuilder } from '@fpsak-frontend/rest-api';

const endpoints = new RestApiConfigBuilder()
  .withGet('/api/fagsak/sok', 'FAGSAK_SOK')
  .withPost('/api/fagsak/lagre', 'LAGRE_FAGSAK')
  .build();

const requestApi = createRequestApi(contextPath, endpoints);
```


Konfigurering av ekstra parametere for et request: (Med og uten bruk av builder.)
```javascript
    new RequestConfig('FAGSAK_SOK', '/api/fagsak/sok', {maxPollingLimit: 100}).withAsyncGetMethod()
    new RestApiConfigBuilder().withAsyncPost('/api/behandlinger', 'FAGSAK_SOK', {maxPollingLimit: 100})
```
For en oversikt over parametere, se "defaultConfig" i RequestConfig-klassen.


Ofte er det ønskelig at applikasjonen skal reagere på diverse eventer i en rest-kall prosess. Eksempler på eventer er start, slutt, timeout og feil. 
Til dette brukes NotificationMapper-klassen. Se EventType for de ulike eventen som kan håndteres av denne.
Eksempel:
```javascript
import { NotificationMapper } from '@fpsak-frontend/rest-api';

const notificationMapper = new NotificationMapper();
notificationMapper.addRequestErrorEventHandler((data, type) => dispatch(reduxEvents.getErrorMessageActionCreator()({ ...data, type })));
...
//Utfør restkall med notificationMapper
requestApi.getRequestRunner('FAGSAK_SOK').startProcess(params, notificationMapper);
```