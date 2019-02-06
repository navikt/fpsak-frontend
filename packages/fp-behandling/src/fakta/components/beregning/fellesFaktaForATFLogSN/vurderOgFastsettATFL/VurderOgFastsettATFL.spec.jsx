import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import VurderOgFastsettATFL, { skalViseInntektsTabellUnderRadioknapp, skalViseInntektstabell } from './VurderOgFastsettATFL';
import LonnsendringForm, { lonnsendringField } from './forms/LonnsendringForm';
import NyoppstartetFLForm, { erNyoppstartetFLField } from './forms/NyoppstartetFLForm';
import FastsettATFLInntektForm from './forms/FastsettATFLInntektForm';
import InntektstabellPanel from '../InntektstabellPanel';
import { finnFrilansFieldName, utledArbeidsforholdFieldName } from './forms/VurderMottarYtelseUtils';

const showTableCallback = sinon.spy();

const atUtenIM = { arbeidstakerAndelerUtenIM: [{ andelsnr: 1, mottarYtelse: undefined, inntektPrMnd: 10000 }] };
const frilanser = {
  erFrilans: true,
  frilansMottarYtelse: null,
  frilansInntektPrMnd: 10000,
};


const lagWrapper = (tilfeller, erLonnsendring, erNyoppstartetFL, values, faktaOmBeregning) => (shallow(<VurderOgFastsettATFL.WrappedComponent
  readOnly={false}
  isAksjonspunktClosed={false}
  tilfeller={tilfeller}
  manglerInntektsmelding={false}
  showTableCallback={showTableCallback}
  erLonnsendring={erLonnsendring}
  erNyoppstartetFL={erNyoppstartetFL}
  skalViseTabell={skalViseInntektstabell(tilfeller, values, faktaOmBeregning)}
/>));

const assertInntektstabell = (wrapper, skalViseTabell) => {
  const inntektstabellPanel = wrapper.find(InntektstabellPanel);
  expect(inntektstabellPanel).to.have.length(1);
  expect(inntektstabellPanel.prop('skalViseTabell')).to.equal(skalViseTabell);
};

const assertFormNyoppstartetFL = (wrapper, skalViseTabellUnderKnapp, skalKunFastsetteFL) => {
  const formWrapper = wrapper.find(NyoppstartetFLForm);
  expect(formWrapper.prop('skalViseInntektstabell')).to.eql(skalViseTabellUnderKnapp);
  if (skalViseTabellUnderKnapp) {
    expect(formWrapper.prop('skalKunFastsetteFL')).to.eql(skalKunFastsetteFL);
  }
};

const assertFormLonnsendring = (wrapper, skalViseTabellUnderKnapp, skalKunFastsetteAT) => {
  const formWrapper = wrapper.find(LonnsendringForm);
  expect(formWrapper.prop('skalViseInntektstabell')).to.eql(skalViseTabellUnderKnapp);
  if (skalViseTabellUnderKnapp) {
    expect(formWrapper.prop('skalKunFastsetteAT')).to.eql(skalKunFastsetteAT);
  }
};

