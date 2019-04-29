import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { lagStateMedAksjonspunkterOgBeregningsgrunnlag } from '@fpsak-frontend/utils-test/src/beregning-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import { getBehandlingFormValues } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import {
  AvklareAktiviteterPanelImpl, buildInitialValuesAvklarAktiviteter,
  transformValuesAvklarAktiviteter, erAvklartAktivitetEndret, BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME,
} from './AvklareAktiviteterPanel';
import VurderAktiviteterPanel from './VurderAktiviteterPanel';
import { formNameAvklarAktiviteter } from '../BeregningFormUtils';

const {
  AVKLAR_AKTIVITETER,
  VURDER_FAKTA_FOR_ATFL_SN,
} = aksjonspunktCodes;


const lagStateMedAvklarAktitiveter = (avklarAktiviteter, values = {}, initial = {}, aksjonspunkter = [{ definisjon: { kode: AVKLAR_AKTIVITETER } }]) => {
  const faktaOmBeregning = {
    avklarAktiviteter,
  };
  return lagStateMedAksjonspunkterOgBeregningsgrunnlag(aksjonspunkter, { faktaOmBeregning }, formNameAvklarAktiviteter, values, initial);
};

const aktivitet1 = {
  arbeidsgiverNavn: 'Arbeidsgiveren',
  arbeidsgiverId: '384723894723',
  fom: '2019-01-01',
  tom: null,
  skalBrukes: null,
  arbeidsforholdType: { kode: 'ARBEID', navn: 'Arbeid' },
};

const aktivitet2 = {
  arbeidsgiverNavn: 'Arbeidsgiveren2',
  arbeidsgiverId: '334534623342',
  arbeidsforholdId: 'efj8343f34f',
  fom: '2019-01-01',
  tom: '2019-02-02',
  skalBrukes: true,
  arbeidsforholdType: { kode: 'ARBEID', navn: 'Arbeid' },
};

const aktivitet3 = {
  arbeidsgiverNavn: 'Arbeidsgiveren3',
  aktørId: { aktørId: '324234234234' },
  arbeidsgiverId: '1960-01-01',
  arbeidsforholdId: 'efj8343f34f',
  fom: '2019-01-01',
  tom: '2019-02-02',
  skalBrukes: false,
  arbeidsforholdType: { kode: 'ARBEID', navn: 'Arbeid' },
};


const aktivitetAAP = {
  arbeidsgiverNavn: null,
  arbeidsgiverId: null,
  arbeidsforholdType: { kode: 'AAP', navn: 'Arbeidsavklaringspenger' },
  fom: '2019-01-01',
  tom: '2020-02-02',
  skalBrukes: null,
};

const aktiviteter = [
  aktivitet1,
  aktivitet2,
  aktivitet3,
  aktivitetAAP,
];

const id1 = '3847238947232019-01-01';
const id2 = '334534623342efj8343f34f2019-01-01';
const id3 = '1960-01-01efj8343f34f2019-01-01';
const idAAP = 'AAP2019-01-01';

