import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
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
    beregningsgrunnlagPrStatusOgAndel: [{}],
  },
];
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
  it('Skal teste at riktig componenter blir renderet for SN readOnly false', () => {
    relevanteStatuser.isFrilanser = false;
    relevanteStatuser.isSelvstendigNaeringsdrivende = true;
    relevanteStatuser.isArbeidstaker = false;
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
