import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import HistorikkSakIndex from '@fpsak-frontend/sak-historikk';
import { DataFetcher } from '@fpsak-frontend/fp-felles';

import { HistoryIndex } from './HistoryIndex';

describe('<HistoryIndex>', () => {
  it('skal vise historikk', () => {
    const wrapper = shallow(<HistoryIndex
      enabledContexts={[]}
      saksnummer={12345}
      location={{ pathname: 'test' }}
      alleKodeverkFpsak={{}}
    />);

    const dataFetcher = wrapper.find(DataFetcher);
    const history = dataFetcher.renderProp('render')({
      historyFpsak: [{
        opprettetTidspunkt: '2019-01-01',
        historikkinnslagDeler: [],
        type: {
          kode: 'Test',
        },
      }],
    }).find(HistorikkSakIndex);
    expect(history).to.have.length(1);
  });
});