describe('<AvklareAktiviteterPanel>', () => {
  it('skal vise VurderAktiviteterPanel panel', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [
          { tom: '2019-02-02', aktiviteter },
        ],
    };
    const wrapper = shallow(<AvklareAktiviteterPanelImpl
      {...reduxFormPropsMock}
      readOnly={false}
      isAksjonspunktClosed={false}
      avklarAktiviteter={avklarAktiviteter}
      hasBegrunnelse={false}
      submittable
      isDirty
      submitEnabled
      helpText={[]}
      harAndreAksjonspunkterIPanel={false}
      erEndret={false}
    />);
    const vurderAktivitetPanel = wrapper.find(VurderAktiviteterPanel);
    expect(vurderAktivitetPanel).has.length(1);
  });

  it('skal ikkje vise VurderAktiviteterPanel panel', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: null,
    };
    const wrapper = shallow(<AvklareAktiviteterPanelImpl
      {...reduxFormPropsMock}
      readOnly={false}
      isAksjonspunktClosed={false}
      avklarAktiviteter={avklarAktiviteter}
      hasBegrunnelse={false}
      submittable
      isDirty
      submitEnabled
      helpText={[]}
      harAndreAksjonspunkterIPanel={false}
      erEndret={false}
    />);
    const radio = wrapper.find(VurderAktiviteterPanel);
    expect(radio).has.length(0);
  });

  it('skal teste at initial values blir bygget', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [
          { tom: '2019-02-02', aktiviteter },
        ],
    };

    const initialValues = buildInitialValuesAvklarAktiviteter(lagStateMedAvklarAktitiveter(avklarAktiviteter));
    expect(initialValues !== null).to.equal(true);
  });

  it('skal transform values for avklar aktiviteter', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [
          { tom: '2019-02-02', aktiviteter },
        ],
    };
    const values = {};
    values[id1] = { skalBrukes: false };
    values[id2] = { skalBrukes: true };
    values[id3] = { skalBrukes: true };
    values[idAAP] = { skalBrukes: true };

    const state = lagStateMedAvklarAktitiveter(avklarAktiviteter, values);
    const transformed = transformValuesAvklarAktiviteter(state)(getBehandlingFormValues(formNameAvklarAktiviteter)(state));

    expect(transformed[0].beregningsaktivitetLagreDtoList.length).to.equal(1);
    expect(transformed[0].beregningsaktivitetLagreDtoList[0].oppdragsgiverOrg).to.equal(aktivitet1.arbeidsgiverId);
  });


  it('skal ikkje transform values om to aksjonspunkter og ingen endring', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [
          { tom: '2019-02-02', aktiviteter },
        ],
    };
    const values = {};
    values[id1] = { skalBrukes: null };
    values[id2] = { skalBrukes: true };
    values[id3] = { skalBrukes: false };
    values[idAAP] = { skalBrukes: null };
    const aps = [
      { definisjon: { kode: AVKLAR_AKTIVITETER } },
      { definisjon: { kode: VURDER_FAKTA_FOR_ATFL_SN } }];
    const state = lagStateMedAvklarAktitiveter(avklarAktiviteter, values, values, aps);
    const transformed = transformValuesAvklarAktiviteter(state)(getBehandlingFormValues(formNameAvklarAktiviteter)(state));
    expect(transformed).to.equal(null);
  });

  it('skal transform values om kun avklar aksjonspunkt og ingen endring', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [
          { tom: '2019-02-02', aktiviteter },
        ],
    };
    const values = {};
    values[id1] = { skalBrukes: null };
    values[id2] = { skalBrukes: true };
    values[id3] = { skalBrukes: false };
    values[idAAP] = { skalBrukes: null };
    values[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] = 'begrunnelse';
    const aps = [
      { definisjon: { kode: AVKLAR_AKTIVITETER } }];
    const state = lagStateMedAvklarAktitiveter(avklarAktiviteter, values, values, aps);
    const transformed = transformValuesAvklarAktiviteter(state)(getBehandlingFormValues(formNameAvklarAktiviteter)(state));
    expect(transformed[0].beregningsaktivitetLagreDtoList.length).to.equal(1);
    expect(transformed[0].beregningsaktivitetLagreDtoList[0].arbeidsgiverIdentifikator).to.equal(aktivitet3.aktørId.aktørId);
    expect(transformed[0].begrunnelse).to.equal('begrunnelse');
    expect(transformed[0].kode).to.equal(AVKLAR_AKTIVITETER);
});

