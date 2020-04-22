import React from 'react';
import { expect } from 'chai';

import { Behandlingsresultat, BeregningsresultatFp, BeregningsresultatEs } from '@fpsak-frontend/types';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import VedtakInnvilgetPanel from './VedtakInnvilgetPanel';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-prosess-vedtak';

const engangsstonad = fagsakYtelseType.ENGANGSSTONAD;
const foreldrepenger = fagsakYtelseType.FORELDREPENGER;
const behandlingsresultat: Partial<Behandlingsresultat> = {
  type: {
    kode: 'INNVILGET',
    kodeverk: '',
  },
};

describe('<VedtakInnvilgetPanel>', () => {
  it('skal rendre innvilget panel for engangsstønad', () => {
    const wrapper = shallowWithIntl(<VedtakInnvilgetPanel.WrappedComponent
      intl={intlMock}
      behandlingsresultat={behandlingsresultat as Behandlingsresultat}
      ytelseTypeKode={engangsstonad}
      readOnly
      skalBrukeOverstyrendeFritekstBrev
      beregningErManueltFastsatt={false}
      resultatstruktur={{
        beregnetTilkjentYtelse: 100,
        antallBarn: 1,
      } as BeregningsresultatEs}
    />);

    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(3);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Resultat');
    expect(undertekstFields.at(1).childAt(0).text()).to.eql('Beregnet engangsstønad');
    expect(undertekstFields.last().childAt(0).text()).to.eql('Antall barn');

    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(1);
    expect(normaltekstFields.first().childAt(0).text()).to.eql('Engangsstønad er innvilget');

    const elementFields = wrapper.find('Element');
    expect(elementFields).to.have.length(2);
    expect(elementFields.first().childAt(0).text()).to.eql('100 kr');
    expect(elementFields.last().childAt(0).text()).to.eql('1');
  });

  it('skal rendre innvilget panel for foreldrepenger', () => {
    const wrapper = shallowWithIntl(<VedtakInnvilgetPanel.WrappedComponent
      intl={intlMock}
      behandlingsresultat={behandlingsresultat as Behandlingsresultat}
      ytelseTypeKode={foreldrepenger}
      readOnly
      skalBrukeOverstyrendeFritekstBrev
      beregningErManueltFastsatt={false}
      resultatstruktur={{
        antallBarn: 1,
      } as BeregningsresultatFp}
    />);

    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(1);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Resultat');


    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(1);
    expect(normaltekstFields.first().childAt(0).text()).to.eql('Foreldrepenger er innvilget');

    const elementFields = wrapper.find('Element');
    expect(elementFields).to.have.length(0);
  });
});
