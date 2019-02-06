import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ApiStateBuilder } from '@fpsak-frontend/assets/testHelpers/data-test-helper';
import fpsakBehandlingApi from 'behandlingFpsak/src/data/fpsakBehandlingApi';
import {
  FaktaForATFLOgSNPanelImpl,
  getHelpTextsFaktaForATFLOgSN,
  transformValuesFaktaForATFLOgSN,
  mapStateToValidationProps,
  setInntektValues,
  transformValues,
  isReadOnly,
} from './FaktaForATFLOgSNPanel';
import TidsbegrensetArbeidsforholdForm from './tidsbegrensetArbeidsforhold/TidsbegrensetArbeidsforholdForm';
import FastsettEndretBeregningsgrunnlag from './endringBeregningsgrunnlag/FastsettEndretBeregningsgrunnlag';
import TilstotendeYtelseIKombinasjon from './tilstøtendeYtelse/TilstotendeYtelseIKombinasjon';
import NyIArbeidslivetSNForm from './nyIArbeidslivet/NyIArbeidslivetSNForm';
import { createInputfieldKeyAT, createInputfieldKeyFL } from './vurderOgFastsettATFL/forms/FastsettATFLInntektForm';
import { lonnsendringField } from './vurderOgFastsettATFL/forms/LonnsendringForm';
import { erNyoppstartetFLField } from './vurderOgFastsettATFL/forms/NyoppstartetFLForm';
import {
  createInputFieldKeyForAndel,
  createSelectfieldKeyForAndel,
} from './besteberegningFodendeKvinne/FastsettBBFodendeKvinneForm';
import VurderOgFastsettATFL from './vurderOgFastsettATFL/VurderOgFastsettATFL';

const {
  VURDER_FAKTA_FOR_ATFL_SN,
} = aksjonspunktCodes;

const aksjonspunkter = [{
  definisjon:
  { kode: VURDER_FAKTA_FOR_ATFL_SN },
}];


const showTableCallback = sinon.spy();


