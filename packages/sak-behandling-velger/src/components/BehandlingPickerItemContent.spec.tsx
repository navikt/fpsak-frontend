import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Panel from 'nav-frontend-paneler';

import { DateLabel } from '@fpsak-frontend/shared-components';

import BehandlingPickerItemContent from './BehandlingPickerItemContent';

describe('<BehandlingPickerItemContent>', () => {
  it('skal rendre komponent', () => {
    const wrapper = shallow(<BehandlingPickerItemContent
      withChevronDown
      withChevronUp
      behandlingTypeKode="BT-002"
      behandlingTypeNavn="Foreldrepenger"
      opprettetDato="2018-01-01"
      behandlingsstatus="Opprettet"
      erGjeldendeVedtak={false}
    />);

    expect(wrapper.find(Panel)).has.length(1);
    expect(wrapper.find(DateLabel)).has.length(1);
  });

  it('skal vise avsluttet dato når denne finnes', () => {
    const wrapper = shallow(<BehandlingPickerItemContent
      withChevronDown
      withChevronUp
      behandlingTypeKode="BT-002"
      behandlingTypeNavn="Foreldrepenger"
      opprettetDato="2018-01-01"
      avsluttetDato="2018-05-01"
      behandlingsstatus="Opprettet"
      erGjeldendeVedtak={false}
    />);

    const labels = wrapper.find(DateLabel);
    expect(labels).has.length(2);
    expect(labels.first().prop('dateString')).to.eql('2018-01-01');
    expect(labels.last().prop('dateString')).to.eql('2018-05-01');
  });

  it('skal vise årsak for revurdering', () => {
    const førsteÅrsak = {
      behandlingArsakType: {
        kode: '-',
        kodeverk: '',
      },
      erAutomatiskRevurdering: false,
      manueltOpprettet: false,
    };
    const wrapper = shallow(<BehandlingPickerItemContent
      withChevronDown
      withChevronUp
      behandlingTypeKode="BT-004"
      behandlingTypeNavn="Foreldrepenger"
      opprettetDato="2018-01-01"
      avsluttetDato="2018-05-01"
      behandlingsstatus="Opprettet"
      førsteÅrsak={førsteÅrsak}
      erGjeldendeVedtak={false}
    />);

    const formattedMessages = wrapper.find('FormattedMessage');
    expect(formattedMessages.first().prop('id')).to.eql('Behandlingspunkt.Årsak.Annet');
  });
});
