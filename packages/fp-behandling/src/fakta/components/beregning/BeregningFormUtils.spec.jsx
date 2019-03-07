import { expect } from 'chai';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { lagStateMedAksjonspunkterOgFaktaOmBeregning } from '@fpsak-frontend/utils-test/src/beregning-test-helper';
import {
  getFormValuesForBeregning, getFormInitialValuesForBeregning,
} from './BeregningFormUtils';

const {
  VURDER_FAKTA_FOR_ATFL_SN,
  AVKLAR_AKTIVITETER,
} = aksjonspunktCodes;
const fellesAksjonspunkt = { definisjon: { kode: VURDER_FAKTA_FOR_ATFL_SN } };
const avklarAktiviteterAksjonspunkt = { definisjon: { kode: AVKLAR_AKTIVITETER } };
const aksjonspunkter = [fellesAksjonspunkt, avklarAktiviteterAksjonspunkt];

describe('<BeregningFormUtils>', () => {
  it('skal returnere udefinert om values er udefinert', () => {
    const formValues = getFormValuesForBeregning.resultFunc(undefined);
    expect(formValues).to.equal(undefined);
  });

  it('skal returnere values', () => {
    const values = {
      test: 'test',
    };
    const state = lagStateMedAksjonspunkterOgFaktaOmBeregning(aksjonspunkter, {}, values);
    const formValues = getFormValuesForBeregning(state);
    expect(formValues.test).to.equal('test');
  });

  it('skal returnere initialvalues', () => {
    const values = {
      test: 'test',
    };
    const state = lagStateMedAksjonspunkterOgFaktaOmBeregning(aksjonspunkter, {}, {}, values);
    const formValues = getFormInitialValuesForBeregning(state);
    expect(formValues.test).to.equal('test');
  });
});
