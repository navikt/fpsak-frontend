import React from 'react';
import { expect } from 'chai';
import { EtikettInfo } from 'nav-frontend-etiketter';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import FodselSammenligningPanel from './FodselSammenligningPanel';
import FodselSammenligningOtherPanel from './FodselSammenligningOtherPanel';
import FodselSammenligningRevurderingPanel from './FodselSammenligningRevurderingPanel';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-prosess-fakta-fodsel-sammenligning';

describe('<FodselSammenligningPanel>', () => {
  const soknad = {
    fodselsdatoer: { 1: '2019-01-01' },
    termindato: '2019-01-01',
    antallBarn: 1,
    utstedtdato: '2019-01-01',
  };
  const originalBehandling = {
    soknad,
    familiehendelse: {
      termindato: '2019-01-01',
      fodselsdato: '2019-01-01',
      antallBarnTermin: 1,
      antallBarnFodsel: 1,
    },
  };

  it('skal rendre korrekt ved førstegangssøknad', () => {
    const wrapper = shallowWithIntl(<FodselSammenligningPanel
      intl={intlMock}
      behandlingsTypeKode={behandlingType.FORSTEGANGSSOKNAD}
      avklartBarn={[{ fodselsdato: '2017-05-15' }]}
      nrOfDodfodteBarn={0}
      soknad={soknad}
      vedtaksDatoSomSvangerskapsuke="2019-02-02"
      termindato="2019-01-01"
      originalBehandling={originalBehandling}
    />);

    expect(wrapper.find(FodselSammenligningOtherPanel)).to.have.length(1);
    expect(wrapper.find(FodselSammenligningRevurderingPanel)).to.have.length(0);
  });

  it('skal rendre korrekt ved revurdering', () => {
    const wrapper = shallowWithIntl(<FodselSammenligningPanel
      intl={intlMock}
      behandlingsTypeKode={behandlingType.REVURDERING}
      avklartBarn={[{ fodselsdato: '2017-05-15' }]}
      nrOfDodfodteBarn={0}
      soknad={soknad}
      vedtaksDatoSomSvangerskapsuke="2019-02-02"
      termindato="2019-01-01"
      originalBehandling={originalBehandling}
    />);

    expect(wrapper.find(FodselSammenligningOtherPanel)).to.have.length(0);
    expect(wrapper.find(FodselSammenligningRevurderingPanel)).to.have.length(1);
  });

  it('skal rendre fødsel fra tps', () => {
    const wrapper = shallowWithIntl(<FodselSammenligningPanel
      intl={intlMock}
      behandlingsTypeKode={behandlingType.FORSTEGANGSSOKNAD}
      avklartBarn={[{ fodselsdato: '2017-05-15' }]}
      nrOfDodfodteBarn={0}
      soknad={soknad}
      vedtaksDatoSomSvangerskapsuke="2019-02-02"
      termindato="2019-01-01"
      originalBehandling={originalBehandling}
    />);

    const tpsfodseldato = wrapper.find({ name: 'tpsFodseldato' });
    expect(tpsfodseldato.find('Normaltekst').at(2).children().text()).to.equal('15.05.2017');
  });

  it('skal rendre default verdier når tpsfodsel ikke finnes', () => {
    const wrapper = shallowWithIntl(<FodselSammenligningPanel
      intl={intlMock}
      behandlingsTypeKode={behandlingType.FORSTEGANGSSOKNAD}
      avklartBarn={[]}
      nrOfDodfodteBarn={0}
      soknad={soknad}
      vedtaksDatoSomSvangerskapsuke="2019-02-02"
      termindato="2019-01-01"
      originalBehandling={originalBehandling}
    />);

    const tpsfodseldato = wrapper.find({ name: 'tpsFodseldato' });
    expect(tpsfodseldato.find('Normaltekst')).to.have.length(3);
  });

  it('skal vise etikkett når minst ett av barna er dødfødte', () => {
    const wrapper = shallowWithIntl(<FodselSammenligningPanel
      intl={intlMock}
      behandlingsTypeKode={behandlingType.FORSTEGANGSSOKNAD}
      avklartBarn={[{ fodselsdato: '2017-05-15' }, { fodselsdato: '2017-05-15' }]}
      nrOfDodfodteBarn={1}
      soknad={soknad}
      vedtaksDatoSomSvangerskapsuke="2019-02-02"
      termindato="2019-01-01"
      originalBehandling={originalBehandling}
    />);

    expect(wrapper.find(EtikettInfo)).to.have.length(1);
  });

  it('skal ikke vise etikkett når ingen av barna er dødfødte', () => {
    const wrapper = shallowWithIntl(<FodselSammenligningPanel
      intl={intlMock}
      behandlingsTypeKode={behandlingType.FORSTEGANGSSOKNAD}
      avklartBarn={[{ fodselsdato: '2017-05-15' }, { fodselsdato: '2017-05-15' }]}
      nrOfDodfodteBarn={0}
      soknad={soknad}
      vedtaksDatoSomSvangerskapsuke="2019-02-02"
      termindato="2019-01-01"
      originalBehandling={originalBehandling}
    />);

    expect(wrapper.find(EtikettInfo)).to.have.length(0);
  });
});
