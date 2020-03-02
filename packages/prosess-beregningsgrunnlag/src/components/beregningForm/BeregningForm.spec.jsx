import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme/build';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { AksjonspunktHelpTextHTML } from '@fpsak-frontend/shared-components';
import shallowWithIntl from '@fpsak-frontend/prosess-vedtak/i18n/intl-enzyme-test-helper-prosess-vedtak';
import { BeregningFormImpl, transformValues, buildInitialValues } from './BeregningForm';
import AvviksopplysningerPanel from '../fellesPaneler/AvvikopplysningerPanel';
import SkjeringspunktOgStatusPanel2 from '../fellesPaneler/SkjeringspunktOgStatusPanel';
import AksjonspunktBehandler from '../fellesPaneler/AksjonspunktBehandler';
import Beregningsgrunnlag from '../beregningsgrunnlagPanel/Beregningsgrunnlag';
import BeregningsresultatTable from '../beregningsresultatPanel/BeregningsresultatTable';

const apVurderDekningsgrad = {
  definisjon: {
    kode: aksjonspunktCodes.VURDER_DEKNINGSGRAD,
    navn: 'apNavn2',
  },
  status: {
    kode: 'OPPR',
    navn: 'statusNavn2',
  },
  kanLoses: true,
  erAktivt: true,
};
const apFastsettBgATFL = {
  definisjon: {
    kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
    navn: 'apNavn1',
  },
  status: {
    kode: 'UTFO',
    navn: 'statusNavn1',
  },
  kanLoses: false,
  erAktivt: false,
};

const apVurderVarigEndretEllerNyoppstartetSN = {
  definisjon: {
    kode: aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
    navn: 'apNavn3',
  },
  status: {
    kode: 'OPPR',
    navn: 'statusNavn3',
  },
  kanLoses: true,
  erAktivt: true,
};

const apFastsettBgSnNyIArbeidslivet = {
  definisjon: {
    kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
    navn: 'apNavn4',
  },
  status: {
    kode: 'OPPR',
    navn: 'statusNavn4',
  },
  kanLoses: true,
  erAktivt: true,
};
const apFastsettBgTidsbegrensetArbeidsforhold = {
  definisjon: {
    kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
    navn: 'apNavn5',
  },
  status: {
    kode: 'OPPR',
    navn: 'statusNavn5',
  },
  kanLoses: true,
  erAktivt: true,
};

const apEttLukketOgEttApent = [apFastsettBgATFL, apVurderDekningsgrad];

const allAndeler = [{
  aktivitetStatus: {
    kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
  },
  elementNavn: 'arbeidsgiver 1',
  beregnetPrAar: 200000,
  overstyrtPrAar: 100,
}];
const allPerioder = [{
  bruttoPrAar: 300000,
  beregningsgrunnlagPrStatusOgAndel: allAndeler,
}];

const relevanteStatuser = {
  isArbeidstaker: true,
  isKombinasjonsstatus: true,
};
const lagPeriode = () => ({
  beregningsgrunnlagPeriodeFom: '2019-09-16',
  beregningsgrunnlagPeriodeTom: undefined,
  beregnetPrAar: 360000,
  bruttoPrAar: 360000,
  bruttoInkludertBortfaltNaturalytelsePrAar: 360000,
  avkortetPrAar: 360000,
  redusertPrAar: 360000,
  beregningsgrunnlagPrStatusOgAndel: [{
    aktivitetStatus: {
      kode: 'AT',
      kodeverk: 'AKTIVITET_STATUS',
    },
  }],
  andelerLagtTilManueltIForrige: [],
});
const lagBeregningsgrunnlag = (avvikPromille, årsinntektVisningstall,
  sammenligningSum, dekningsgrad, tilfeller) => ({
  beregningsgrunnlagPeriode: [lagPeriode()],
  sammenligningsgrunnlag: {
    avvikPromille,
    rapportertPrAar: sammenligningSum,
  },
  dekningsgrad,
  årsinntektVisningstall,
  faktaOmBeregning: {
    faktaOmBeregningTilfeller: tilfeller,
  },
  aktivitetStatus: [{
    kode: 'UDEFINERT',
  }],
});
const alleKodeverk = {
  test: 'test',
};
const mockVilkar = [{
  vilkarType: {
    kode: 'FP_VK_41',
  },
  vilkarStatus: {
    kode: vilkarUtfallType.OPPFYLT,
  },
}];
const sammenligningsgrunnlag = (kode) => ({
  sammenligningsgrunnlagFom: '2018-09-01',
  sammenligningsgrunnlagTom: '2019-10-31',
  rapportertPrAar: 330000,
  avvikPromille: 275,
  avvikProsent: 27.5,
  sammenligningsgrunnlagType: {
    kode,
  },
  differanseBeregnet: 12100,
});

