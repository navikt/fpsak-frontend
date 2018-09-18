import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import behandlingType from 'kodeverk/behandlingType';
import { VedtakInnvilgetPanelImpl } from './VedtakInnvilgetPanel';

const engangsstonad = fagsakYtelseType.ENGANGSSTONAD;
const foreldrepenger = fagsakYtelseType.FORELDREPENGER;
const behandlingsresultat = {
  type: {
    kode: 'INNVILGET',
  },
};

describe('<VedtakInnvilgetPanel>', () => {
  it('skal rendre innvilget panel for engangsstønad', () => {
    const wrapper = shallowWithIntl(<VedtakInnvilgetPanelImpl
      intl={intlMock}
      behandlingTypeKode={behandlingType.FORSTEGANGSSOKNAD}
      beregningResultat={{
        beregnetTilkjentYtelse: 100,
      }}
      behandlingsresultatTypeKode="test"
      antallBarn={1}
      behandlinger={[]}
      ytelseType={engangsstonad}
      behandlingsresultat={behandlingsresultat}
      skalBrukeOverstyrendeFritekstBrev
      readOnly
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
    const wrapper = shallowWithIntl(<VedtakInnvilgetPanelImpl
      intl={intlMock}
      behandlingTypeKode={behandlingType.FORSTEGANGSSOKNAD}
      beregningResultat={{
        beregnetTilkjentYtelse: 100,
      }}
      behandlingsresultatTypeKode="test"
      antallBarn={1}
      behandlinger={[]}
      ytelseType={foreldrepenger}
      behandlingsresultat={behandlingsresultat}
      skalBrukeOverstyrendeFritekstBrev
      readOnly
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
