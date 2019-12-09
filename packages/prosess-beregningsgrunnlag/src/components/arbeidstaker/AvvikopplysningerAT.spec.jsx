import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import AvviksopplysningerAT from './AvvikopplysningerAT';

const beregnetAarsinntekt = 360000;
const sammenligningsgrunnlag = 330000;
const avvik = 25;

describe('<AvviksopplysningerAT>', () => {
  it('Skal teste tabellen får korrekte rader med innhold når ikke kombinasjonsstatus', () => {
    const wrapper = shallowWithIntl(<AvviksopplysningerAT
      beregnetAarsinntekt={beregnetAarsinntekt}
      sammenligningsgrunnlag={sammenligningsgrunnlag}
      avvik={avvik}
      relevanteStatuser={{ isKombinasjonsstatus: false }}
      aktivitetStatusKode=""
    />);
    const rows = wrapper.find('Row');

    expect(rows).to.have.length(4);
    const omregnetAarsinntektText = rows.first().find('FormattedMessage');
    expect(omregnetAarsinntektText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.OmregnetAarsinntekt.Arbeid');
    const omregnetAarsinntektVerdi = rows.first().find('Normaltekst');
    expect(omregnetAarsinntektVerdi.at(1).childAt(0).text()).to.equal(formatCurrencyNoKr(beregnetAarsinntekt));

    const rapportertAarsinntektText = rows.at(1).find('FormattedMessage');
    expect(rapportertAarsinntektText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.RapportertAarsinntekt.Arbeid');
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
  it('Skal teste tabellen får korrekte rader med innhold når kombinasjonsstatus=KOMBINERT_AT_SN', () => {
    const wrapper = shallowWithIntl(<AvviksopplysningerAT
      beregnetAarsinntekt={beregnetAarsinntekt}
      sammenligningsgrunnlag={sammenligningsgrunnlag}
      avvik={avvik}
      relevanteStatuser={{ isKombinasjonsstatus: true }}
      aktivitetStatusKode={aktivitetStatus.KOMBINERT_AT_SN}
    />);
    const rows = wrapper.find('Row');
    expect(rows).to.have.length(1);
    const infoText = rows.first().find('FormattedMessage');
    expect(infoText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.AT.KobinasjonsStatusATSN');
  });
  it('Skal teste tabellen får korrekte rader med innhold når kombinasjonsstatus=KOMBINERT_AT_FL_SN', () => {
    const wrapper = shallowWithIntl(<AvviksopplysningerAT
      beregnetAarsinntekt={beregnetAarsinntekt}
      sammenligningsgrunnlag={sammenligningsgrunnlag}
      avvik={avvik}
      relevanteStatuser={{ isKombinasjonsstatus: true }}
      aktivitetStatusKode={aktivitetStatus.KOMBINERT_AT_FL_SN}
    />);
    const rows = wrapper.find('Row');
    expect(rows).to.have.length(1);
    const infoText = rows.first().find('FormattedMessage');
    expect(infoText.first().prop('id')).to.eql('Beregningsgrunnlag.Avikssopplysninger.AT.KobinasjonsStatusATFLSN');
  });
});