describe('<VurderOgFastsettATFL>', () => {
  it('Skal vise inntekttabell under radioknapp for lønnsendring uten atfl i samme org og uten nyoppstartet fl', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING];
    const erLonnsendring = true;
    const skalViseTabellUnderRadio = skalViseInntektsTabellUnderRadioknapp(tilfeller, erLonnsendring);
    expect(skalViseTabellUnderRadio).to.equal(true);
  });

  it('Skal ikkje vise inntekttabell under radioknapp for ikkje lønnsendring uten atfl i samme org og uten nyoppstartet fl', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING];
    const erLonnsendring = false;
    const skalViseTabellUnderRadio = skalViseInntektsTabellUnderRadioknapp(tilfeller, erLonnsendring);
    expect(skalViseTabellUnderRadio).to.equal(false);
  });

  it('Skal vise inntekttabell under radioknapp for lønnsendring med atfl i samme org og uten nyoppstartet fl', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING, faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON];
    const erLonnsendring = true;
    const skalViseTabellUnderRadio = skalViseInntektsTabellUnderRadioknapp(tilfeller, erLonnsendring);
    expect(skalViseTabellUnderRadio).to.equal(true);
  });

  it('Skal vise inntekttabell under radioknapp for ikkje lønnsendring med atfl i samme org og uten nyoppstartet fl', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING, faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON];
    const erLonnsendring = false;
    const skalViseTabellUnderRadio = skalViseInntektsTabellUnderRadioknapp(tilfeller, erLonnsendring);
    expect(skalViseTabellUnderRadio).to.equal(true);
  });

  it('Skal vise inntekttabell under radioknapp for nyoppstartet FL uten atfl i samme org og uten lønnsendring', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const erNyoppstartetFL = true;
    const skalViseTabellUnderRadio = skalViseInntektsTabellUnderRadioknapp(tilfeller, erNyoppstartetFL);
    expect(skalViseTabellUnderRadio).to.equal(true);
  });

  it('Skal ikkje vise inntekttabell under radioknapp for ikkje nyoppstartet FL uten atfl i samme org og uten lønnsendring', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const erNyoppstartetFL = false;
    const skalViseTabellUnderRadio = skalViseInntektsTabellUnderRadioknapp(tilfeller, erNyoppstartetFL);
    expect(skalViseTabellUnderRadio).to.equal(false);
  });

  it('Skal vise inntekttabell under radioknapp for nyoppstartet FL med atfl i samme org og uten lønnsendring', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON];
    const erNyoppstartetFL = true;
    const skalViseTabellUnderRadio = skalViseInntektsTabellUnderRadioknapp(tilfeller, erNyoppstartetFL);
    expect(skalViseTabellUnderRadio).to.equal(true);
  });

  it('Skal vise inntekttabell under radioknapp for ikkje nyoppstartet FL med atfl i samme org og uten lønnsendring', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON];
    const erNyoppstartetFL = false;
    const skalViseTabellUnderRadio = skalViseInntektsTabellUnderRadioknapp(tilfeller, erNyoppstartetFL);
    expect(skalViseTabellUnderRadio).to.equal(true);
  });


  it('Skal vise inntekttabell under radioknapp for lonnsendring med nyoppstartet FL og omvendt', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.VURDER_LONNSENDRING];
    const skalViseTabellUnderRadio = skalViseInntektsTabellUnderRadioknapp(tilfeller, true);
    expect(skalViseTabellUnderRadio).to.equal(true);
  });

  it('Skal ikkje vise inntekttabell under radioknapp for ikkje lonnsendring med nyoppstartet FL og omvendt', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.VURDER_LONNSENDRING];
    const skalViseTabellUnderRadio = skalViseInntektsTabellUnderRadioknapp(tilfeller, false);
    expect(skalViseTabellUnderRadio).to.equal(false);
  });

  it('Skal vise kun LonnsendringForm', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING];
    const wrapper = lagWrapper(tilfeller, undefined, undefined);
    const lonnsendringForm = wrapper.find(LonnsendringForm);
    expect(lonnsendringForm).to.have.length(1);
    const flForm = wrapper.find(NyoppstartetFLForm);
    expect(flForm).to.have.length(0);
    const fastsettATFLInntektForm = wrapper.find(FastsettATFLInntektForm);
    expect(fastsettATFLInntektForm).to.have.length(0);
    assertInntektstabell(wrapper, false);
  });
  it('Skal vise kun Lønnsendringsformen', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const wrapper = lagWrapper(tilfeller, undefined, undefined);
    const lonnsendringForm = wrapper.find(LonnsendringForm);
    expect(lonnsendringForm).to.have.length(0);
    const flForm = wrapper.find(NyoppstartetFLForm);
    expect(flForm).to.have.length(1);
    assertInntektstabell(wrapper, false);
  });

  it('Skal vise LonnsendringForm, NyoppstartetFLForm i Inntektstabell', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING, faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const wrapper = lagWrapper(tilfeller, undefined, undefined);
    const lonnsendringForm = wrapper.find(LonnsendringForm);
    expect(lonnsendringForm).to.have.length(1);
    const flForm = wrapper.find(NyoppstartetFLForm);
    expect(flForm).to.have.length(1);
    assertInntektstabell(wrapper, false);
  });

  it('Skal vise LonnsendringForm, NyoppstartetFLForm og FastsettATFLInntektForm i Inntektstabell', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING, faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL,
      faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON];
    const wrapper = lagWrapper(tilfeller, undefined, undefined);
    assertFormLonnsendring(wrapper, false, false);
    assertFormNyoppstartetFL(wrapper, false, false);
    assertInntektstabell(wrapper, true);
  });

  it('Skal teste at underkomponenter mottar prop for å vise tabell dersom det er fastsatt lønnsendring og ikkje nyoppstartet FL', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING, faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const wrapper = lagWrapper(tilfeller, true, false);
    assertFormLonnsendring(wrapper, true, true);
    assertFormNyoppstartetFL(wrapper, false, true);
    assertInntektstabell(wrapper, false);
  });

  it('Skal teste at underkomponenter mottar prop for å vise tabell dersom det er fastsatt ikkje lønnsendring og nyoppstartet FL', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING, faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const wrapper = lagWrapper(tilfeller, false, true);
    assertFormLonnsendring(wrapper, false, true);
    assertFormNyoppstartetFL(wrapper, true, true);
    assertInntektstabell(wrapper, false);
  });

  it('Skal teste at underkomponenter mottar prop for å vise tabell dersom det er ikkje fastsatt lønnsendring og ikkje nyoppstartet FL', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING, faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const wrapper = lagWrapper(tilfeller, false, false);
    assertFormLonnsendring(wrapper, false, true);
    assertFormNyoppstartetFL(wrapper, false, true);
    assertInntektstabell(wrapper, false);
  });

  it('Skal teste at underkomponenter mottar prop for å vise tabell dersom det er fastsatt lønnsendring og nyoppstartet FL', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING, faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const wrapper = lagWrapper(tilfeller, true, true);
    assertFormLonnsendring(wrapper, true, true);
    assertFormNyoppstartetFL(wrapper, true, true);
    assertInntektstabell(wrapper, false);
  });


  it('Skal teste at underkomponenter mottar prop for å vise tabell dersom det er fastsatt lønnsendring og atfl i samme org', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING, faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON];
    const wrapper = lagWrapper(tilfeller, true, undefined);
    assertFormLonnsendring(wrapper, true, false);
    assertInntektstabell(wrapper, false);
  });

  it('Skal teste at underkomponenter mottar prop for å vise tabell dersom det er fastsatt ikkje lønnsendring og atfl i samme org', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING, faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON];
    const wrapper = lagWrapper(tilfeller, false, undefined);
    assertFormLonnsendring(wrapper, true, false);
    assertInntektstabell(wrapper, false);
  });

  it('Skal teste at underkomponenter mottar prop for å vise tabell dersom det er fastsatt nyoppstartet fl og atfl i samme org', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON];
    const wrapper = lagWrapper(tilfeller, undefined, true);
    assertFormNyoppstartetFL(wrapper, true, false);
    assertInntektstabell(wrapper, false);
  });

  it('Skal teste at underkomponenter mottar prop for å vise tabell dersom det er fastsatt ikkje nyoppstartet fl og atfl i samme org', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON];
    const wrapper = lagWrapper(tilfeller, undefined, false);
    assertFormNyoppstartetFL(wrapper, true, false);
    assertInntektstabell(wrapper, false);
  });

  it('Skal teste at underkomponenter mottar prop for å vise tabell dersom det er fastsatt nyoppstartet fl, lonnsendring og er atfl i samme org', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.VURDER_LONNSENDRING,
      faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON];
    const wrapper = lagWrapper(tilfeller, true, true);
    assertFormNyoppstartetFL(wrapper, false, false);
    assertFormLonnsendring(wrapper, false, false);
    assertInntektstabell(wrapper, true);
  });

  it('Skal teste at underkomponenter mottar prop for å vise tabell dersom det er fastsatt ikkje nyoppstartet fl, lonnsendring og er atfl i samme org', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.VURDER_LONNSENDRING,
      faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON];
    const wrapper = lagWrapper(tilfeller, true, false);
    assertFormNyoppstartetFL(wrapper, false, false);
    assertFormLonnsendring(wrapper, false, false);
    assertInntektstabell(wrapper, true);
  });

  it('Skal teste at underkomponenter mottar prop for å vise tabell dersom det er fastsatt nyoppstartet fl, ikkje lonnsendring og er atfl i samme org', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.VURDER_LONNSENDRING,
      faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON];
    const wrapper = lagWrapper(tilfeller, false, true);
    assertFormNyoppstartetFL(wrapper, false, false);
    assertFormLonnsendring(wrapper, false, false);
    assertInntektstabell(wrapper, true);
  });

  it('Skal teste at underkomponenter mottar prop for å vise tabell dersom det er kun vurder mottar ytelse og verdi er satt', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE];
    const faktaOmBeregning = {
      vurderMottarYtelse: {
        ...frilanser,
        arbeidstakerAndelerUtenIM: [],
      },
    };
    const values = {};
    values[finnFrilansFieldName()] = true;
    const wrapper = lagWrapper(tilfeller, undefined, undefined, values, faktaOmBeregning);
    assertInntektstabell(wrapper, true);
  });

  it('Skal teste at underkomponenter mottar prop for å vise tabell dersom det er kun vurder mottar ytelse og verdi ikkje er satt', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE];
    const faktaOmBeregning = {
      vurderMottarYtelse: {
        erFrilans: false,
        ...atUtenIM,
      },
    };
    const values = {};
    values[utledArbeidsforholdFieldName(atUtenIM.arbeidstakerAndelerUtenIM[0])] = undefined;
    const wrapper = lagWrapper(tilfeller, undefined, undefined, values, faktaOmBeregning);
    assertInntektstabell(wrapper, false);
  });

  it('Skal teste at underkomponenter mottar prop for å vise tabell dersom det er mottar ytelse og fastsatt lønnsendring og verdier er satt', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE, faktaOmBeregningTilfelle.VURDER_LONNSENDRING];
    const faktaOmBeregning = {
      vurderMottarYtelse: {
        erFrilans: false,
        ...atUtenIM,
      },
    };
    const values = {};
    values[utledArbeidsforholdFieldName(atUtenIM.arbeidstakerAndelerUtenIM[0])] = true;
    values[lonnsendringField] = false;
    const wrapper = lagWrapper(tilfeller, true, undefined, values, faktaOmBeregning);
    assertFormLonnsendring(wrapper, false, false);
    assertInntektstabell(wrapper, true);
  });

  it('Skal teste at underkomponenter mottar prop for å vise tabell dersom det er mottar ytelse'
  + 'og fastsatt lønnsendring og minst ein verdi ikkje er satt', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE, faktaOmBeregningTilfelle.VURDER_LONNSENDRING];
    const faktaOmBeregning = {
      vurderMottarYtelse: {
        ...frilanser,
        ...atUtenIM,
      },
    };
    const values = {};
    values[finnFrilansFieldName()] = undefined;
    values[utledArbeidsforholdFieldName(atUtenIM.arbeidstakerAndelerUtenIM[0])] = true;
    values[lonnsendringField] = true;
    const wrapper = lagWrapper(tilfeller, true, undefined, values, faktaOmBeregning);
    assertFormLonnsendring(wrapper, false, false);
    assertInntektstabell(wrapper, false);
  });

  it('Skal teste at underkomponenter mottar prop for å vise tabell dersom det er mottar ytelse og ikkje fastsatt lønnsendring', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE, faktaOmBeregningTilfelle.VURDER_LONNSENDRING];
    const faktaOmBeregning = {
      vurderMottarYtelse: {
        ...frilanser,
        ...atUtenIM,
      },
    };
    const values = {};
    values[finnFrilansFieldName()] = false;
    values[utledArbeidsforholdFieldName(atUtenIM.arbeidstakerAndelerUtenIM[0])] = true;
    values[lonnsendringField] = false;
    const wrapper = lagWrapper(tilfeller, false, undefined, values, faktaOmBeregning);
    assertFormLonnsendring(wrapper, false, false);
    assertInntektstabell(wrapper, true);
  });

  it('Skal teste at underkomponenter mottar prop for å vise tabell dersom det er mottar ytelse og fastsatt nyoppstartet frilans', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE, faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const faktaOmBeregning = {
      vurderMottarYtelse: {
        ...frilanser,
        ...atUtenIM,
      },
    };
    const values = {};
    values[finnFrilansFieldName()] = false;
    values[utledArbeidsforholdFieldName(atUtenIM.arbeidstakerAndelerUtenIM[0])] = true;
    values[erNyoppstartetFLField] = false;
    const wrapper = lagWrapper(tilfeller, undefined, true, values, faktaOmBeregning);
    assertFormNyoppstartetFL(wrapper, false, false);
    assertInntektstabell(wrapper, true);
  });

  it('Skal teste at underkomponenter mottar prop for å vise tabell dersom det er mottar ytelse og ikkje fastsatt nyoppstartet frilans', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE, faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const faktaOmBeregning = {
      vurderMottarYtelse: {
        ...frilanser,
        ...atUtenIM,
      },
    };
    const values = {};
    values[finnFrilansFieldName()] = false;
    values[utledArbeidsforholdFieldName(atUtenIM.arbeidstakerAndelerUtenIM[0])] = true;
    values[erNyoppstartetFLField] = false;
    const wrapper = lagWrapper(tilfeller, undefined, false, values, faktaOmBeregning);
    assertFormNyoppstartetFL(wrapper, false, false);
    assertInntektstabell(wrapper, true);
  });

  it('Skal teste at underkomponenter mottar prop for å vise tabell dersom det er mottar ytelse og ikkje fastsatt nyoppstartet frilans'
  + ' og vurder mottar ytelse ikkje er fastsatt', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE, faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const faktaOmBeregning = {
      vurderMottarYtelse: {
        ...frilanser,
        ...atUtenIM,
      },
    };
    const values = {};
    values[finnFrilansFieldName()] = undefined;
    values[utledArbeidsforholdFieldName(atUtenIM.arbeidstakerAndelerUtenIM[0])] = true;
    values[erNyoppstartetFLField] = false;
    const wrapper = lagWrapper(tilfeller, undefined, false, values, faktaOmBeregning);
    assertFormNyoppstartetFL(wrapper, false, false);
    assertInntektstabell(wrapper, false);
  });
});
