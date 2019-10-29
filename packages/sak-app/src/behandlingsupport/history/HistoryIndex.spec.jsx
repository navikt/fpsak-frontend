import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import HistorikkSakIndex from '@fpsak-frontend/sak-historikk';

import { HistoryIndex } from './HistoryIndex';

describe('<HistoryIndex>', () => {
  it('skal vise historikk', () => {
    const wrapper = shallow(<HistoryIndex
      alleHistorikkInnslag={[{
        opprettetTidspunkt: '2019-01-01',
        historikkinnslagDeler: [],
      }]}
      selectedBehandlingId={1}
      saksnummer={12345}
      location={{ pathname: 'test' }}
      alleKodeverkFpsak={{}}
    />);

    const history = wrapper.find(HistorikkSakIndex);
    expect(history).to.have.length(1);
  });
});