it('skal transform values om to aksjonspunkter og med endring', () => {
  const avklarAktiviteter = {
    aktiviteterTomDatoMapping: [
        { tom: '2019-02-02', aktiviteter },
      ],
  };
  const values = {};
  values[id1] = { skalBrukes: true };
  values[id2] = { skalBrukes: true };
  values[id3] = { skalBrukes: false };
  values[idAAP] = { skalBrukes: null };
  const aps = [
    { definisjon: { kode: AVKLAR_AKTIVITETER } }];
  const initial = {};
  initial[id1] = { skalBrukes: null };
  initial[id2] = { skalBrukes: true };
  initial[id3] = { skalBrukes: false };
  initial[idAAP] = { skalBrukes: null };
  const state = lagStateMedAvklarAktitiveter(avklarAktiviteter, values, initial, aps);
  const transformed = transformValuesAvklarAktiviteter(state)(getBehandlingFormValues(formNameAvklarAktiviteter)(state));
  expect(transformed[0].beregningsaktivitetLagreDtoList.length).to.equal(1);
  expect(transformed[0].beregningsaktivitetLagreDtoList[0].arbeidsgiverIdentifikator).to.equal(aktivitet3.aktørId.aktørId);
});


  it('skal returnere true for endret begrunnelse', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [
          { tom: '2019-02-02', aktiviteter },
        ],
    };
    const values = {};
    values[id1] = { skalBrukes: null };
    values[id2] = { skalBrukes: true };
    values[id3] = { skalBrukes: false };
    values[idAAP] = { skalBrukes: null };
    values[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] = 'sefiojsiejfise';
    const initial = {};
    initial[id1] = { skalBrukes: null };
    initial[id2] = { skalBrukes: true };
    initial[id3] = { skalBrukes: false };
    initial[idAAP] = { skalBrukes: null };
    initial[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] = '53451221412412';
    const state = lagStateMedAvklarAktitiveter(avklarAktiviteter, values, initial);
    const erAvklartOgIkkeEndret = erAvklartAktivitetEndret(state);
    expect(erAvklartOgIkkeEndret).to.equal(true);
  });

  it('skal returnere true for ikkje endret begrunnelse og endret verdi', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [
          { tom: '2019-02-02', aktiviteter },
        ],
    };
    const values = {};
    values[id1] = { skalBrukes: null };
    values[id2] = { skalBrukes: false };
    values[id3] = { skalBrukes: false };
    values[idAAP] = { skalBrukes: null };
    values[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] = 'sefiojsiejfise';
    const initial = {};
    initial[id1] = { skalBrukes: null };
    initial[id2] = { skalBrukes: true };
    initial[id3] = { skalBrukes: false };
    initial[idAAP] = { skalBrukes: null };
    initial[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] = 'sefiojsiejfise';
    const state = lagStateMedAvklarAktitiveter(avklarAktiviteter, values, initial);
    const erAvklartOgIkkeEndret = erAvklartAktivitetEndret(state);
    expect(erAvklartOgIkkeEndret).to.equal(true);
  });


  it('skal returnere true for endret begrunnelse og endret verdi', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [
          { tom: '2019-02-02', aktiviteter },
        ],
    };
    const values = {};
    values[id1] = { skalBrukes: null };
    values[id2] = { skalBrukes: false };
    values[id3] = { skalBrukes: false };
    values[idAAP] = { skalBrukes: null };
    values[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] = 'sefiojsiejfise';
    const initial = {};
    initial[id1] = { skalBrukes: null };
    initial[id2] = { skalBrukes: true };
    initial[id3] = { skalBrukes: false };
    initial[idAAP] = { skalBrukes: null };
    initial[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] = '345346123112';
    const state = lagStateMedAvklarAktitiveter(avklarAktiviteter, values, initial);
    const erAvklartOgIkkeEndret = erAvklartAktivitetEndret(state);
    expect(erAvklartOgIkkeEndret).to.equal(true);
  });

  it('skal returnere false for ikkje endret begrunnelse og ikkje endret verdi', () => {
    const avklarAktiviteter = {
      aktiviteterTomDatoMapping: [
          { tom: '2019-02-02', aktiviteter },
        ],
    };
    const values = {};
    values[id1] = { skalBrukes: null };
    values[id2] = { skalBrukes: true };
    values[id3] = { skalBrukes: false };
    values[idAAP] = { skalBrukes: null };
    values[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] = 'sefiojsiejfise';
    const state = lagStateMedAvklarAktitiveter(avklarAktiviteter, values, values);
    const erAvklartOgIkkeEndret = erAvklartAktivitetEndret(state);
    expect(erAvklartOgIkkeEndret).to.equal(false);
  });
});
