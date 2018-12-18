/* @flow */
import { expect } from 'chai';

import RestApiConfigBuilder from './RestApiConfigBuilder';

const httpClientApiMock = {
  get: 'get',
  post: 'post',
};

describe('RestApiConfigBuilder', () => {
  it('skal lage config med to rest endepunkter', () => {
    const endpoints = new RestApiConfigBuilder(httpClientApiMock)
      .withGet('www.pjokken.com', 'PJOKKEN')
      .withPost('www.espenutvikler.com', 'ESPENUTVIKLER')
      .build();

    expect(endpoints).has.length(2);
    expect(endpoints[0]).is.eql({
      name: 'PJOKKEN',
      path: 'www.pjokken.com',
      restMethod: 'get',
      config: {
        addLinkDataToArray: false,
        fetchLinkDataAutomatically: true,
        maxPollingLimit: undefined,
      },
    });
    expect(endpoints[1]).is.eql({
      name: 'ESPENUTVIKLER',
      path: 'www.espenutvikler.com',
      restMethod: 'post',
      config: {
        addLinkDataToArray: false,
        fetchLinkDataAutomatically: true,
        maxPollingLimit: undefined,
      },
    });
  });

  it('skal lage config med kun navn og config', () => {
    const config = {
      addLinkDataToArray: true,
      fetchLinkDataAutomatically: true,
      maxPollingLimit: 100,
    };
    const endpoints = new RestApiConfigBuilder(httpClientApiMock)
      .withKeyName('PJOKKEN', config)
      .build();

    expect(endpoints).has.length(1);
    expect(endpoints[0]).is.eql({
      name: 'PJOKKEN',
      config: {
        addLinkDataToArray: true,
        fetchLinkDataAutomatically: true,
        maxPollingLimit: 100,
      },
    });
  });
});
