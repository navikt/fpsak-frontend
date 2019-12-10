import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import AksjonspunktBehandler from './AksjonspunktBehandler';
import AksjonspunktBehandlerTB from '../arbeidstaker/AksjonspunktBehandlerTB';

const relevanteStatuser = {
  isFrilanser: false,
  isSelvstendigNaeringsdrivende: false,
  isArbeidstaker: false,
};
const alleKodeverk = {
  test: 'test',
};
const allePerioder = [
  {
    beregningsgrunnlagPrStatusOgAndel: [
      {
        beregnetPrAar: 360000,
        aktivitetStatus: {
          kode: 'AT',
          kodeverk: 'AKTIVITET_STATUS',
        },
        skalFastsetteGrunnlag: true,
      }],
  }];
const formName = 'BeregningForm';
const aksjonspunkter = [
  {
    begrunnelse: null,
    definisjon: {
      kode: '5038',
    },
    status: {
      kode: 'OPPR',
    },
  },
];

describe('<AksjonspunktBehandler>', () => {
  it('Skal teste at riktig componenter blir renderet for FL readOnly', () => {
    relevanteStatuser.isFrilanser = true;
    allePerioder[0].beregningsgrunnlagPrStatusOgAndel[0].aktivitetStatus.kode = 'FL';
    const readOnly = true;
    const wrapper = shallowWithIntl(<AksjonspunktBehandler
      readOnly={readOnly}
      aksjonspunkter={aksjonspunkter}
      formName={formName}
      behandlingId={1}
      behandlingVersjon={1}
      readOnlySubmitButton
      allePerioder={allePerioder}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={relevanteStatuser}
      tidsBegrensetInntekt={false}
    />);
    const rows = wrapper.find('Row');
    expect(rows.first().find('FormattedMessage').first().props().id).to.equal('Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandler');
    expect(rows.at(1).find('TextAreaField').first().props().name).to.equal('ATFLVurdering');
    expect(rows.at(1).find('TextAreaField').first().props().readOnly).to.equal(readOnly);
    const aksjonspunktBehandlerAT = wrapper.find('AksjonspunktBehandlerAT');
    const aksjonspunktBehandlerTB = wrapper.find('AksjonspunktBehandlerTB');
    const aksjonspunktBehandlerFL = wrapper.find('AksjonspunktBehandlerFL');
    const aksjonspunktBehandlerSN = wrapper.find('AksjonspunktBehandlerSN');

    expect(aksjonspunktBehandlerAT).to.have.length(0);
    expect(aksjonspunktBehandlerTB).to.have.length(0);
    expect(aksjonspunktBehandlerFL).to.have.length(1);
    expect(aksjonspunktBehandlerSN).to.have.length(0);
    expect(wrapper.find('BehandlingspunktSubmitButton')).to.have.length(0);
  });
  it('Skal teste at submitButton blir rendret riktig når readOnly=false', () => {
    relevanteStatuser.isFrilanser = true;
    allePerioder[0].beregningsgrunnlagPrStatusOgAndel[0].aktivitetStatus.kode = 'FL';
    const readOnly = false;
    const wrapper = shallowWithIntl(<AksjonspunktBehandler
      readOnly={readOnly}
      aksjonspunkter={aksjonspunkter}
      formName={formName}
      behandlingId={1}
      behandlingVersjon={1}
      readOnlySubmitButton
      allePerioder={allePerioder}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={relevanteStatuser}
      tidsBegrensetInntekt={false}
    />);
    const rows = wrapper.find('Row');
    expect(rows.first().find('FormattedMessage').first().props().id).to.equal('Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandler');
    expect(rows.at(1).find('TextAreaField').first().props().name).to.equal('ATFLVurdering');
    expect(rows.at(1).find('TextAreaField').first().props().readOnly).to.equal(readOnly);
    const aksjonspunktBehandlerAT = wrapper.find('AksjonspunktBehandlerAT');
    const aksjonspunktBehandlerTB = wrapper.find('AksjonspunktBehandlerTB');
    const aksjonspunktBehandlerFL = wrapper.find('AksjonspunktBehandlerFL');
    const aksjonspunktBehandlerSN = wrapper.find('AksjonspunktBehandlerSN');
    expect(aksjonspunktBehandlerAT).to.have.length(0);
    expect(aksjonspunktBehandlerTB).to.have.length(0);
    expect(aksjonspunktBehandlerFL).to.have.length(1);
    expect(aksjonspunktBehandlerSN).to.have.length(0);
    const submitButton = rows.at(2).first().childAt(0);
    expect(submitButton).to.have.length(1);
  });
  it('Skal teste at riktig componenter blir renderet for AT readOnly false', () => {
    relevanteStatuser.isFrilanser = false;
    relevanteStatuser.isSelvstendigNaeringsdrivende = false;
    relevanteStatuser.isArbeidstaker = true;
    allePerioder[0].beregningsgrunnlagPrStatusOgAndel[0].aktivitetStatus.kode = 'AT';
    const readOnly = true;
    const wrapper = shallowWithIntl(<AksjonspunktBehandler
      readOnly={readOnly}
      aksjonspunkter={aksjonspunkter}
      formName={formName}
      behandlingId={1}
      behandlingVersjon={1}
      readOnlySubmitButton
      allePerioder={allePerioder}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={relevanteStatuser}
      tidsBegrensetInntekt={false}
    />);
    const rows = wrapper.find('Row');
    expect(rows.first().find('FormattedMessage').first().props().id).to.equal('Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandler');
    expect(rows.at(1).find('TextAreaField').first().props().name).to.equal('ATFLVurdering');
    expect(rows.at(1).find('TextAreaField').first().props().readOnly).to.equal(readOnly);
    const aksjonspunktBehandlerAT = wrapper.find('AksjonspunktBehandlerAT');
    const aksjonspunktBehandlerTB = wrapper.find('AksjonspunktBehandlerTB');
    const aksjonspunktBehandlerFL = wrapper.find('AksjonspunktBehandlerFL');
    const aksjonspunktBehandlerSN = wrapper.find('AksjonspunktBehandlerSN');
    expect(aksjonspunktBehandlerAT).to.have.length(1);
    expect(aksjonspunktBehandlerTB).to.have.length(0);
    expect(aksjonspunktBehandlerFL).to.have.length(0);
    expect(aksjonspunktBehandlerSN).to.have.length(0);
    const submitButton = rows.at(2).first().childAt(0);
    expect(submitButton).to.have.length(1);
  });
  it('Skal teste at riktig componenter blir renderet for AT tidsbegrenset readOnly false', () => {
    relevanteStatuser.isFrilanser = false;
    relevanteStatuser.isSelvstendigNaeringsdrivende = false;
    relevanteStatuser.isArbeidstaker = true;
    allePerioder[0].beregningsgrunnlagPrStatusOgAndel[0].aktivitetStatus.kode = 'AT';
    const readOnly = true;
    const wrapper = shallowWithIntl(<AksjonspunktBehandler
      readOnly={readOnly}
      aksjonspunkter={aksjonspunkter}
      formName={formName}
      behandlingId={1}
      behandlingVersjon={1}
      readOnlySubmitButton
      allePerioder={allePerioder}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={relevanteStatuser}
      tidsBegrensetInntekt
    />);
    const rows = wrapper.find('Row');
    expect(rows.first().find('FormattedMessage').first().props().id).to.equal('Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandler');
    expect(rows.at(1).find('TextAreaField').first().props().name).to.equal('ATFLVurdering');
    expect(rows.at(1).find('TextAreaField').first().props().readOnly).to.equal(readOnly);
    const aksjonspunktBehandlerAT = wrapper.find('AksjonspunktBehandlerAT');
    const aksjonspunktBehandlerTB = wrapper.find(AksjonspunktBehandlerTB);
    const aksjonspunktBehandlerFL = wrapper.find('AksjonspunktBehandlerFL');
    const aksjonspunktBehandlerSN = wrapper.find('AksjonspunktBehandlerSN');
    expect(aksjonspunktBehandlerAT).to.have.length(0);
    expect(aksjonspunktBehandlerTB).to.have.length(1);
    expect(aksjonspunktBehandlerFL).to.have.length(0);
    expect(aksjonspunktBehandlerSN).to.have.length(0);
    const submitButton = rows.at(2).first().childAt(0);
    expect(submitButton).to.have.length(1);
  });
  it('Skal teste at riktig componenter blir renderet for SN NyIArbeidslivet==true', () => {
    relevanteStatuser.isFrilanser = false;
    relevanteStatuser.isSelvstendigNaeringsdrivende = true;
    relevanteStatuser.isArbeidstaker = false;
    const snPeriode = {
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
      erNyIArbeidslivet: true,
    };
    const readOnly = true;
    const perioderMedSNAndel = allePerioder;
    perioderMedSNAndel[0].beregningsgrunnlagPrStatusOgAndel[0] = snPeriode;
    const wrapper = shallowWithIntl(<AksjonspunktBehandler
      readOnly={readOnly}
      aksjonspunkter={aksjonspunkter}
      formName={formName}
      behandlingId={1}
      behandlingVersjon={1}
      readOnlySubmitButton
      allePerioder={perioderMedSNAndel}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={relevanteStatuser}
      tidsBegrensetInntekt={false}
      erNyArbLivet
    />);
    const rows = wrapper.find('Row');
    expect(rows.first().find('FormattedMessage').first().props().id).to.equal('Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandler.NyIArbeidslivet');
    const aksjonspunktBehandlerAT = wrapper.find('AksjonspunktBehandlerAT');
    const aksjonspunktBehandlerTB = wrapper.find(AksjonspunktBehandlerTB);
    const aksjonspunktBehandlerFL = wrapper.find('AksjonspunktBehandlerFL');
    const aksjonspunktBehandlerSN = wrapper.find('AksjonspunktBehandlerSN');
    expect(aksjonspunktBehandlerAT).to.have.length(0);
    expect(aksjonspunktBehandlerTB).to.have.length(0);
    expect(aksjonspunktBehandlerFL).to.have.length(0);
    expect(aksjonspunktBehandlerSN).to.have.length(1);
  });
});
