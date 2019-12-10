import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import AvviksopplysningerSN from './AvvikopplysningerSN';


const beregnetAarsinntekt = 360000;
const sammenligningsgrunnlag = 330000;
const avvik = 25;

describe('<AvviksopplysningerSN>', () => {
  it('Skal teste tabellen får korrekte rader med innhold', () => {
    const forstePeriode = [
      {
        pgiSnitt: 100,
        aktivitetStatus:
          {
            kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
          },
        næringer: [
          {
            erVarigEndret: false,
            erNyoppstartet: false,
          },
        ],
        erNyIArbeidslivet: false,
      },
    ];

    const wrapper = shallowWithIntl(<AvviksopplysningerSN
      beregnetAarsinntekt={beregnetAarsinntekt}
      sammenligningsgrunnlag={sammenligningsgrunnlag}
      avvik={avvik}
      alleAndelerIForstePeriode={forstePeriode}
      harAksjonspunkter
    />);

    const rows = wrapper.find('Row');

    expect(rows).to.have.length(4);
    const omregnetAarsinntektText = rows.first().find('FormattedMessage');
    expect(omregnetAarsinntektText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.PensjonsgivendeInntekt');
    const omregnetAarsinntektVerdi = rows.first().find('Normaltekst');
    expect(omregnetAarsinntektVerdi.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr(forstePeriode[0].pgiSnitt));

    const rapportertAarsinntektText = rows.at(1).find('FormattedMessage');
    expect(rapportertAarsinntektText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.OppgittAarsinntekt');
    const rapportertAarsinntektVerdi = rows.at(1).find('Normaltekst');
    expect(rapportertAarsinntektVerdi.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr(sammenligningsgrunnlag));

    const avvikText = rows.at(3).find('FormattedMessage');
    expect(avvikText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.BeregnetAvvik');
    const avvikVerdi = rows.at(3).find('Normaltekst');
    expect(avvikVerdi.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr((beregnetAarsinntekt - sammenligningsgrunnlag)));
    const avvikProsentText = rows.at(3).find('FormattedMessage').at(1);
    const avvikProsentValue = avvikProsentText.first().prop('values');
    expect(avvikProsentText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.AvvikProsent');
    expect(avvikProsentValue.avvik).to.eql(avvik);
  });
});
