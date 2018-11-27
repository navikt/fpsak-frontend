/* @flow */
import RequestApi from './RequestApi';
import RestApiRequestContext from './RestApiRequestContext';
import type { RequestConfig } from '../RequestConfigFlowType';

// TODO (TOR) Refaktorer denne. Mykje unødvendig duplisering av kode
/**
 * RestApiContextModifier
 *
 * Denne klassen tilbyr funksjonalitet for endring av endepunkt-konfigurasjon.
 *
 * Kan endre hostname og context-path for alle endepunkta, eller eventuelt kun for en oppgitt
 * liste med endepunkt.
 * Kan også endre konfigurasjon til de enkelte endepunktene. Dette kan være ønskelig for eksempel
 * i tilfellene der en ikkje har URL'en til endepunktet ved oppsett av api.
 */
class RestApiContextModifier {
  requestApi: RequestApi;

  newRequestContexts: RestApiRequestContext[] = [];

  constructor(requestApi: RequestApi) {
    this.requestApi = requestApi;
  }

  changeContextPath = (contextPath: string, ...apiKeys?: string[]) => {
    const currentContexts = this.requestApi.getCurrentContexts();
    let keys = apiKeys;
    if (keys.length === 0) {
      keys = currentContexts.map(c => c.getEndpointName());
    }

    this.newRequestContexts = this.newRequestContexts.concat(keys.map((key) => {
      const index = this.newRequestContexts.findIndex(c => c.getEndpointName() === key);
      let context;
      if (index > -1) {
        context = this.newRequestContexts[index];
        this.newRequestContexts.splice(index, 1);
      }
      if (!context) {
        context = currentContexts.find(c => c.getEndpointName() === key);
        if (!context) {
          throw new Error(`Api key not found: ${key}`);
        }
      }
      return new RestApiRequestContext(contextPath, context.getConfig())
        .withHostname(context.getHostname());
    }));
    return this;
  }

  changeHostname = (hostname: string, ...apiKeys?: string[]) => {
    const currentContexts = this.requestApi.getCurrentContexts();
    let keys = apiKeys;
    if (keys.length === 0) {
      keys = currentContexts.map(c => c.getEndpointName());
    }

    this.newRequestContexts = this.newRequestContexts.concat(keys.map((key) => {
      const index = this.newRequestContexts.findIndex(c => c.getEndpointName() === key);
      let context;
      if (index > -1) {
        context = this.newRequestContexts[index];
        this.newRequestContexts.splice(index, 1);
      }
      if (!context) {
        context = currentContexts.find(c => c.getEndpointName() === key);
        if (!context) {
          throw new Error(`Api key not found: ${key}`);
        }
      }
      return new RestApiRequestContext(context.getContextPath(), context.getConfig())
        .withHostname(hostname);
    }));
    return this;
  }

  changeConfig = (configs: RequestConfig[]) => {
    const currentContexts = this.requestApi.getCurrentContexts();

    this.newRequestContexts = this.newRequestContexts.concat(configs.map((config) => {
      const index = this.newRequestContexts.findIndex(c => c.getEndpointName() === config.name);
      let context;
      if (index > -1) {
        context = this.newRequestContexts[index];
        this.newRequestContexts.splice(index, 1);
      }
      if (!context) {
        context = currentContexts.find(c => c.getEndpointName() === config.name);
        if (!context) {
          throw new Error(`Api key not found: ${config.name}`);
        }
      }
      return new RestApiRequestContext(context.getContextPath(), config)
        .withHostname(context.getHostname());
    }));
    return this;
  }

  update = () => {
    this.requestApi.replaceEndpointContexts(this.newRequestContexts);
  }
}

export default RestApiContextModifier;
