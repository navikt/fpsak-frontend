import { expect } from 'chai';
import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { buildInitialValues, transformValues } from './BehandleKlageNfpFormNy';

describe('<BehandleKlageNfpFormNy>', () => {
  it('skal initiere form med aktuelle verdier fra behandling', () => {
    const klageVurdering = 'STADFESTE_YTELSESVEDTAK';
    const medholdArsak = 'MEDHOLD';
    const begrunnelse = 'BEGRUNNELSE';

    const klageVurderingResultatNF = {
      klageVurdering,
      klageMedholdArsak: medholdArsak,
      begrunnelse,
    };

    const initialValues = buildInitialValues.resultFunc(klageVurderingResultatNF);
    expect(initialValues.klageVurdering).to.equal(klageVurdering);
    expect(initialValues.klageMedholdArsak).to.equal(medholdArsak);
    expect(initialValues.begrunnelse).to.equal(begrunnelse);
  });

  it('skal ikke sende medhold årsak når klagevurdering er opprettholdt', () => {
    const klageVurdering = klageVurderingType.STADFESTE_YTELSESVEDTAK;
    const medholdArsak = 'MEDHOLD';
    const begrunnelse = 'BEGRUNNELSE';
    const aksjonspunktCode = aksjonspunktCodes.BEHANDLE_KLAGE_NK;
    const kode = aksjonspunktCode;

    const values = {
      klageVurdering,
      klageMedholdArsak: medholdArsak,
      begrunnelse,
      kode,
    };

    const transformedValues = transformValues(values, aksjonspunktCode);

    expect(transformedValues.klageMedholdArsak).to.be.null;
  });

  it('skal sende medhold årsak når klagevurdering er medhold', () => {
    const klageVurdering = klageVurderingType.MEDHOLD_I_KLAGE;
    const medholdArsak = 'MEDHOLD';
    const begrunnelse = 'BEGRUNNELSE';
    const aksjonspunktCode = aksjonspunktCodes.BEHANDLE_KLAGE_NK;
    const kode = aksjonspunktCode;

    const values = {
      klageVurdering,
      klageMedholdArsak: medholdArsak,
      begrunnelse,
      kode,
    };

    const transformedValues = transformValues(values, aksjonspunktCode);

    expect(transformedValues.klageMedholdArsak).to.equal(medholdArsak);
  });
});
