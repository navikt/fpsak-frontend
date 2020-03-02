import { expect } from 'chai';
import React from 'react';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import FastsettSN, { FastsettSN as UnwrappedForm, begrunnelseFieldname, fastsettInntektFieldname } from './FastsettSN';

const mockAksjonspunktMedKodeOgStatus = (apKode, begrunnelse) => ({
  definisjon: {
    kode: apKode,
  },
  status: {
    kode: 'OPPR',
  },
  begrunnelse,
});

const lagAndel = (status, fastsattBelop) => ({
  aktivitetStatus: {
    kode: status,
  },
  beregnetPrAar: 200000,
  overstyrtPrAar: fastsattBelop,
  beregningsperiodeFom: '2015-01-01',
  beregningsperiodeTom: '2017-01-01',
});

describe('<FastsettSN>', () => {
  it('Skal teste at det rendres riktig antall rader', () => {
    const aksjonspunkter = [mockAksjonspunktMedKodeOgStatus(aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE, 'Ok.')];
    const wrapper = shallowWithIntl(<UnwrappedForm
      readOnly={false}
      isAksjonspunktClosed={false}
      erVarigEndring
      erNyArbLivet
      gjeldendeAksjonspunkter={aksjonspunkter}
      endretTekst={{}}
      intl={intlMock}
    />);

    const rows = wrapper.find('Row');
    expect(rows.length).to.equal(2);
  });
  it('Skal teste at buildInitialValues bygges korrekt når tidligere fastsatt', () => {
    const andeler = [lagAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, 300000), lagAndel(aktivitetStatus.ARBEIDSTAKER, 250000)];
    const aksjonspunkter = [mockAksjonspunktMedKodeOgStatus(aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE, 'Ok.')];

    const actualValues = FastsettSN.buildInitialValues(andeler, aksjonspunkter);

    const expectedValues = {
      [fastsettInntektFieldname]: '300 000',
      [begrunnelseFieldname]: 'Ok.',
    };

    expect(actualValues).to.deep.equal(expectedValues);
  });

  it('Skal teste at buildInitialValues bygges korrekt når ikke tidligere fastsatt', () => {
    const andeler = [lagAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, null), lagAndel(aktivitetStatus.ARBEIDSTAKER, 250000)];
    const aksjonspunkter = [mockAksjonspunktMedKodeOgStatus(aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE, null)];

    const actualValues = FastsettSN.buildInitialValues(andeler, aksjonspunkter);

    const expectedValues = {
      [fastsettInntektFieldname]: undefined,
      [begrunnelseFieldname]: '',
    };

    expect(actualValues).to.deep.equal(expectedValues);
  });

  it('Skal teste at buildInitialValues bygges korrekt når ikke tidligere fastsatt på sn ny i arbliv', () => {
    const andeler = [lagAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, null), lagAndel(aktivitetStatus.ARBEIDSTAKER, 250000)];
    const aksjonspunkter = [mockAksjonspunktMedKodeOgStatus(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, null)];

    const actualValues = FastsettSN.buildInitialValues(andeler, aksjonspunkter);
    const expectedValues = {
      [fastsettInntektFieldname]: undefined,
      [begrunnelseFieldname]: '',
    };

    expect(actualValues).to.deep.equal(expectedValues);
  });

  it('Skal teste at buildInitialValues bygges korrekt når ikke tidligere fastsatt på sn ny i arbliv', () => {
    const andeler = [lagAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, 500000), lagAndel(aktivitetStatus.ARBEIDSTAKER, 250000)];
    const aksjonspunkter = [mockAksjonspunktMedKodeOgStatus(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, 'Ok!!!')];

    const actualValues = FastsettSN.buildInitialValues(andeler, aksjonspunkter);

    const expectedValues = {
      [fastsettInntektFieldname]: '500 000',
      [begrunnelseFieldname]: 'Ok!!!',
    };

    expect(actualValues).to.deep.equal(expectedValues);
  });
});
