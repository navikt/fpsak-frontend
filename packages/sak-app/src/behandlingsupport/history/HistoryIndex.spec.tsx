import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import HistorikkSakIndex from '@fpsak-frontend/sak-historikk';

import { requestApi, FpsakApiKeys } from '../../data/fpsakApi';
import { HistoryIndex } from './HistoryIndex';

describe('<HistoryIndex>', () => {
  const locationMock = {
    pathname: 'test',
    search: 'test',
    state: {},
    hash: 'test',
  };

  it('skal vise historikk for kun fpsak', () => {
    requestApi.mock(FpsakApiKeys.KODEVERK, {});
    requestApi.mock(FpsakApiKeys.KODEVERK_FPTILBAKE, {});
    requestApi.mock(FpsakApiKeys.FEATURE_TOGGLE, {});
    requestApi.mock(FpsakApiKeys.HISTORY_FPSAK, [{
      opprettetTidspunkt: '2019-01-01',
      historikkinnslagDeler: [],
      type: {
        kode: 'Test',
      },
    }]);
    requestApi.mock(FpsakApiKeys.HISTORY_FPTILBAKE, []);

    const wrapper = shallow(<HistoryIndex
      saksnummer={12345}
      behandlingId={1}
      behandlingVersjon={2}
      location={locationMock}
    />);

    const index = wrapper.find(HistorikkSakIndex);
    expect(index).to.have.length(1);
  });

  it('skal slå sammen og sortere historikk for fpsak og fptilbake', () => {
    requestApi.mock(FpsakApiKeys.KODEVERK, {});
    requestApi.mock(FpsakApiKeys.KODEVERK_FPTILBAKE, {});
    requestApi.mock(FpsakApiKeys.FEATURE_TOGGLE, {});
    requestApi.mock(FpsakApiKeys.HISTORY_FPSAK, [{
      opprettetTidspunkt: '2019-01-01',
      historikkinnslagDeler: [],
      type: {
        kode: 'Test fpsak 1',
      },
    }, {
      opprettetTidspunkt: '2019-01-06',
      historikkinnslagDeler: [],
      type: {
        kode: 'Test fpsak 2',
      },
    }]);
    requestApi.mock(FpsakApiKeys.HISTORY_FPTILBAKE, [{
      opprettetTidspunkt: '2019-01-04',
      historikkinnslagDeler: [],
      type: {
        kode: 'Test fptilbake',
      },
    }]);

    const wrapper = shallow(<HistoryIndex
      saksnummer={12345}
      behandlingId={1}
      behandlingVersjon={2}
      location={locationMock}
    />);

    const index = wrapper.find(HistorikkSakIndex);
    expect(index).to.have.length(3);
    expect(index.at(0).prop('historieInnslag').opprettetTidspunkt).to.eql('2019-01-06');
    expect(index.at(1).prop('historieInnslag').opprettetTidspunkt).to.eql('2019-01-04');
    expect(index.at(2).prop('historieInnslag').opprettetTidspunkt).to.eql('2019-01-01');
  });
});