const getBGVilkar = (vilkar) => (vilkar ? vilkar.find((v) => v.vilkarType && v.vilkarType.kode === vilkarType.BEREGNINGSGRUNNLAGVILKARET) : undefined);
describe('<BeregningForm>', () => {
  it('skal teste at AvviksopplysningerPanel får korrekte props fra BeregningFP', () => {
    const beregningsgrunnlag = lagBeregningsgrunnlag(0, 100000, 100000, 100, []);
    const sammenligningsgrunnlagPrStatus = sammenligningsgrunnlag('SAMMENLIGNING_ATFL_SN');
    beregningsgrunnlag.sammenligningsgrunnlagPrStatus = [sammenligningsgrunnlagPrStatus];
    const wrapper = shallow(<BeregningFormImpl
      readOnly={false}
      beregningsgrunnlag={beregningsgrunnlag}
      gjeldendeAksjonspunkter={apEttLukketOgEttApent}
      relevanteStatuser={relevanteStatuser}
      submitCallback={sinon.spy}
      readOnlySubmitButton
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={alleKodeverk}
      vilkaarBG={getBGVilkar(mockVilkar)}
      {...reduxFormPropsMock}
    />);
    const avvikPanel = wrapper.find(AvviksopplysningerPanel);
    expect(avvikPanel.props().harAksjonspunkter).to.have.equal(true);
    expect(avvikPanel.props().gjelderBesteberegning).to.have.equal(false);
    expect(avvikPanel.props().sammenligningsgrunnlagPrStatus[0]).to.have.equal(sammenligningsgrunnlagPrStatus);
    expect(avvikPanel.props().relevanteStatuser).to.have.equal(relevanteStatuser);
    const expectedPerioder = lagPeriode();
    expect(avvikPanel.props().allePerioder[0]).to.eql(expectedPerioder);
  });
  it('skal teste at AksjonspunktHjelp rendrer fra BeregningFP', () => {
    const wrapper = shallow(<BeregningFormImpl
      readOnly={false}
      gjeldendeAksjonspunkter={apEttLukketOgEttApent}
      beregningsgrunnlag={lagBeregningsgrunnlag(0, 120000, 100000, 100, [])}
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={relevanteStatuser}
      submitCallback={sinon.spy}
      readOnlySubmitButton
      vilkaarBG={getBGVilkar(mockVilkar)}
      {...reduxFormPropsMock}
    />);
    const aksjonspunktHelpTextHTML = wrapper.find(AksjonspunktHelpTextHTML);
    expect(aksjonspunktHelpTextHTML.length).to.equal(1);
  });
  it('skal teste at SkjeringspunktOgStatusPanel får korrekte props fra BeregningFP', () => {
    const wrapper = shallow(<BeregningFormImpl
      readOnly={false}
      gjeldendeAksjonspunkter={apEttLukketOgEttApent}
      beregningsgrunnlag={lagBeregningsgrunnlag(0, 120000, 100000, 100, [])}
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={relevanteStatuser}
      submitCallback={sinon.spy}
      readOnlySubmitButton
      vilkaarBG={getBGVilkar(mockVilkar)}
      {...reduxFormPropsMock}
    />);
    const skjeringspunktOgStatusPanel = wrapper.find(SkjeringspunktOgStatusPanel2);
    expect(skjeringspunktOgStatusPanel.props().gjeldendeAksjonspunkter).to.equal(apEttLukketOgEttApent);
  });

  it('skal teste at Aksjonspunktbehandler får korrekte props fra BeregningFP', () => {
    const wrapper = shallow(<BeregningFormImpl
      readOnly={false}
      gjeldendeAksjonspunkter={apEttLukketOgEttApent}
      beregningsgrunnlag={lagBeregningsgrunnlag(0, 120000, 100000, 100, [])}
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={relevanteStatuser}
      submitCallback={sinon.spy}
      readOnlySubmitButton
      vilkaarBG={getBGVilkar(mockVilkar)}
      {...reduxFormPropsMock}
    />);
    const aksjonspunktBehandler = wrapper.find(AksjonspunktBehandler);
    expect(aksjonspunktBehandler.props().readOnly).to.have.equal(false);
    expect(aksjonspunktBehandler.props().tidsBegrensetInntekt).to.have.equal(false);
    const expectedPerioder = lagPeriode();
    expect(aksjonspunktBehandler.props().allePerioder[0]).to.eql(expectedPerioder);
    expect(aksjonspunktBehandler.props().aksjonspunkter).to.eql(apEttLukketOgEttApent);
  });

  it('skal teste at Beregningsgrunnlag får korrekte props fra BeregningFP', () => {
    relevanteStatuser.skalViseBeregningsgrunnlag = true;
    const wrapper = shallow(<BeregningFormImpl
      readOnly={false}
      gjeldendeAksjonspunkter={apEttLukketOgEttApent}
      beregningsgrunnlag={lagBeregningsgrunnlag(0, 100000, 100000, 100, [])}
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={relevanteStatuser}
      submitCallback={sinon.spy}
      readOnlySubmitButton
      vilkaarBG={getBGVilkar(mockVilkar)}
      {...reduxFormPropsMock}
    />);
    const formName = 'BeregningForm';
    const beregningsgrunnlag = wrapper.find(Beregningsgrunnlag);
    expect(beregningsgrunnlag.props().relevanteStatuser).to.have.equal(relevanteStatuser);
    expect(beregningsgrunnlag.props().readOnly).to.have.equal(false);
    expect(beregningsgrunnlag.props().gjeldendeAksjonspunkter).to.have.equal(apEttLukketOgEttApent);
    expect(beregningsgrunnlag.props().formName).to.have.equal(formName);
    expect(beregningsgrunnlag.props().readOnlySubmitButton).to.have.equal(true);
    expect(beregningsgrunnlag.props().submitCallback).to.have.equal(sinon.spy);
    const expectedPerioder = lagPeriode();
    expect(beregningsgrunnlag.props().allePerioder[0]).to.eql(expectedPerioder);
  });

  it('skal teste at Beregningsgrunnlag ikke blir vist', () => {
    relevanteStatuser.skalViseBeregningsgrunnlag = false;
    const wrapper = shallow(<BeregningFormImpl
      readOnly={false}
      gjeldendeAksjonspunkter={apEttLukketOgEttApent}
      beregningsgrunnlag={lagBeregningsgrunnlag(0, 100000, 100000, 100, [])}
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={relevanteStatuser}
      submitCallback={sinon.spy}
      readOnlySubmitButton
      vilkaarBG={getBGVilkar(mockVilkar)}
      {...reduxFormPropsMock}
    />);
    const beregningsgrunnlag = wrapper.find(Beregningsgrunnlag);
    expect(beregningsgrunnlag).to.have.lengthOf(0);
  });

  it('skal teste at BeregningForm rendrer riktige komponenter', () => {
    relevanteStatuser.skalViseBeregningsgrunnlag = false;
    const bg = lagBeregningsgrunnlag(0, 100000, 100000, 100, []);
    const wrapper = shallowWithIntl(<BeregningFormImpl
      readOnly={false}
      gjeldendeAksjonspunkter={apEttLukketOgEttApent}
      beregningsgrunnlag={bg}
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={alleKodeverk}
      relevanteStatuser={relevanteStatuser}
      submitCallback={sinon.spy}
      readOnlySubmitButton
      vilkaarBG={getBGVilkar(mockVilkar)}
      {...reduxFormPropsMock}
    />);
    const avvikspanel = wrapper.find('AvviksopplysningerPanel');
    expect(avvikspanel).to.have.lengthOf(1);
    const aksjonPunktPanel = wrapper.find(AksjonspunktBehandler);
    expect(aksjonPunktPanel).to.have.lengthOf(1);
    const beregningsResultatPanel = wrapper.find(BeregningsresultatTable);
    expect(beregningsResultatPanel).to.have.lengthOf(1);
  });


  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5087 og 5039, samt varigEndring', () => {
    const values = {
      fellesVurdering: 'bbb',
      begrunnDekningsgradEndring: 'aaa',
      dekningsgrad: 100,
      bruttoBeregningsgrunnlag: 240000,
      erVarigEndretNaering: true,
    };
    const aksjonspunkter = [apVurderDekningsgrad, apVurderVarigEndretEllerNyoppstartetSN];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkter, allPerioder);
    expect(result).to.have.lengthOf(2);
    expect(result[0].kode).to.have.equal('5087');
    expect(result[1].kode).to.have.equal('5039');
  });

  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5087 og 5039, uten varigEndring', () => {
    const values = {
      fellesVurdering: 'bbb',
      begrunnDekningsgradEndring: 'aaa',
      dekningsgrad: 100,
      bruttoBeregningsgrunnlag: 240000,
      erVarigEndretNaering: false,
    };
    const aksjonspunkter = [apVurderDekningsgrad, apVurderVarigEndretEllerNyoppstartetSN];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkter, allPerioder, false);
    expect(result).to.have.lengthOf(2);
    expect(result[0].kode).to.have.equal('5087');
    expect(result[1].kode).to.have.equal('5039');
  });

  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5087 og 5049', () => {
    const values = {
      fellesVurdering: 'bbb',
      begrunnDekningsgradEndring: 'aaa',
      dekningsgrad: 100,
      bruttoBeregningsgrunnlag: 240000,
    };
    const aksjonspunkter = [apVurderDekningsgrad, apFastsettBgSnNyIArbeidslivet];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkter, allPerioder, false);
    expect(result).to.have.lengthOf(2);
    expect(result[0].kode).to.have.equal('5087');
    expect(result[1].kode).to.have.equal('5049');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5087 og 5038', () => {
    const values = {
      fellesVurdering: 'bbb',
      begrunnDekningsgradEndring: 'aaa',
      dekningsgrad: 100,
      bruttoBeregningsgrunnlag: 240000,
    };
    const aksjonspunkter = [apVurderDekningsgrad, apFastsettBgATFL];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkter, allPerioder, false);
    expect(result).to.have.lengthOf(2);
    expect(result[0].kode).to.have.equal('5087');
    expect(result[1].kode).to.have.equal('5038');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5087 og 5039', () => {
    const values = {
      fellesVurdering: 'bbb',
      begrunnDekningsgradEndring: 'aaa',
      dekningsgrad: 100,
      bruttoBeregningsgrunnlag: 240000,
    };
    const aksjonspunkter = [apVurderDekningsgrad, apVurderVarigEndretEllerNyoppstartetSN];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkter, allPerioder, false);
    expect(result).to.have.lengthOf(2);
    expect(result[0].kode).to.have.equal('5087');
    expect(result[1].kode).to.have.equal('5039');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5087', () => {
    const values = {
      begrunnDekningsgradEndring: 'aaa',
      dekningsgrad: 100,
    };
    const aksjonspunkt = [apVurderDekningsgrad];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkt, allPerioder, false);
    expect(result).to.have.lengthOf(1);
    expect(result[0].kode).to.have.equal('5087');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5039', () => {
    const values = {
      fellesVurdering: 'bbb',
      bruttoBeregningsgrunnlag: 240000,
    };
    const aksjonspunkt = [apVurderVarigEndretEllerNyoppstartetSN];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkt, allPerioder, false);
    expect(result).to.have.lengthOf(1);
    expect(result[0].kode).to.have.equal('5039');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5049', () => {
    const values = {
      fellesVurdering: 'bbb',
      bruttoBeregningsgrunnlag: 240000,
    };
    const aksjonspunkt = [apFastsettBgSnNyIArbeidslivet];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkt, allPerioder, false);
    expect(result).to.have.lengthOf(1);
    expect(result[0].kode).to.have.equal('5049');
  });
  it('skal teste at transformValues blir transformert riktig med aksjonspunkt 5038', () => {
    const values = {};
    const aksjonspunkt = [apFastsettBgATFL];
    const result = transformValues(values, relevanteStatuser, allAndeler, aksjonspunkt, allPerioder, false);
    expect(result).to.have.lengthOf(1);
    expect(result[0].kode).to.have.equal('5038');
  });
  it('skal teste buildInitialValues', () => {
    const gjeldendeAksjonspunkter = [apFastsettBgTidsbegrensetArbeidsforhold];
    const beregningsgrunnlag = lagBeregningsgrunnlag(0, 120000, 100000, 100, []);

    const actualValues = buildInitialValues.resultFunc(beregningsgrunnlag, gjeldendeAksjonspunkter);
    const expectedValues = {
      ATFLVurdering: undefined,
      begrunnDekningsgradEndring: '',
      undefined: '',
      dekningsgrad: undefined,
    };
    expect(actualValues).to.deep.equal(expectedValues);
  });
});
