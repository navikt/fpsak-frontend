import { expect } from 'chai';

import { getPathToFplos } from './paths';

describe('paths', () => {
  it('skal hente url til Fplos gitt Fpsak url', () => {
    const fpsakUrl = 'https://fpsak-t10.nais.preprod.local/fpsak/fagsak/1/';
    const fplosUrl = 'https://fplos-t10.nais.preprod.local/fplos';
    expect(getPathToFplos(fpsakUrl)).is.eql(fplosUrl);
  });
});
