import { expect } from 'chai';

import RestApiConfigBuilder from './RestApiConfigBuilder';

describe('RestApiConfigBuilder', () => {
  it('skal lage config med to rest endepunkter', () => {
    const endpoints = new RestApiConfigBuilder()
      .withGet('www.pjokken.com', 'PJOKKEN')
      .withPost('www.espenutvikler.com', 'ESPENUTVIKLER')
      .build();

    expect(endpoints).has.length(2);
    expect(endpoints[0].name).is.eql('PJOKKEN');
    expect(endpoints[0].path).is.eql('www.pjokken.com');
    expect(endpoints[0].restMethod).is.eql('GET');
    expect(endpoints[0].config).is.eql({
      maxPollingLimit: undefined,
      storeResultKey: undefined,
    });

    expect(endpoints[1].name).is.eql('ESPENUTVIKLER');
    expect(endpoints[1].path).is.eql('www.espenutvikler.com');
    expect(endpoints[1].restMethod).is.eql('POST');
    expect(endpoints[1].config).is.eql({
      maxPollingLimit: undefined,
      storeResultKey: undefined,
    });
  });
});
