import { expect } from 'chai';

import { RequestConfig } from '@fpsak-frontend/rest-api';
import ReduxEvents from './redux/ReduxEvents';
import ReduxRestApi from './ReduxRestApi';

describe('ReduxRestApi', () => {
  it('skal bruke samme konfig som en annen request', () => {
    const configs = [
      new RequestConfig('BEHANDLING', '/api/behandling'),
      new RequestConfig('LAGRE_AP', undefined, { saveResponseIn: 'BEHANDLING' }),
    ];

    const requestConfig = new ReduxRestApi(configs, 'reducerName', 'fpsak', new ReduxEvents());

    expect(requestConfig.configs[0].config).to.eql(configs[0].config);
    expect(requestConfig.configs[1].config).to.eql({
      ...configs[1].config,
    });
  });

  it('skal bruke samme konfig som en annen request', () => {
    const configs = [
      new RequestConfig('BEHANDLING', '/api/behandling'),
      new RequestConfig('FAGSAK', '/api/fagsak'),
    ];

    const requestConfig = new ReduxRestApi(configs, 'reducerName', 'fpsak', new ReduxEvents());

    expect(Object.keys(requestConfig.getEndpointApi())).is.of.length(2);
    expect(requestConfig.getEndpointApi().BEHANDLING.name).to.eql('BEHANDLING');
    expect(requestConfig.getEndpointApi().FAGSAK.name).to.eql('FAGSAK');
  });
});
