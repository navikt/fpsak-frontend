import { expect } from 'chai';
import { isRequiredMessage } from '@fpsak-frontend/utils';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import VurderBesteberegningForm, { besteberegningField, ikkeImplementert } from './VurderBesteberegningForm';


describe('<VurderBesteberegning>', () => {
  it('skal ikkje validere om man ikkje har tilfelle', () => {
    const error = VurderBesteberegningForm.validate({}, [faktaOmBeregningTilfelle.VURDER_LONNSENDRING]);
    expect(error).to.be.empty;
  });

  it('skal validere om ikkje vurdert', () => {
    const error = VurderBesteberegningForm.validate({}, [faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING]);
    expect(error[besteberegningField][0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal gi ikkje implementert error', () => {
    const values = {};
    values[besteberegningField] = true;
    const error = VurderBesteberegningForm.validate(values, [faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING]);
    expect(error[besteberegningField][0].id).to.equal(ikkeImplementert()[0].id);
  });

  it('skal bygge initial values', () => {
    const vurderBesteberegning = {
      skalHaBesteberegning: false,
      andeler: [{ andelsnr: 1 }],
    };
    const initialValues = VurderBesteberegningForm.buildInitialValues(vurderBesteberegning);
    expect(initialValues[besteberegningField]).to.equal(false);
  });


  it('skal transform values', () => {
    const values = {};
    values[besteberegningField] = false;
    const transformed = VurderBesteberegningForm.transformValues(values);
    expect(transformed.vurderBesteberegning.skalHaBesteberegning).to.equal(false);
    expect(transformed.vurderBesteberegning.verdierPrAndel.length).to.equal(0);
  });
});
