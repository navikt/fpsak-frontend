import { expect } from 'chai';
import MockAdapter from 'axios-mock-adapter';

import getAxiosHttpClientApi from './getAxiosHttpClientApi';

describe('axiosHttpClientApi', () => {
  const httpClientApi = getAxiosHttpClientApi();
  let mockAxios;

  before(() => {
    mockAxios = new MockAdapter(httpClientApi.axiosInstance);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  after(() => {
    mockAxios.restore();
  });

  it('skal hente resultat ved get-kall', async () => {
    const url = 'www.test.no';
    mockAxios
      .onGet(url)
      .reply(200, {
        resource: true,
      });

    const data = {
      id: 1,
    };
    const result = await httpClientApi.get(url, data);

    expect(result.data).to.eql({ resource: true });
  });

  it('skal kaste feil når url ikke finnes', async () => {
    const url = 'www.test.no';
    mockAxios
      .onGet(url)
      .reply(404);

    const data = {
      id: 1,
    };

    try {
      await httpClientApi.get(url, data);
    } catch (error) {
      expect(error.name).is.eql('Error');
      expect(error.message).is.eql('Request failed with status code 404');
      expect(error.response.status).to.eql(404);
    }
  });

  it('skal hente resultat ved post-kall', async () => {
    const url = 'www.test.no';
    mockAxios
      .onPost(url)
      .reply(200, {
        resource: true,
      });

    const data = {
      id: 1,
    };
    const result = await httpClientApi.post(url, data);

    expect(result.data).to.eql({ resource: true });
  });

  it('skal hente resultat ved put-kall', async () => {
    const url = 'www.test.no';
    mockAxios
      .onPut(url)
      .reply(200, {
        resource: true,
      });

    const data = {
      id: 1,
    };
    const result = await httpClientApi.put(url, data);

    expect(result.data).to.eql({ resource: true });
  });

  it('skal hente resultat ved getBlob-kall', async () => {
    const url = 'www.test.no';
    mockAxios
      .onGet(url)
      .reply(200, {
        resource: true,
      });

    const data = {
      id: 1,
    };
    const result = await httpClientApi.getBlob(url, data);

    expect(result.data).to.eql({ resource: true });
  });

  it('skal hente resultat ved postBlob-kall', async () => {
    const url = 'www.test.no';
    mockAxios
      .onPost(url)
      .reply(200, {
        resource: true,
      });

    const data = {
      id: 1,
    };
    const result = await httpClientApi.postBlob(url, data);

    expect(result.data).to.eql({ resource: true });
  });

  it('skal hente resultat ved getAsync-kall', async () => {
    const url = 'www.test.no';
    mockAxios
      .onGet(url)
      .reply(200, {
        resource: true,
      });

    const data = {
      id: 1,
    };
    const result = await httpClientApi.getAsync(url, data);

    expect(result.data).to.eql({ resource: true });
  });

  it('skal hente resultat ved postAsync-kall', async () => {
    const url = 'www.test.no';
    mockAxios
      .onPost(url)
      .reply(200, {
        resource: true,
      });

    const data = {
      id: 1,
    };
    const result = await httpClientApi.postAsync(url, data);

    expect(result.data).to.eql({ resource: true });
  });

  it('skal hente resultat ved putAsync-kall', async () => {
    const url = 'www.test.no';
    mockAxios
      .onPut(url)
      .reply(200, {
        resource: true,
      });

    const data = {
      id: 1,
    };
    const result = await httpClientApi.putAsync(url, data);

    expect(result.data).to.eql({ resource: true });
  });
});
