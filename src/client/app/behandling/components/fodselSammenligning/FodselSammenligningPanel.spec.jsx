import React from 'react';
import { expect } from 'chai';
import { EtikettInfo } from 'nav-frontend-etiketter';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import behandlingType from 'kodeverk/behandlingType';
import { FodselSammenligningPanel } from './FodselSammenligningPanel';
import FodselSammenligningOtherPanel from './FodselSammenligningOtherPanel';
import FodselSammenligningRevurderingPanel from './FodselSammenligningRevurderingPanel';

describe('<FodselSammenligningPanel>', () => {
  it('skal rendre korrekt ved førstegangssøknad', () => {
    const wrapper = shallowWithIntl(<FodselSammenligningPanel
      intl={intlMock}
      behandlingsTypeKode={behandlingType.FORSTEGANGSSOKNAD}
      antallBarn={1}
      fodselDato="2017-05-15"
      nrOfDodfodteBarn={0}
    />);

    expect(wrapper.find(FodselSammenligningOtherPanel)).to.have.length(1);
    expect(wrapper.find(FodselSammenligningRevurderingPanel)).to.have.length(0);
  });

  it('skal rendre korrekt ved revurdering', () => {
    const wrapper = shallowWithIntl(<FodselSammenligningPanel
      intl={intlMock}
      behandlingsTypeKode={behandlingType.REVURDERING}
      antallBarn={1}
      fodselDato="2017-05-15"
      nrOfDodfodteBarn={0}
    />);

    expect(wrapper.find(FodselSammenligningOtherPanel)).to.have.length(0);
    expect(wrapper.find(FodselSammenligningRevurderingPanel)).to.have.length(1);
  });

  it('skal rendre fødsel fra tps', () => {
    const wrapper = shallowWithIntl(<FodselSammenligningPanel
      intl={intlMock}
      behandlingsTypeKode={behandlingType.FORSTEGANGSSOKNAD}
      antallBarn={1}
      fodselDato="2017-05-15"
      nrOfDodfodteBarn={0}
    />);

    const tpsfodseldato = wrapper.find({ name: 'tpsFodseldato' });
    expect(tpsfodseldato.find('Normaltekst').first().children().text()).to.equal('2017-05-15');

    const tpsantallbarn = wrapper.find({ name: 'tpsAntallBarn' });
    expect(tpsantallbarn.find('Normaltekst').first().children().text()).to.equal('1');
  });

  it('skal rendre default verdier når tpsfodsel ikke finnes', () => {
    const wrapper = shallowWithIntl(<FodselSammenligningPanel
      intl={intlMock}
      behandlingsTypeKode={behandlingType.FORSTEGANGSSOKNAD}
      antallBarn={0}
      fodselDato="-"
      nrOfDodfodteBarn={0}
    />);

    const tpsfodseldato = wrapper.find({ name: 'tpsFodseldato' });
    expect(tpsfodseldato.find('Normaltekst')).to.have.length(1);
  });

  it('skal vise etikkett når minst ett av barna er dødfødte', () => {
    const wrapper = shallowWithIntl(<FodselSammenligningPanel
      intl={intlMock}
      behandlingsTypeKode={behandlingType.FORSTEGANGSSOKNAD}
      antallBarn={2}
      fodselDato="2017-05-15"
      nrOfDodfodteBarn={1}
    />);

    expect(wrapper.find(EtikettInfo)).to.have.length(1);
  });

  it('skal ikke vise etikkett når ingen av barna er dødfødte', () => {
    const wrapper = shallowWithIntl(<FodselSammenligningPanel
      intl={intlMock}
      behandlingsTypeKode={behandlingType.FORSTEGANGSSOKNAD}
      antallBarn={2}
      fodselDato="2017-05-15"
      nrOfDodfodteBarn={0}
    />);

    expect(wrapper.find(EtikettInfo)).to.have.length(0);
  });
});
