import React from 'react';
import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';
import OpptjeningTotrinnText from './OpptjeningTotrinnText';

const lagOpptjeningAktivitetArbeidMedNavn = resultat => ({
  erEndring: resultat === 'ENDRING',
  aktivitetType: 'Arbeid',
  arbeidsgiverNavn: 'Andersen Transport AS',
  orgnr: '1234567890',
  godkjent: resultat === 'GODKJENT',
});

const lagOpptjeningAktivitetArbeidUtenNavn = resultat => ({
  erEndring: resultat === 'ENDRING',
  aktivitetType: 'Arbeid',
  arbeidsgiverNavn: null,
  orgnr: '1234567890',
  godkjent: resultat === 'GODKJENT',
});

const lagOpptjeningAktivitet = resultat => ({
  erEndring: resultat === 'ENDRING',
  aktivitetType: 'Aktivitet',
  arbeidsgiverNavn: null,
  orgnr: null,
  godkjent: resultat === 'GODKJENT',
});

describe('<OpptjeningTotrinnnText>', () => {
  it('skal vise korrekt tekst for opptjening med endring av arbeid med navn', () => {
    const wrapper = shallowWithIntl(<OpptjeningTotrinnText
      aktivitet={lagOpptjeningAktivitetArbeidMedNavn('ENDRING')}
    />);
    const normaltekstFields = wrapper.find('FormattedMessage');
    expect(normaltekstFields).to.have.length(1);
    expect(normaltekstFields.at(0).prop('id')).to.eql('ToTrinnsForm.Opptjening.EndringArbeidMedNavn');
  });

  it('skal vise korrekt tekst for opptjening med endring av arbeid uten navn', () => {
    const wrapper = shallowWithIntl(<OpptjeningTotrinnText
      aktivitet={lagOpptjeningAktivitetArbeidUtenNavn('ENDRING')}
    />);
    const normaltekstFields = wrapper.find('FormattedMessage');
    expect(normaltekstFields).to.have.length(1);
    expect(normaltekstFields.at(0).prop('id')).to.eql('ToTrinnsForm.Opptjening.EndringArbeidUtenNavn');
  });


  it('skal vise korrekt tekst for opptjening med endring av aktivitet', () => {
    const wrapper = shallowWithIntl(<OpptjeningTotrinnText
      aktivitet={lagOpptjeningAktivitet('ENDRING')}
    />);
    const normaltekstFields = wrapper.find('FormattedMessage');
    expect(normaltekstFields).to.have.length(1);
    expect(normaltekstFields.at(0).prop('id')).to.eql('ToTrinnsForm.Opptjening.EndringAktivitet');
  });


  it('skal vise korrekt tekst for opptjening med godkjenning av arbeid med navn', () => {
    const wrapper = shallowWithIntl(<OpptjeningTotrinnText
      aktivitet={lagOpptjeningAktivitetArbeidMedNavn('GODKJENT')}
    />);
    const normaltekstFields = wrapper.find('FormattedMessage');
    expect(normaltekstFields).to.have.length(1);
    expect(normaltekstFields.at(0).prop('id')).to.eql('ToTrinnsForm.Opptjening.GodkjenningArbeidMedNavn');
  });

  it('skal vise korrekt tekst for opptjening med godkjenning av arbeid uten navn', () => {
    const wrapper = shallowWithIntl(<OpptjeningTotrinnText
      aktivitet={lagOpptjeningAktivitetArbeidUtenNavn('GODKJENT')}
    />);
    const normaltekstFields = wrapper.find('FormattedMessage');
    expect(normaltekstFields).to.have.length(1);
    expect(normaltekstFields.at(0).prop('id')).to.eql('ToTrinnsForm.Opptjening.GodkjenningArbeidUtenNavn');
  });


  it('skal vise korrekt tekst for opptjening med godkjenning av aktivitet', () => {
    const wrapper = shallowWithIntl(<OpptjeningTotrinnText
      aktivitet={lagOpptjeningAktivitet('GODKJENT')}
    />);
    const normaltekstFields = wrapper.find('FormattedMessage');
    expect(normaltekstFields).to.have.length(1);
    expect(normaltekstFields.at(0).prop('id')).to.eql('ToTrinnsForm.Opptjening.GodkjenningAktivitet');
  });


  it('skal vise korrekt tekst for opptjening med underkjenning av arbeid med navn', () => {
    const wrapper = shallowWithIntl(<OpptjeningTotrinnText
      aktivitet={lagOpptjeningAktivitetArbeidMedNavn('UNDERKJENNING')}
    />);
    const normaltekstFields = wrapper.find('FormattedHTMLMessage');
    expect(normaltekstFields).to.have.length(1);
    expect(normaltekstFields.at(0).prop('id')).to.eql('ToTrinnsForm.Opptjening.UnderkjenningArbeidMedNavn');
  });

  it('skal vise korrekt tekst for opptjening med underkjenning av arbeid uten navn', () => {
    const wrapper = shallowWithIntl(<OpptjeningTotrinnText
      aktivitet={lagOpptjeningAktivitetArbeidUtenNavn('UNDERKJENNING')}
    />);
    const normaltekstFields = wrapper.find('FormattedHTMLMessage');
    expect(normaltekstFields).to.have.length(1);
    expect(normaltekstFields.at(0).prop('id')).to.eql('ToTrinnsForm.Opptjening.UnderkjenningArbeidUtenNavn');
  });


  it('skal vise korrekt tekst for opptjening med underkjenning av aktivitet', () => {
    const wrapper = shallowWithIntl(<OpptjeningTotrinnText
      aktivitet={lagOpptjeningAktivitet('UNDERKJENNING')}
    />);
    const normaltekstFields = wrapper.find('FormattedHTMLMessage');
    expect(normaltekstFields).to.have.length(1);
    expect(normaltekstFields.at(0).prop('id')).to.eql('ToTrinnsForm.Opptjening.UnderkjenningAktivitet');
  });
});
