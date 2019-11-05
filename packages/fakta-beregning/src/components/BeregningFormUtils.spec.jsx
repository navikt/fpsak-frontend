import { expect } from 'chai';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { lagStateMedAksjonspunkterOgBeregningsgrunnlag } from '@fpsak-frontend/utils-test/src/beregning-test-helper';
import { formNameVurderFaktaBeregning, getFormInitialValuesForBeregning, getFormValuesForBeregning } from './BeregningFormUtils';

const {
  VURDER_FAKTA_FOR_ATFL_SN,
  AVKLAR_AKTIVITETER,
} = aksjonspunktCodes;
const fellesAksjonspunkt = { definisjon: { kode: VURDER_FAKTA_FOR_ATFL_SN } };
const avklarAktiviteterAksjonspunkt = { definisjon: { kode: AVKLAR_AKTIVITETER } };
const aksjonspunkter = [fellesAksjonspunkt, avklarAktiviteterAksjonspunkt];

const behandlingProps = {
  behandlingId: 1000051,
  behandlingVersjon: 1,
};

describe('<BeregningFormUtils>', () => {
  it('skal returnere udefinert om values er udefinert', () => {
    const formValues = getFormValuesForBeregning.resultFunc(undefined, undefined);
    expect(formValues).to.equal(undefined);
  });

  it('skal returnere values', () => {
    const values = {
      test: 'test',
    };
    const state = lagStateMedAksjonspunkterOgBeregningsgrunnlag(aksjonspunkter, {}, formNameVurderFaktaBeregning, values);
    const formValues = getFormValuesForBeregning(state, behandlingProps);
    expect(formValues.test).to.equal('test');
  });

  it('skal returnere initialvalues', () => {
    const values = {
      test: 'test',
    };
    const state = lagStateMedAksjonspunkterOgBeregningsgrunnlag(aksjonspunkter, {}, formNameVurderFaktaBeregning, {}, values);
    const formValues = getFormInitialValuesForBeregning(state, behandlingProps);
    expect(formValues.test).to.equal('test');
  });
});
