import { expect } from 'chai';
import { isRequiredMessage } from '@fpsak-frontend/utils';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import VurderBesteberegningForm, { besteberegningField } from './VurderBesteberegningForm';


describe('<VurderBesteberegning>', () => {
  it('skal ikkje validere om man ikkje har tilfelle', () => {
    const error = VurderBesteberegningForm.validate({}, [faktaOmBeregningTilfelle.VURDER_LONNSENDRING]);
    expect(error).to.be.empty;
  });

  it('skal validere om ikkje vurdert', () => {
    const error = VurderBesteberegningForm.validate({}, [faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING]);
    expect(error[besteberegningField][0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal bygge initial values', () => {
    const vurderBesteberegning = {
      skalHaBesteberegning: false,
      andeler: [{ andelsnr: 1, aktivitetStatus: { kode: 'AT' } }],
    };
    const initialValues = VurderBesteberegningForm.buildInitialValues(vurderBesteberegning, [faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING]);
    expect(initialValues[besteberegningField]).to.equal(false);
  });


  it('skal transform values', () => {
    const values = {};
    values[besteberegningField] = false;
    const transformed = VurderBesteberegningForm.transformValues(values, { vurderBesteberegning: {} });
    expect(transformed.besteberegningAndeler.besteberegningAndelListe.length).to.equal(0);
  });


  it('skal transform values om besteberegning', () => {
    const values = {};
    values[besteberegningField] = true;
    const inntektPrMnd = [
      { andelsnr: 1, fastsattBelop: 10000, inntektskategori: 'ARBEIDSTAKER' },
      {
        nyAndel: true, lagtTilAvSaksbehandler: true, andelsnr: undefined, fastsattBelop: 20000, inntektskategori: 'DAGPENGER', aktivitetStatus: 'DP',
      },
    ];
    const transformed = VurderBesteberegningForm.transformValues(values, { vurderBesteberegning: {} }, inntektPrMnd);
    expect(transformed.besteberegningAndeler.besteberegningAndelListe.length).to.equal(2);
    expect(transformed.besteberegningAndeler.besteberegningAndelListe[0].andelsnr).to.equal(1);
    expect(transformed.besteberegningAndeler.besteberegningAndelListe[0].fastsatteVerdier.fastsattBeløp).to.equal(10000);
    expect(transformed.besteberegningAndeler.besteberegningAndelListe[0].fastsatteVerdier.inntektskategori).to.equal('ARBEIDSTAKER');
    expect(transformed.besteberegningAndeler.besteberegningAndelListe[0].fastsatteVerdier.skalHaBesteberegning).to.equal(true);
    expect(transformed.besteberegningAndeler.besteberegningAndelListe[1].andelsnr).to.equal(undefined);
    expect(transformed.besteberegningAndeler.besteberegningAndelListe[1].lagtTilAvSaksbehandler).to.equal(true);
    expect(transformed.besteberegningAndeler.besteberegningAndelListe[1].nyAndel).to.equal(true);
    expect(transformed.besteberegningAndeler.besteberegningAndelListe[1].fastsatteVerdier.inntektskategori).to.equal('DAGPENGER');
    expect(transformed.besteberegningAndeler.besteberegningAndelListe[1].aktivitetStatus).to.equal('DP');
    expect(transformed.besteberegningAndeler.besteberegningAndelListe[1].fastsatteVerdier.skalHaBesteberegning).to.equal(true);
    expect(transformed.besteberegningAndeler.besteberegningAndelListe[1].fastsatteVerdier.fastsattBeløp).to.equal(20000);
  });
});
