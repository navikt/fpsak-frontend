import { expect } from 'chai';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  BEGRUNNELSE_FAKTA_TILFELLER_NAME,
  buildInitialValuesVurderFaktaBeregning,
  harIkkeEndringerIAvklarMedFlereAksjonspunkter,
  transformValuesVurderFaktaBeregning,
} from './VurderFaktaBeregningPanel';

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
  it('skal bygge initial values', () => {
    const initialValuesFelles = () => ({ test: 'test' });
    const initialValues = buildInitialValuesVurderFaktaBeregning.resultFunc(aksjonspunkter, initialValuesFelles);
    expect(initialValues.test).to.equal('test');
  });

  it('skal ikkje transformValues uten aksjonspunkt', () => {
    const faktaOmBeregning = {
      avklarAktiviteter: {
        ventelonnVartpenger: {
          inkludert: null,
        },
      },
    };
    const values = {
      aksjonspunkter: [avklarAktiviteterAp],
      faktaOmBeregning,
    };
    const transformed = transformValuesVurderFaktaBeregning(values);
    expect(transformed).to.be.empty;
  });


  it('skal transformValues med aksjonspunkt', () => {
    const faktaOmBeregning = {
      avklarAktiviteter: {
        ventelonnVartpenger: {
          inkludert: null,
        },
      },
    };
    const tilfeller = [];
    const values = {
      [BEGRUNNELSE_FAKTA_TILFELLER_NAME]: 'begrunnelse', aksjonspunkter, faktaOmBeregning, tilfeller,
    };
    const transformed = transformValuesVurderFaktaBeregning(values);
    expect(transformed[0].begrunnelse).to.equal('begrunnelse');
    expect(transformed[0].kode).to.equal(VURDER_FAKTA_FOR_ATFL_SN);
  });

  it('skal returnere true for endring i avklar med kun avklar aksjonspunkt', () => {
    const aps = [{ definisjon: { kode: AVKLAR_AKTIVITETER } }];
    const knappSkalKunneTrykkes = harIkkeEndringerIAvklarMedFlereAksjonspunkter(true, aps);
    expect(knappSkalKunneTrykkes).to.equal(true);
  });

  it('skal returnere false for endring i avklar med to aksjonspunkter', () => {
    const aps = [{ definisjon: { kode: AVKLAR_AKTIVITETER } }, { definisjon: { kode: VURDER_FAKTA_FOR_ATFL_SN } }];
    const knappSkalKunneTrykkes = harIkkeEndringerIAvklarMedFlereAksjonspunkter(true, aps);
    expect(knappSkalKunneTrykkes).to.equal(false);
  });


  it('skal returnere true for ingen endring i avklar med VURDER_FAKTA_FOR_ATFL_SN', () => {
    const aps = [{ definisjon: { kode: VURDER_FAKTA_FOR_ATFL_SN } }];
    const knappSkalKunneTrykkes = harIkkeEndringerIAvklarMedFlereAksjonspunkter(false, aps);
    expect(knappSkalKunneTrykkes).to.equal(true);
  });

  it('skal returnere true for ingen endring i avklar med to aksjonspunkter', () => {
    const aps = [{ definisjon: { kode: AVKLAR_AKTIVITETER } }, { definisjon: { kode: VURDER_FAKTA_FOR_ATFL_SN } }];
    const knappSkalKunneTrykkes = harIkkeEndringerIAvklarMedFlereAksjonspunkter(false, aps);
    expect(knappSkalKunneTrykkes).to.equal(true);
  });
});