describe('<FaktaForATFLOgSNPanel>', () => {
  it('skal teste at state props blir mappet til validering', () => {
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG }],
      endringBeregningsgrunnlag: {
        endringBeregningsgrunnlagPerioder: [
          { fom: '01.01.2018', tom: '01.01.2019' },
        ],
      },
      kunYtelse: 'KunYtelse',
      vurderMottarYtelse: 'vurderMottarYtelse',
    };
    const data = {
      id: 1000051,
      beregningsgrunnlag: {
        faktaOmBeregning,
        bg: 'beregningsgrunnlag',
      },
    };
    const dataState = new ApiStateBuilder()
      .withData(fpsakBehandlingApi.BEHANDLING.name, data, 'dataContextFpsakBehandling')
      .withData(fpsakBehandlingApi.ORIGINAL_BEHANDLING.name, {}, 'dataContextFpsakBehandling')
      .build();
    const state = {
      default: {
        ...dataState.default,
        fpsakBehandling: {
          behandlingId: 1000051,
        },
      },
    };
    const props = mapStateToValidationProps(state);
    expect(props.aktivertePaneler.length).to.equal(1);
    expect(props.aktivertePaneler[0]).to.equal(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG);
    expect(props.endringBGPerioder.length).to.equal(1);
    expect(props.endringBGPerioder[0].fom).to.equal('01.01.2018');
    expect(props.kunYtelse).to.equal('KunYtelse');
    expect(props.vurderMottarYtelse).to.equal('vurderMottarYtelse');
    expect(props.faktaOmBeregning).to.equal(faktaOmBeregning);
    expect(props.beregningsgrunnlag.bg).to.equal('beregningsgrunnlag');
  });


  it('skal gi read only når saksbehandler ikkje har redigeringsrettighet', () => {
    const rettigheter = {
      writeAccess: {
        isEnabled: false,
      },
    };
    const isOnHold = false;
    const readOnlyBehandling = false;
    const readOnly = isReadOnly.resultFunc(rettigheter, isOnHold, readOnlyBehandling);
    expect(readOnly).to.equal(true);
  });

  it('skal ikkje gi read only når saksbehandler har redigeringsrettighet', () => {
    const rettigheter = {
      writeAccess: {
        isEnabled: true,
      },
    };
    const isOnHold = false;
    const readOnlyBehandling = false;
    const readOnly = isReadOnly.resultFunc(rettigheter, isOnHold, readOnlyBehandling);
    expect(readOnly).to.equal(false);
  });

  it('skal gi read only når sak er satt på vent', () => {
    const rettigheter = {
      writeAccess: {
        isEnabled: true,
      },
    };
    const isOnHold = true;
    const readOnlyBehandling = false;
    const readOnly = isReadOnly.resultFunc(rettigheter, isOnHold, readOnlyBehandling);
    expect(readOnly).to.equal(true);
  });

  it('skal gi read only når behandling er read only behandling', () => {
    const rettigheter = {
      writeAccess: {
        isEnabled: true,
      },
    };
    const isOnHold = false;
    const readOnlyBehandling = true;
    const readOnly = isReadOnly.resultFunc(rettigheter, isOnHold, readOnlyBehandling);
    expect(readOnly).to.equal(true);
  });

  it('skal lage helptext', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD, faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET,
      faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL,
      faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG];
    const helpText = getHelpTextsFaktaForATFLOgSN.resultFunc(aktivertePaneler, aksjonspunkter, [], []);
    expect(helpText).to.have.length(1);
    expect(helpText[0].props.id).to.equal('BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning');
  });

  it('skal lage helptext for fastsetting av ATFL inntekt sammen men refusjon og gradering', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON,
      faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG];
    const helpText = getHelpTextsFaktaForATFLOgSN.resultFunc(aktivertePaneler, aksjonspunkter, [], []);
    expect(helpText).to.have.length(1);
  });

  it('skal lage helptext for fastsetting av ATFL inntekt uten refusjon og gradering', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON];
    const helpText = getHelpTextsFaktaForATFLOgSN.resultFunc(aktivertePaneler, aksjonspunkter, [], []);
    expect(helpText).to.have.length(1);
  });

  it('skal ikkje lage helptext for kun refusjon og gradering', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG];
    const helpText = getHelpTextsFaktaForATFLOgSN.resultFunc(aktivertePaneler, aksjonspunkter, [], []);
    expect(helpText).to.have.length(0);
  });

  it('skal vise TidsbegrensetArbeidsforholdForm', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
      formName="test"
      isAksjonspunktClosed={false}
      showTableCallback={showTableCallback}
    />);
    const tidsbegrensetArbeidsforhold = wrapper.find(TidsbegrensetArbeidsforholdForm);
    expect(tidsbegrensetArbeidsforhold).to.have.length(1);
  });

  it('skal vise NyIArbeidslivetSNForm', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
      formName="test"
      isAksjonspunktClosed={false}
      showTableCallback={showTableCallback}
    />);
    const nyIArbeidslivet = wrapper.find(NyIArbeidslivetSNForm);
    expect(nyIArbeidslivet).to.have.length(1);
  });

  it('skal vise NyoppstartetFLForm', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
      formName="test"
      isAksjonspunktClosed={false}
      showTableCallback={showTableCallback}
    />);
    const vurderATFL = wrapper.find(VurderOgFastsettATFL);
    expect(vurderATFL).to.have.length(1);
  });

  it('skal vise FastsettEndretBeregningsgrunnlag', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
      formName="test"
      isAksjonspunktClosed={false}
      showTableCallback={showTableCallback}
    />);
    const endretBeregninsgrunnlag = wrapper.find(FastsettEndretBeregningsgrunnlag);
    expect(endretBeregninsgrunnlag).to.have.length(1);
  });

  it('skal ikkje vise FastsettEndretBeregningsgrunnlag om man har fastsett bg kun ytelse', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG, faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
      formName="test"
      isAksjonspunktClosed={false}
      showTableCallback={showTableCallback}
    />);
    const endretBeregninsgrunnlag = wrapper.find(FastsettEndretBeregningsgrunnlag);
    expect(endretBeregninsgrunnlag).to.have.length(0);
  });

  it('skal ikkje vise FastsettEndretBeregningsgrunnlag om man har nyoppstartet frilans', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG, faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
      formName="test"
      isAksjonspunktClosed={false}
      showTableCallback={showTableCallback}
    />);
    const endretBeregninsgrunnlag = wrapper.find(FastsettEndretBeregningsgrunnlag);
    expect(endretBeregninsgrunnlag).to.have.length(0);
  });

  it('skal ikkje vise FastsettEndretBeregningsgrunnlag om man har vurder lønnsendring', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG, faktaOmBeregningTilfelle.VURDER_LONNSENDRING];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
      formName="test"
      isAksjonspunktClosed={false}
      showTableCallback={showTableCallback}
    />);
    const endretBeregninsgrunnlag = wrapper.find(FastsettEndretBeregningsgrunnlag);
    expect(endretBeregninsgrunnlag).to.have.length(0);
  });

  it('skal ikkje vise FastsettEndretBeregningsgrunnlag om man har vurder mottar ytelse', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG, faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
      formName="test"
      isAksjonspunktClosed={false}
      showTableCallback={showTableCallback}
    />);
    const endretBeregninsgrunnlag = wrapper.find(FastsettEndretBeregningsgrunnlag);
    expect(endretBeregninsgrunnlag).to.have.length(0);
  });

  it('skal ikkje vise FastsettEndretBeregningsgrunnlag om man har ATFL i samme org', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG, faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
      formName="test"
      isAksjonspunktClosed={false}
      showTableCallback={showTableCallback}
    />);
    const endretBeregninsgrunnlag = wrapper.find(FastsettEndretBeregningsgrunnlag);
    expect(endretBeregninsgrunnlag).to.have.length(0);
  });

  it('skal rendre Inntektstabell om Tilstøtende ytelse og kortvarig arbeidsforhold', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE, faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
      formName="test"
      isAksjonspunktClosed={false}
      showTableCallback={showTableCallback}
    />);
    const tyKombinasjon = wrapper.find(TilstotendeYtelseIKombinasjon);
    expect(tyKombinasjon).to.have.length(1);
  });

  it('legge kun legge til values fra ATFL i samme org i kombinasjon om sammen med besteberegning', () => {
    const aktivePaneler = [faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE, faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON];
    const arbeidsforhold1 = { arbeidsgiverNavn: 'navn', startdato: 'dato', arbeidsforholdId: '1' };
    const arbeidsforhold2 = { arbeidsgiverNavn: 'navn', startdato: 'dato', arbeidsforholdId: '2' };
    const faktaOmBeregning = {
      tilstøtendeYtelse: {
        skalReduseres: false,
        dekningsgrad: 100,
        erBesteberegning: false,
      },
      frilansAndel: { andelsnr: 3 },
      arbeidsforholdMedLønnsendringUtenIM: [
        { andelsnr: 1, inntektPrMnd: 10000, arbeidsforhold: arbeidsforhold1 },
        { andelsnr: 2, inntektPrMnd: 10000, arbeidsforhold: arbeidsforhold2 }],
    };
    const values = {};
    values[createInputfieldKeyAT(arbeidsforhold1)] = '10 000';
    values[createInputfieldKeyAT(arbeidsforhold2)] = '10 000';
    values[createInputfieldKeyFL()] = '20 000';
    const transformedValues = transformValuesFaktaForATFLOgSN.resultFunc(aktivePaneler, [], undefined, faktaOmBeregning, {})(values);
    expect(transformedValues.faktaOmBeregningTilfeller).to.have.length(1);
    expect(transformedValues.faktaOmBeregningTilfeller[0]).is.eql(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON);
  });

  it('skal kunne transform values for kun besteberegning', () => {
    const aktivePaneler = [faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE];
    const andel1 = { andelsnr: 1, aktivitetStatus: { kode: 'ATFL' } };
    const andel2 = { andelsnr: 2, aktivitetStatus: { kode: 'SN' } };
    const faktaOmBeregning = {
      besteberegningAndeler: [andel1, andel2],
    };
    const values = {};
    values[createInputFieldKeyForAndel(andel1)] = '10 000';
    values[createSelectfieldKeyForAndel(andel1)] = 'ARBEIDSTAKER';
    values[createInputFieldKeyForAndel(andel2)] = '20 000';
    values[createSelectfieldKeyForAndel(andel2)] = 'SELVSTENDIG_NÆRINGSDRIVENDE';
    const transformedValues = transformValuesFaktaForATFLOgSN.resultFunc(aktivePaneler, [], undefined, faktaOmBeregning, {})(values);
    expect(transformedValues.faktaOmBeregningTilfeller).to.have.length(1);
    expect(transformedValues.faktaOmBeregningTilfeller[0]).is.eql(faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE);
    expect(transformedValues.besteberegningAndeler.besteberegningAndelListe).to.have.length(2);
    expect(transformedValues.besteberegningAndeler.besteberegningAndelListe[0].andelsnr).is.eql(andel1.andelsnr);
    expect(transformedValues.besteberegningAndeler.besteberegningAndelListe[0].inntektPrMnd).is.eql(10000);
    expect(transformedValues.besteberegningAndeler.besteberegningAndelListe[0].inntektskategori).is.eql('ARBEIDSTAKER');
    expect(transformedValues.besteberegningAndeler.besteberegningAndelListe[1].andelsnr).is.eql(andel2.andelsnr);
    expect(transformedValues.besteberegningAndeler.besteberegningAndelListe[1].inntektPrMnd).is.eql(20000);
    expect(transformedValues.besteberegningAndeler.besteberegningAndelListe[1].inntektskategori).is.eql('SELVSTENDIG_NÆRINGSDRIVENDE');
  });


  it('skal kunne transform values nyoppstartet fl og lønnsendring', () => {
    const aktivePaneler = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.VURDER_LONNSENDRING];
    const forholdMedAtOgFl = {
      andelsnr: 2,
      inntektskategori: {
        navn: 'Arbeidstaker',
      },
      arbeidsforhold: {
        arbeidsgiverNavn: 'bedrift',
        arbeidsgiverId: '123',
        arbeidsforholdId: 'abc',
        startdato: '2018-01-01',
      },
    };

    const forholdMedLonnsendringUtenIM = {
      andelsnr: 2,
      inntektskategori: {
        navn: 'Arbeidstaker',
      },
      arbeidsforhold: {
        arbeidsgiverNavn: 'bedrift',
        arbeidsgiverId: '123',
        arbeidsforholdId: 'abc',
        startdato: '2018-01-01',
      },
    };

    const faktaOmBeregning = {
      arbeidsforholdMedLønnsendringUtenIM: [forholdMedLonnsendringUtenIM],
      arbeidstakerOgFrilanserISammeOrganisasjonListe: [forholdMedAtOgFl],
      frilansAndel: {
        inntektskategori: {
          navn: 'Frilans',
        },
        arbeidsforhold: {
          startdato: '2018-01-01',
          opphoersdato: '2018-06-01',
        },
        andelsnr: 1,
        arbeidsforholdType: {
          navn: 'Frilans',
        },
      },
    };
    const values = {};
    values[lonnsendringField] = true;
    values[erNyoppstartetFLField] = true;
    values[createInputfieldKeyAT(forholdMedLonnsendringUtenIM.arbeidsforhold)] = '10 000';
    values[createInputfieldKeyFL()] = '20 000';
    const transformedValues = transformValuesFaktaForATFLOgSN.resultFunc(aktivePaneler, [], undefined, faktaOmBeregning, {})(values);
    expect(transformedValues.faktaOmBeregningTilfeller).to.have.length(4);
    expect(transformedValues.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.VURDER_LONNSENDRING)).is.eql(true);
    expect(transformedValues.faktaOmBeregningTilfeller
      .includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING)).is.eql(true);
    expect(transformedValues.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL)).is.eql(true);
    expect(transformedValues.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL)).is.eql(true);
    expect(transformedValues.fastsattUtenInntektsmelding.andelListe).to.have.length(1);
    expect(transformedValues.fastsattUtenInntektsmelding.andelListe[0].andelsnr).to.eql(2);
    expect(transformedValues.fastsattUtenInntektsmelding.andelListe[0].arbeidsinntekt).to.eql(10000);
    expect(transformedValues.fastsettMaanedsinntektFL.maanedsinntekt).to.eql(20000);
  });


  it('skal transform values for kun ytelse om kun ytelse, endret beregningsgrunnlag, atfl i samme org og besteberegning', () => {
    const fatsettKunYtelseTransform = sinon.spy();
    const fatsettEndretBgTransform = sinon.spy();
    const fatsettATFLISammeOrgTransform = sinon.spy();
    const besteberegningTransform = sinon.spy();
    const aktivePaneler = [faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE, faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG,
      faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON, faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE];
    setInntektValues(aktivePaneler,
      fatsettKunYtelseTransform,
      fatsettEndretBgTransform,
      fatsettATFLISammeOrgTransform,
      besteberegningTransform)({});
    expect(fatsettKunYtelseTransform).to.have.property('callCount', 1);
    expect(fatsettEndretBgTransform).to.have.property('callCount', 0);
    expect(fatsettATFLISammeOrgTransform).to.have.property('callCount', 0);
    expect(besteberegningTransform).to.have.property('callCount', 0);
  });

  it('skal transform values for endret beregningsgrunnlag om endret beregningsgrunnlag, atfl i samme org og besteberegning', () => {
    const fatsettKunYtelseTransform = sinon.spy();
    const fatsettEndretBgTransform = sinon.spy();
    const fatsettATFLISammeOrgTransform = sinon.spy();
    const besteberegningTransform = sinon.spy();
    const aktivePaneler = [faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG,
      faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON, faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE];
    setInntektValues(aktivePaneler,
      fatsettKunYtelseTransform,
      fatsettEndretBgTransform,
      fatsettATFLISammeOrgTransform,
      besteberegningTransform)({});
    expect(fatsettKunYtelseTransform).to.have.property('callCount', 0);
    expect(fatsettEndretBgTransform).to.have.property('callCount', 1);
    expect(fatsettATFLISammeOrgTransform).to.have.property('callCount', 0);
    expect(besteberegningTransform).to.have.property('callCount', 0);
  });

  it('skal transform values for atfl samm org om atfl i samme org og besteberegning', () => {
    const fatsettKunYtelseTransform = sinon.spy();
    const fatsettEndretBgTransform = sinon.spy();
    const fatsettATFLISammeOrgTransform = sinon.spy();
    const besteberegningTransform = sinon.spy();
    const aktivePaneler = [faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON,
      faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE];
    setInntektValues(aktivePaneler,
      fatsettKunYtelseTransform,
      fatsettEndretBgTransform,
      fatsettATFLISammeOrgTransform,
      besteberegningTransform)({});
    expect(fatsettKunYtelseTransform).to.have.property('callCount', 0);
    expect(fatsettEndretBgTransform).to.have.property('callCount', 0);
    expect(fatsettATFLISammeOrgTransform).to.have.property('callCount', 1);
    expect(besteberegningTransform).to.have.property('callCount', 0);
  });

  it('skal transform values for besteberegning om besteberegning', () => {
    const fatsettKunYtelseTransform = sinon.spy();
    const fatsettEndretBgTransform = sinon.spy();
    const fatsettATFLISammeOrgTransform = sinon.spy();
    const besteberegningTransform = sinon.spy();
    const aktivePaneler = [faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE];
    setInntektValues(aktivePaneler,
      fatsettKunYtelseTransform,
      fatsettEndretBgTransform,
      fatsettATFLISammeOrgTransform,
      besteberegningTransform)({});
    expect(fatsettKunYtelseTransform).to.have.property('callCount', 0);
    expect(fatsettEndretBgTransform).to.have.property('callCount', 0);
    expect(fatsettATFLISammeOrgTransform).to.have.property('callCount', 0);
    expect(besteberegningTransform).to.have.property('callCount', 1);
  });


  it('skal transform values for nyIArbeidslivet om kun ny i arbeidslivet', () => {
    const nyIArbTransform = sinon.spy();
    const kortvarigTransform = sinon.spy();
    const nyoppstartetTransform = sinon.spy();
    const lonnsendringTransform = sinon.spy();
    const etterlonnTransform = sinon.spy();
    const mottarYtelseTransform = sinon.spy();

    const aktivePaneler = [faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET];
    transformValues(aktivePaneler,
      nyIArbTransform,
      kortvarigTransform,
      nyoppstartetTransform,
      lonnsendringTransform,
      etterlonnTransform,
      mottarYtelseTransform)({}, {});
    expect(nyIArbTransform).to.have.property('callCount', 1);
    expect(kortvarigTransform).to.have.property('callCount', 0);
    expect(nyoppstartetTransform).to.have.property('callCount', 0);
    expect(lonnsendringTransform).to.have.property('callCount', 0);
    expect(etterlonnTransform).to.have.property('callCount', 0);
    expect(mottarYtelseTransform).to.have.property('callCount', 0);
  });

  it('skal transform values for nyIArbeidslivet og kortvarig om kun ny i arbeidslivet og kortvarig', () => {
    const nyIArbTransform = sinon.spy();
    const kortvarigTransform = sinon.spy();
    const nyoppstartetTransform = sinon.spy();
    const lonnsendringTransform = sinon.spy();
    const etterlonnTransform = sinon.spy();
    const mottarYtelseTransform = sinon.spy();

    const aktivePaneler = [faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET, faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD];
    transformValues(aktivePaneler,
      nyIArbTransform,
      kortvarigTransform,
      nyoppstartetTransform,
      lonnsendringTransform,
      etterlonnTransform,
      mottarYtelseTransform)({}, {});
    expect(nyIArbTransform).to.have.property('callCount', 1);
    expect(kortvarigTransform).to.have.property('callCount', 1);
    expect(nyoppstartetTransform).to.have.property('callCount', 0);
    expect(lonnsendringTransform).to.have.property('callCount', 0);
    expect(etterlonnTransform).to.have.property('callCount', 0);
    expect(mottarYtelseTransform).to.have.property('callCount', 0);
  });

  it('skal transform values for nyIArbeidslivet, kortvarig og nyoppstartet', () => {
    const nyIArbTransform = sinon.spy();
    const kortvarigTransform = sinon.spy();
    const nyoppstartetTransform = sinon.spy();
    const lonnsendringTransform = sinon.spy();
    const etterlonnTransform = sinon.spy();
    const mottarYtelseTransform = sinon.spy();

    const aktivePaneler = [faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET,
      faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD,
      faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    transformValues(aktivePaneler,
      nyIArbTransform,
      kortvarigTransform,
      nyoppstartetTransform,
      lonnsendringTransform,
      etterlonnTransform,
      mottarYtelseTransform)({}, {});
    expect(nyIArbTransform).to.have.property('callCount', 1);
    expect(kortvarigTransform).to.have.property('callCount', 1);
    expect(nyoppstartetTransform).to.have.property('callCount', 1);
    expect(lonnsendringTransform).to.have.property('callCount', 0);
    expect(etterlonnTransform).to.have.property('callCount', 0);
    expect(mottarYtelseTransform).to.have.property('callCount', 0);
  });

  it('skal transform values for nyIArbeidslivet, kortvarig, nyoppstartet og lønnsendring', () => {
    const nyIArbTransform = sinon.spy();
    const kortvarigTransform = sinon.spy();
    const nyoppstartetTransform = sinon.spy();
    const lonnsendringTransform = sinon.spy();
    const etterlonnTransform = sinon.spy();
    const mottarYtelseTransform = sinon.spy();

    const aktivePaneler = [faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET,
      faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD,
      faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL,
      faktaOmBeregningTilfelle.VURDER_LONNSENDRING];
    transformValues(aktivePaneler,
      nyIArbTransform,
      kortvarigTransform,
      nyoppstartetTransform,
      lonnsendringTransform,
      etterlonnTransform,
      mottarYtelseTransform)({}, {});
    expect(nyIArbTransform).to.have.property('callCount', 1);
    expect(kortvarigTransform).to.have.property('callCount', 1);
    expect(nyoppstartetTransform).to.have.property('callCount', 1);
    expect(lonnsendringTransform).to.have.property('callCount', 1);
    expect(etterlonnTransform).to.have.property('callCount', 0);
    expect(mottarYtelseTransform).to.have.property('callCount', 0);
  });

  it('skal transform values for nyIArbeidslivet, kortvarig, nyoppstartet, lønnsendring og etterlønn', () => {
    const nyIArbTransform = sinon.spy();
    const kortvarigTransform = sinon.spy();
    const nyoppstartetTransform = sinon.spy();
    const lonnsendringTransform = sinon.spy();
    const etterlonnTransform = sinon.spy();
    const mottarYtelseTransform = sinon.spy();

    const aktivePaneler = [faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET,
      faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD,
      faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL,
      faktaOmBeregningTilfelle.VURDER_LONNSENDRING,
      faktaOmBeregningTilfelle.VURDER_ETTERLONN_SLUTTPAKKE];
    transformValues(aktivePaneler,
      nyIArbTransform,
      kortvarigTransform,
      nyoppstartetTransform,
      lonnsendringTransform,
      etterlonnTransform,
      mottarYtelseTransform)({}, {});
    expect(nyIArbTransform).to.have.property('callCount', 1);
    expect(kortvarigTransform).to.have.property('callCount', 1);
    expect(nyoppstartetTransform).to.have.property('callCount', 1);
    expect(lonnsendringTransform).to.have.property('callCount', 1);
    expect(etterlonnTransform).to.have.property('callCount', 1);
    expect(mottarYtelseTransform).to.have.property('callCount', 0);
  });

  it('skal transform values for nyIArbeidslivet, kortvarig, nyoppstartet, lønnsendring, etterlønn og mottar ytelse', () => {
    const nyIArbTransform = sinon.spy();
    const kortvarigTransform = sinon.spy();
    const nyoppstartetTransform = sinon.spy();
    const lonnsendringTransform = sinon.spy();
    const etterlonnTransform = sinon.spy();
    const mottarYtelseTransform = sinon.spy();

    const aktivePaneler = [faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET,
      faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD,
      faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL,
      faktaOmBeregningTilfelle.VURDER_LONNSENDRING,
      faktaOmBeregningTilfelle.VURDER_ETTERLONN_SLUTTPAKKE,
      faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE];
    transformValues(aktivePaneler,
      nyIArbTransform,
      kortvarigTransform,
      nyoppstartetTransform,
      lonnsendringTransform,
      etterlonnTransform,
      mottarYtelseTransform)({}, {});
    expect(nyIArbTransform).to.have.property('callCount', 1);
    expect(kortvarigTransform).to.have.property('callCount', 1);
    expect(nyoppstartetTransform).to.have.property('callCount', 1);
    expect(lonnsendringTransform).to.have.property('callCount', 1);
    expect(etterlonnTransform).to.have.property('callCount', 1);
    expect(mottarYtelseTransform).to.have.property('callCount', 1);
  });
});