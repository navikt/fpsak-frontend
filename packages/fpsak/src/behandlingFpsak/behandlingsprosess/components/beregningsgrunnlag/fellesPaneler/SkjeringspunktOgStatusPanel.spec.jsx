import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { SkjeringspunktOgStatusPanelImpl } from './SkjeringspunktOgStatusPanel';

describe('<SkjeringspunktOgStatusPanel>', () => {
  it('Skal se at korrekte verdier settes i undertittlene', () => {
    const skjeringstidspunktDato = '2017-12-12';
    const aktivitetstatusList = [
      {
        kode: aktivitetStatus.ARBEIDSTAKER,
        navn: 'Arbeidstaker',
      },
      {
        kode: aktivitetStatus.FRILANSER,
        navn: 'Frilanser',
      },
    ];
    const wrapper = shallow(<SkjeringspunktOgStatusPanelImpl
      aktivitetStatusList={aktivitetstatusList}
      skjeringstidspunktDato={skjeringstidspunktDato}
    />);
    expect(wrapper.find('Normaltekst').children().at(1).text()).to.equal('Arbeidstaker og frilanser');
    expect(wrapper.find('Normaltekst').children().at(0).text()).is.eql('<DateLabel />');
  });
});