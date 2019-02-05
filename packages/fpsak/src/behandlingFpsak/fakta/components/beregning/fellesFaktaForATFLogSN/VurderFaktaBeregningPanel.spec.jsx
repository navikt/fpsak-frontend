import { expect } from 'chai';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  buildInitialValuesVurderFaktaBeregning, getValidationVurderFaktaBeregning, transformValuesVurderFaktaBeregning,
  VURDER_FAKTA_BEREGNING_FORM_NAME,
} from './VurderFaktaBeregningPanel';
import { lagStateMedAksjonspunkterOgFaktaOmBeregning } from '../BeregningTestHelper';


const {
  AVKLAR_AKTIVITETER,
  VURDER_FAKTA_FOR_ATFL_SN,
} = aksjonspunktCodes;


const avklarAktiviteterAp = {
  id: 1,
  definisjon: {
    kode: AVKLAR_AKTIVITETER,
    navn: 'ap1',
  },
  status: {
    kode: aksjonspunktStatus.OPPRETTET,
    navn: 's1',
  },
  toTrinnsBehandling: true,
  toTrinnsBehandlingGodkjent: false,
  kanLoses: true,
  erAktivt: true,
};

const aksjonspunkter = [{
  definisjon:
  { kode: VURDER_FAKTA_FOR_ATFL_SN },
}];

describe('<VurderFaktaBeregningPanel>', () => {
  it('skal ikkje bygge initial values', () => {
    const initialValuesFelles = () => ({ test: 'test' });
    const initialValues = buildInitialValuesVurderFaktaBeregning.resultFunc([avklarAktiviteterAp], initialValuesFelles);
    expect(initialValues).to.be.empty;
  });

  it('skal bygge initial values', () => {
    const initialValuesFelles = () => ({ test: 'test' });
    const initialValues = buildInitialValuesVurderFaktaBeregning.resultFunc(aksjonspunkter, initialValuesFelles);
    expect(initialValues[VURDER_FAKTA_BEREGNING_FORM_NAME].test).to.equal('test');
  });

  it('skal ikkje kalle buildInitialValues uten aksjonspunkt', () => {
    const faktaOmBeregning = {
      avklarAktiviteter: {
        ventelonnVartpenger: {
          inkludert: null,
        },
      },
    };
    const state = lagStateMedAksjonspunkterOgFaktaOmBeregning([avklarAktiviteterAp], faktaOmBeregning);
    const initialValues = buildInitialValuesVurderFaktaBeregning(state);
    expect(initialValues).to.be.empty;
  });

  it('skal ikkje validere om man ikkje har aksjonspunkt', () => {
    const validate = () => ('validate');
    const validation = getValidationVurderFaktaBeregning.resultFunc([], validate)(undefined);
    expect(validation).to.equal(null);
  });

  it('skal validere om man har aksjonspunkt', () => {
    const validate = () => ({ test: 'validate' });
    const values = {};
    values[VURDER_FAKTA_BEREGNING_FORM_NAME] = {};
    const validation = getValidationVurderFaktaBeregning.resultFunc(aksjonspunkter, validate)(values);
    expect(validation[VURDER_FAKTA_BEREGNING_FORM_NAME].test).to.equal('validate');
  });

  it('skal ikkje transformValues uten aksjonspunkt', () => {
    const faktaOmBeregning = {
      avklarAktiviteter: {
        ventelonnVartpenger: {
          inkludert: null,
        },
      },
    };
    const values = {};
    const state = lagStateMedAksjonspunkterOgFaktaOmBeregning([avklarAktiviteterAp], faktaOmBeregning, VURDER_FAKTA_BEREGNING_FORM_NAME, values);
    const transformed = transformValuesVurderFaktaBeregning(state)(values);
    expect(transformed).to.be.empty;
  });


  it('skal transformValues med aksjonspunkt', () => {
    const transformValues = () => ({ test: 'test' });
    const values = {};
    values[VURDER_FAKTA_BEREGNING_FORM_NAME] = { begrunnelse: 'begrunnelse' };
    const transformed = transformValuesVurderFaktaBeregning.resultFunc(aksjonspunkter, transformValues)(values);
    expect(transformed[0].begrunnelse).to.equal('begrunnelse');
    expect(transformed[0].kode).to.equal(VURDER_FAKTA_FOR_ATFL_SN);
    expect(transformed[0].test).to.equal('test');
  });
});
