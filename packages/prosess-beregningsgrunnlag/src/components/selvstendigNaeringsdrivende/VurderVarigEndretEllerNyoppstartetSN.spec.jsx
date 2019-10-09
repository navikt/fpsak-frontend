import { expect } from 'chai';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import VurderVarigEndretEllerNyoppstartetSN, { begrunnelseFieldname, varigEndringRadioname } from './VurderVarigEndretEllerNyoppstartetSN';

const {
  VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
} = aksjonspunktCodes;

const mockAksjonspunktMedKodeOgStatus = (apKode, begrunnelse, status) => ({
  definisjon: {
    kode: apKode,
  },
  status: {
    kode: status,
  },
  begrunnelse,
});

const lagAndel = (status, fastsattBelop) => ({
  aktivitetStatus: {
    kode: status,
  },
  beregnetPrAar: 200000,
  overstyrtPrAar: fastsattBelop,
  beregningsperiodeFom: '2015-01-01',
  beregningsperiodeTom: '2017-01-01',
});

describe('<VurderVarigEndretEllerNyoppstartetSN>', () => {
  it('Skal teste at buildInitialValues bygges korrekt når tidligere vurdert ingen varig endring', () => {
    const andeler = [lagAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, null), lagAndel(aktivitetStatus.ARBEIDSTAKER, 250000)];
    const aksjonspunkter = [mockAksjonspunktMedKodeOgStatus(VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE, 'Ok.', 'UTFO')];

    const actualValues = VurderVarigEndretEllerNyoppstartetSN.buildInitialValues(andeler, aksjonspunkter);

    const expectedValues = {
      [varigEndringRadioname]: false,
      [begrunnelseFieldname]: 'Ok.',
    };

    expect(actualValues).to.deep.equal(expectedValues);
  });

  it('Skal teste at buildInitialValues bygges korrekt når tidligere vurdert til ingen varig endring', () => {
    const andeler = [lagAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, 300000), lagAndel(aktivitetStatus.ARBEIDSTAKER, 250000)];
    const aksjonspunkter = [mockAksjonspunktMedKodeOgStatus(VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE, 'Ok.', 'UTFO')];

    const actualValues = VurderVarigEndretEllerNyoppstartetSN.buildInitialValues(andeler, aksjonspunkter);

    const expectedValues = {
      [varigEndringRadioname]: true,
      [begrunnelseFieldname]: 'Ok.',
    };

    expect(actualValues).to.deep.equal(expectedValues);
  });

  it('Skal teste at buildInitialValues bygges korrekt når ikke tidligere vurdert', () => {
    const andeler = [lagAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, null), lagAndel(aktivitetStatus.ARBEIDSTAKER, 250000)];
    const aksjonspunkter = [mockAksjonspunktMedKodeOgStatus(VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE, undefined, 'OPPR')];

    const actualValues = VurderVarigEndretEllerNyoppstartetSN.buildInitialValues(andeler, aksjonspunkter);

    const expectedValues = {
      [varigEndringRadioname]: undefined,
      [begrunnelseFieldname]: '',
    };

    expect(actualValues).to.deep.equal(expectedValues);
  });
});
