/* @flow */
import { expect } from 'chai';

import RequestApi from './RequestApi';
import RestApiContextModifier from './RestApiContextModifier';

describe('RestApiContextModifier', () => {
  const httpClientMock = {
    get: () => 'data',
    post: () => 'data',
  };

  it('skal endre contextPath for alle endepunkt', () => {
    const endpointConfigs = [{
      path: 'fagsak',
      name: 'FAGSAK',
      restMethod: httpClientMock.post,
      config: {},
    }, {
      path: 'behandling',
      name: 'BEHANDLING',
      restMethod: httpClientMock.get,
      config: {},
    }];

    const api = new RequestApi(httpClientMock, 'fpsak', endpointConfigs);
    const modifier = new RestApiContextModifier(api);
    modifier.changeContextPath('fplos');

    expect(modifier.newRequestContexts).has.length(2);
    expect(modifier.newRequestContexts[0].getEndpointName()).to.eql('FAGSAK');
    expect(modifier.newRequestContexts[0].getContextPath()).to.eql('fplos');
    expect(modifier.newRequestContexts[0].getConfig()).to.eql(endpointConfigs[0]);
    expect(modifier.newRequestContexts[0].getHostname()).to.eql('');
    expect(modifier.newRequestContexts[1].getEndpointName()).to.eql('BEHANDLING');
    expect(modifier.newRequestContexts[1].getContextPath()).to.eql('fplos');
    expect(modifier.newRequestContexts[1].getConfig()).to.eql(endpointConfigs[1]);
    expect(modifier.newRequestContexts[1].getHostname()).to.eql('');
  });

  it('skal endre contextPath for kun ett av endepunkta', () => {
    const endpointConfigs = [{
      path: 'fagsak',
      name: 'FAGSAK',
      restMethod: httpClientMock.post,
      config: {},
    }, {
      path: 'behandling',
      name: 'BEHANDLING',
      restMethod: httpClientMock.get,
      config: {},
    }];

    const api = new RequestApi(httpClientMock, 'fpsak', endpointConfigs);
    const modifier = new RestApiContextModifier(api);
    modifier.changeContextPath('fplos', 'BEHANDLING');

    expect(modifier.newRequestContexts).has.length(1);
    expect(modifier.newRequestContexts[0].getEndpointName()).to.eql('BEHANDLING');
    expect(modifier.newRequestContexts[0].getContextPath()).to.eql('fplos');
  });

  it('skal først endre contextPath en og en', () => {
    const endpointConfigs = [{
      path: 'fagsak',
      name: 'FAGSAK',
      restMethod: httpClientMock.post,
      config: {},
    }, {
      path: 'behandling',
      name: 'BEHANDLING',
      restMethod: httpClientMock.get,
      config: {},
    }];

    const api = new RequestApi(httpClientMock, 'fpsak', endpointConfigs);
    const modifier = new RestApiContextModifier(api);
    modifier.changeContextPath('fplos', 'BEHANDLING');
    modifier.changeContextPath('fptilbake', 'FAGSAK');

    expect(modifier.newRequestContexts).has.length(2);
    expect(modifier.newRequestContexts[0].getEndpointName()).to.eql('BEHANDLING');
    expect(modifier.newRequestContexts[0].getContextPath()).to.eql('fplos');
    expect(modifier.newRequestContexts[1].getEndpointName()).to.eql('FAGSAK');
    expect(modifier.newRequestContexts[1].getContextPath()).to.eql('fptilbake');
  });

  it('skal ikke kunne endre contextPath for nøkkel som ikke finnes', () => {
    const endpointConfigs = [{
      path: 'fagsak',
      name: 'FAGSAK',
      restMethod: httpClientMock.post,
      config: {},
    }];

    const api = new RequestApi(httpClientMock, 'fpsak', endpointConfigs);
    const modifier = new RestApiContextModifier(api);

    try {
      modifier.changeContextPath('fplos', 'BEHANDLING');
    } catch (error) {
      expect(error.message).is.eql('Api key not found: BEHANDLING');
    }
  });

  it('skal endre hostname for alle endepunkt', () => {
    const endpointConfigs = [{
      path: 'fagsak',
      name: 'FAGSAK',
      restMethod: httpClientMock.post,
      config: {},
    }, {
      path: 'behandling',
      name: 'BEHANDLING',
      restMethod: httpClientMock.get,
      config: {},
    }];

    const api = new RequestApi(httpClientMock, 'fpsak', endpointConfigs);
    const modifier = new RestApiContextModifier(api);
    modifier.changeHostname('http://test.com');

    expect(modifier.newRequestContexts).has.length(2);
    expect(modifier.newRequestContexts[0].getEndpointName()).to.eql('FAGSAK');
    expect(modifier.newRequestContexts[0].getContextPath()).to.eql('fpsak');
    expect(modifier.newRequestContexts[0].getConfig()).to.eql(endpointConfigs[0]);
    expect(modifier.newRequestContexts[0].getHostname()).to.eql('http://test.com');
    expect(modifier.newRequestContexts[1].getEndpointName()).to.eql('BEHANDLING');
    expect(modifier.newRequestContexts[1].getContextPath()).to.eql('fpsak');
    expect(modifier.newRequestContexts[1].getConfig()).to.eql(endpointConfigs[1]);
    expect(modifier.newRequestContexts[1].getHostname()).to.eql('http://test.com');
  });


  it('skal endre contextPath for kun ett av endepunkta', () => {
    const endpointConfigs = [{
      path: 'fagsak',
      name: 'FAGSAK',
      restMethod: httpClientMock.post,
      config: {},
    }, {
      path: 'behandling',
      name: 'BEHANDLING',
      restMethod: httpClientMock.get,
      config: {},
    }];

    const api = new RequestApi(httpClientMock, 'fpsak', endpointConfigs);
    const modifier = new RestApiContextModifier(api);
    modifier.changeHostname('http://test.com', 'BEHANDLING');

    expect(modifier.newRequestContexts).has.length(1);
    expect(modifier.newRequestContexts[0].getEndpointName()).to.eql('BEHANDLING');
    expect(modifier.newRequestContexts[0].getHostname()).to.eql('http://test.com');
  });

  it('skal først endre contextPath en og en', () => {
    const endpointConfigs = [{
      path: 'fagsak',
      name: 'FAGSAK',
      restMethod: httpClientMock.post,
      config: {},
    }, {
      path: 'behandling',
      name: 'BEHANDLING',
      restMethod: httpClientMock.get,
      config: {},
    }];

    const api = new RequestApi(httpClientMock, 'fpsak', endpointConfigs);
    const modifier = new RestApiContextModifier(api);
    modifier.changeHostname('http://test11.com', 'BEHANDLING');
    modifier.changeHostname('http://test22.com', 'FAGSAK');

    expect(modifier.newRequestContexts).has.length(2);
    expect(modifier.newRequestContexts[0].getEndpointName()).to.eql('BEHANDLING');
    expect(modifier.newRequestContexts[0].getHostname()).to.eql('http://test11.com');
    expect(modifier.newRequestContexts[1].getEndpointName()).to.eql('FAGSAK');
    expect(modifier.newRequestContexts[1].getHostname()).to.eql('http://test22.com');
  });

  it('skal ikke kunne endre hostname for nøkkel som ikke finnes', () => {
    const endpointConfigs = [{
      path: 'fagsak',
      name: 'FAGSAK',
      restMethod: httpClientMock.post,
      config: {},
    }];

    const api = new RequestApi(httpClientMock, 'fpsak', endpointConfigs);
    const modifier = new RestApiContextModifier(api);

    try {
      modifier.changeHostname('http://test11.com', 'BEHANDLING');
    } catch (error) {
      expect(error.message).is.eql('Api key not found: BEHANDLING');
    }
  });

  it('skal endre config for to av endepunkta', () => {
    const endpointConfigs = [{
      path: 'fagsak',
      name: 'FAGSAK',
      restMethod: httpClientMock.post,
      config: {},
    }, {
      path: 'behandling',
      name: 'BEHANDLING',
      restMethod: httpClientMock.get,
      config: {},
    }, {
      path: 'kodeverk',
      name: 'KODEVERK',
      restMethod: httpClientMock.get,
      config: {},
    }];

    const newConfigs = [{
      ...endpointConfigs[0],
      path: 'fagsak/nytt',
    }, {
      ...endpointConfigs[1],
      path: 'behandling/nytt',
    }];

    const api = new RequestApi(httpClientMock, 'fpsak', endpointConfigs);
    const modifier = new RestApiContextModifier(api);
    modifier.changeConfig(newConfigs);

    expect(modifier.newRequestContexts).has.length(2);
    expect(modifier.newRequestContexts[0].getEndpointName()).to.eql('FAGSAK');
    expect(modifier.newRequestContexts[0].getContextPath()).to.eql('fpsak');
    expect(modifier.newRequestContexts[0].getConfig()).to.eql(newConfigs[0]);
    expect(modifier.newRequestContexts[0].getHostname()).to.eql('');
    expect(modifier.newRequestContexts[1].getEndpointName()).to.eql('BEHANDLING');
    expect(modifier.newRequestContexts[1].getContextPath()).to.eql('fpsak');
    expect(modifier.newRequestContexts[1].getConfig()).to.eql(newConfigs[1]);
    expect(modifier.newRequestContexts[1].getHostname()).to.eql('');
  });

  it('skal endre config for kun ett av endepunkta', () => {
    const endpointConfigs = [{
      path: 'fagsak',
      name: 'FAGSAK',
      restMethod: httpClientMock.post,
      config: {},
    }, {
      path: 'behandling',
      name: 'BEHANDLING',
      restMethod: httpClientMock.get,
      config: {},
    }];

    const newConfig = {
      ...endpointConfigs[0],
      path: 'fagsak/nytt',
    };

    const api = new RequestApi(httpClientMock, 'fpsak', endpointConfigs);
    const modifier = new RestApiContextModifier(api);
    modifier.changeConfig([newConfig]);

    expect(modifier.newRequestContexts).has.length(1);
    expect(modifier.newRequestContexts[0].getEndpointName()).to.eql('FAGSAK');
    expect(modifier.newRequestContexts[0].getConfig()).to.eql(newConfig);
  });

  it('skal endre configs en og en', () => {
    const endpointConfigs = [{
      path: 'fagsak',
      name: 'FAGSAK',
      restMethod: httpClientMock.post,
      config: {},
    }, {
      path: 'behandling',
      name: 'BEHANDLING',
      restMethod: httpClientMock.get,
      config: {},
    }];

    const newConfig1 = {
      ...endpointConfigs[0],
      path: 'fagsak/nytt',
    };
    const newConfig2 = {
      ...endpointConfigs[1],
      path: 'behandling/nytt',
    };

    const api = new RequestApi(httpClientMock, 'fpsak', endpointConfigs);
    const modifier = new RestApiContextModifier(api);
    modifier.changeConfig([newConfig1]);
    modifier.changeConfig([newConfig2]);

    expect(modifier.newRequestContexts).has.length(2);
    expect(modifier.newRequestContexts[0].getEndpointName()).to.eql('FAGSAK');
    expect(modifier.newRequestContexts[0].getConfig()).to.eql(newConfig1);
    expect(modifier.newRequestContexts[1].getEndpointName()).to.eql('BEHANDLING');
    expect(modifier.newRequestContexts[1].getConfig()).to.eql(newConfig2);
  });

  it('skal ikke kunne endre config for nøkkel som ikke finnes', () => {
    const endpointConfigs = [{
      path: 'fagsak',
      name: 'FAGSAK',
      restMethod: httpClientMock.post,
      config: {},
    }];

    const api = new RequestApi(httpClientMock, 'fpsak', endpointConfigs);
    const modifier = new RestApiContextModifier(api);

    const newConfig = {
      ...endpointConfigs[0],
      path: 'fagsak/nytt',
    };

    try {
      modifier.changeConfig([newConfig]);
    } catch (error) {
      expect(error.message).is.eql('Api key not found');
    }
  });

  it('skal endre både config, contextPath og hostname for ett av endepunkta', () => {
    const endpointConfigs = [{
      path: 'fagsak',
      name: 'FAGSAK',
      restMethod: httpClientMock.post,
      config: {},
    }, {
      path: 'behandling',
      name: 'BEHANDLING',
      restMethod: httpClientMock.get,
      config: {},
    }];

    const newConfig = {
      ...endpointConfigs[1],
      path: 'behandling/nytt',
    };

    const api = new RequestApi(httpClientMock, 'fpsak', endpointConfigs);
    const modifier = new RestApiContextModifier(api);
    modifier.changeContextPath('fplos', 'BEHANDLING');
    modifier.changeConfig([newConfig]);
    modifier.changeHostname('http://test22.com', 'BEHANDLING');

    expect(modifier.newRequestContexts).has.length(1);
    expect(modifier.newRequestContexts[0].getEndpointName()).to.eql('BEHANDLING');
    expect(modifier.newRequestContexts[0].getContextPath()).to.eql('fplos');
    expect(modifier.newRequestContexts[0].getConfig()).to.eql(newConfig);
    expect(modifier.newRequestContexts[0].getHostname()).to.eql('http://test22.com');
  });
});
