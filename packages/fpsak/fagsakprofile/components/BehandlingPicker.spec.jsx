import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';

import BehandlingPickerItem from './BehandlingPickerItem';
import BehandlingPicker from './BehandlingPicker';

describe('<BehandlingPicker>', () => {
  const behandlingTemplate = {
    versjon: 123,
    type: {
      kode: '',
      navn: '',
    },
    status: {
      kode: 'FVED',
      navn: 'Fatter vedtak',
    },
    aksjonspunkter: [],
    behandlingsresultat: {
      id: 1,
      type: {
        navn: 'test',
        kode: '1',
      },
    },
    fagsakId: 1,
    opprettet: '15.10.2017',
    vilkar: [],
  };

  it('skal vise forklarende tekst når det ikke finnes behandlinger', () => {
    const wrapper = shallow(<BehandlingPicker
      noExistingBehandlinger
      behandlinger={[]}
      saksnummer={1}
      showAll={false}
      toggleShowAll={sinon.spy()}
    />);

    const message = wrapper.find(FormattedMessage);
    expect(message).has.length(1);
    expect(message.prop('id')).is.eql('BehandlingList.ZeroBehandlinger');
  });

  it('skal vise alle behandlinger sortert med først opprettet først i listen', () => {
    const behandlinger = [{
      ...behandlingTemplate,
      id: 1,
      opprettet: '2017-05-01',
    }, {
      ...behandlingTemplate,
      id: 2,
      opprettet: '2018-01-01',
    }, {
      ...behandlingTemplate,
      id: 3,
      opprettet: '2017-01-01',
    }];
    const wrapper = shallow(<BehandlingPicker
      noExistingBehandlinger={false}
      behandlinger={behandlinger}
      saksnummer={1}
      showAll={false}
      toggleShowAll={sinon.spy()}
    />);

    const item = wrapper.find(BehandlingPickerItem);
    expect(item).has.length(3);
    expect(item.first().prop('behandling').id).is.eql(3);
    expect(item.at(1).prop('behandling').id).is.eql(1);
    expect(item.last().prop('behandling').id).is.eql(2);
  });

  it('skal vise alle behandlinger sortert med valgt behandling først i listen', () => {
    const behandlinger = [{
      ...behandlingTemplate,
      id: 1,
      opprettet: '2017-05-01',
    }, {
      ...behandlingTemplate,
      id: 2,
      opprettet: '2018-01-01',
    }, {
      ...behandlingTemplate,
      id: 3,
      opprettet: '2017-01-01',
    }];
    const wrapper = shallow(<BehandlingPicker
      noExistingBehandlinger={false}
      behandlinger={behandlinger}
      behandlingId={2}
      saksnummer={1}
      showAll={false}
      toggleShowAll={sinon.spy()}
    />);

    const item = wrapper.find(BehandlingPickerItem);
    expect(item).has.length(3);
    expect(item.first().prop('behandling').id).is.eql(2);
    expect(item.at(1).prop('behandling').id).is.eql(3);
    expect(item.last().prop('behandling').id).is.eql(1);
  });
});
