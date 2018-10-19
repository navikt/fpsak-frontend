import React from 'react';
import { expect } from 'chai';
import { Undertekst, Element, Normaltekst } from 'nav-frontend-typografi';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import { VedtakInnvilgetRevurderingPanelImpl, lagKonsekvensForYtelsenTekst } from './VedtakInnvilgetRevurderingPanel';


const ytelseType = fagsakYtelseType.ENGANGSSTONAD;

describe('<VedtakInnvilgetRevurderingPanel>', () => {
  it('skal rendre innvilget revurdering panel for engangsstønad ingen endring', () => {
    const originaltBeregningsresultat = {
      beregnetTilkjentYtelse: 61120,
      satsVerdi: 61120,
      antallBarn: 1,
    };

    const beregningResultat = {
      beregnetTilkjentYtelse: 61120,
      satsVerdi: 61120,
      antallBarn: 1,
    };

    const wrapper = shallowWithIntl(<VedtakInnvilgetRevurderingPanelImpl
      intl={intlMock}
      antallBarn={1}
      originaltBeregningResultat={originaltBeregningsresultat}
      beregningResultat={beregningResultat}
      ytelseType={ytelseType}
      readOnly
      behandlingsresultat={{}}
      hasOverstyrtVurderingAp={false}
    />);

    const undertekstFields = wrapper.find(Undertekst);
    expect(undertekstFields).to.have.length(3);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Resultat');
    expect(undertekstFields.at(1).childAt(0).text()).to.eql('Beregnet engangsstønad');
    expect(undertekstFields.last().childAt(0).text()).to.eql('Antall barn');

    const normaltekstFields = wrapper.find(Normaltekst);
    expect(normaltekstFields).to.have.length(1);
    expect(normaltekstFields.first().childAt(0).text()).to.eql('Ingen endring');

    const elementFields = wrapper.find(Element);
    expect(elementFields).to.have.length(2);
    expect(elementFields.first().childAt(0).text()).to.eql('61 120 kr');
    expect(elementFields.last().childAt(0).text()).to.eql('1');
  });


  it('skal rendre innvilget revurdering panel for engangsstønad endret til avslått', () => {
    const originaltBeregningsresultat = {
      beregnetTilkjentYtelse: 61120,
      satsVerdi: 61120,
      antallBarn: 1,
    };

    const wrapper = shallowWithIntl(<VedtakInnvilgetRevurderingPanelImpl
      intl={intlMock}
      antallBarn={1}
      originaltBeregningResultat={originaltBeregningsresultat}
      ytelseType={ytelseType}
      readOnly
      behandlingsresultat={{}}
      hasOverstyrtVurderingAp={false}
    />);

    const undertekstFields = wrapper.find(Undertekst);
    expect(undertekstFields).to.have.length(2);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Resultat');
    expect(undertekstFields.last().childAt(0).text()).to.eql('Antall barn');

    const normaltekstFields = wrapper.find(Normaltekst);
    expect(normaltekstFields).to.have.length(1);
    expect(normaltekstFields.first().childAt(0).text()).to.eql('Endret til Avslag');

    const elementFields = wrapper.find(Element);
    expect(elementFields).to.have.length(1);
    expect(elementFields.first().childAt(0).text()).to.eql('1');
  });

  it('skal lage korrekt tekst for konsekvens for ytelsen', () => {
    const konsekvenser = [
      {
        kode: 'BEREGNING',
        navn: 'Endring i beregning',
      },
      {
        kode: 'UTTAK',
        navn: 'Endring i uttak',
      },
    ];
    const selectorData = lagKonsekvensForYtelsenTekst(konsekvenser);
    expect(selectorData).to.eql('Endring i beregning og Endring i uttak');
  });
});
