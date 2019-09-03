import { expect } from 'chai';

import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  getAktivitetStatuser,
  getAlleAndelerIForstePeriode,
  getAntallDodfodteBarn,
  getEditedStatus,
  getGjeldendeBeregningAksjonspunkter,
  getSkalKunneLeggeTilNyeArbeidsforhold,
  getToTrinnsAksjonspunkter,
  isBehandlingRevurderingFortsattMedlemskap,
} from './behandlingSelectors';

describe('behandlingSelectors', () => {
  it('skal finne totrinns-aksjonspunkter', () => {
    const aksjonspunkter = [{
      id: 1,
      toTrinnsBehandling: true,
    }, {
      id: 2,
      toTrinnsBehandling: false,
    }];

    const totrinnsAps = getToTrinnsAksjonspunkter.resultFunc(aksjonspunkter);

    expect(totrinnsAps).has.length(1);
    expect(totrinnsAps[0].id).is.eql(1);
  });

  describe('beregningsgrunnlag', () => {
    it('skal finne aktivitetsstatus-koder', () => {
      const beregningsgrunnlag = {
        aktivitetStatus: [
          {
            kode: aktivitetStatus.ARBEIDSTAKER,
          },
          {
            kode: aktivitetStatus.FRILANSER,
          },
        ],
      };

      const statuser = getAktivitetStatuser.resultFunc(beregningsgrunnlag);
      const codes = statuser.map((status) => status.kode);
      expect(codes).is.eql([aktivitetStatus.ARBEIDSTAKER, aktivitetStatus.FRILANSER]);
    });

    it('skal finne status og andeler i beregningsgrunnlaget', () => {
      const beregningsgrunnlag = {
        beregningsgrunnlagPeriode: [{
          beregningsgrunnlagPrStatusOgAndel: [{
            id: 1,
          }, {
            id: 2,
          }],
        }],
      };

      const statusOgAndeler = getAlleAndelerIForstePeriode.resultFunc(beregningsgrunnlag);

      expect(statusOgAndeler).is.eql(beregningsgrunnlag.beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel);
    });

    it('skal hente aksjonspunkter relevant for beregning og filtrere uten de som ikke er relevant', () => {
      const aksjonspunkter = [
        {
          definisjon: {
            kode: aksjonspunktCodes.VURDER_DEKNINGSGRAD,
          },
        },
        {
          definisjon: {
            kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
          },
        },
        {
          definisjon: {
            kode: aksjonspunktCodes.AVKLAR_UTTAK,
          },
        },
      ];
      const beregningAksjonspunkter = getGjeldendeBeregningAksjonspunkter.resultFunc(aksjonspunkter);
      expect(beregningAksjonspunkter).to.be.lengthOf(2);
      expect(beregningAksjonspunkter[0].definisjon.kode).to.equal('5087');
      expect(beregningAksjonspunkter[1].definisjon.kode).to.equal('5038');
    });

    it('Skal teste at ingen aksjonspunkter blir hentet ut når ingen er relevant for beregning', () => {
      const aksjonspunkter = [
        {
          definisjon: {
            kode: aksjonspunktCodes.AVKLAR_UTTAK,
          },
        },
      ];
      const beregningAksjonspunkter = getGjeldendeBeregningAksjonspunkter.resultFunc(aksjonspunkter);
      expect(beregningAksjonspunkter).to.be.lengthOf(0);
    });
  });

  describe('medlem', () => {
    it('skal ha medlemskap og revuderingsbehandling', () => {
      const type = {
        kode: behandlingType.REVURDERING,
      };
      const medlem = {
        fom: '2018-10-10',
      };

      const isRevurdering = isBehandlingRevurderingFortsattMedlemskap.resultFunc(type, medlem);

      expect(isRevurdering).is.true;
    });

    it('skal ikke ha medlemskap', () => {
      const type = {
        kode: behandlingType.REVURDERING,
      };
      const medlem = {};

      const isRevurdering = isBehandlingRevurderingFortsattMedlemskap.resultFunc(type, medlem);

      expect(isRevurdering).is.false;
    });
  });

  describe('personopplysninger', () => {
    it('skal hente antall dødfødte barn markert av fødselsnummer', () => {
      const barn = [{
        fnr: '2342300001',
      }, {
        fnr: '2342323233',
      }, {
        fnr: '2342302341',
      }];

      const nr = getAntallDodfodteBarn.resultFunc(barn);

      expect(nr).is.eql(1);
    });
  });

  describe('getEditedStatus', () => {
    it('skal markere at termindato er endret', () => {
      const soknad = {
        soknadType: {
          kode: soknadType.FODSEL,
        },
        fodselsdatoer: {
          0: '2018-01-01',
        },
        termindato: '2018-01-01',
      };
      const familiehendelse = {
        termindato: '2018-01-02',
      };
      const personopplysning = {
        id: 1,
        barnSoktFor: [],
      };
      const annenPartPersonopplysning = {
        id: 2,
      };

      const isFieldEdited = getEditedStatus.resultFunc(soknad, familiehendelse, personopplysning, annenPartPersonopplysning);

      expect(isFieldEdited.termindato).is.true;
    });

    it('skal markere at termindato ikke er endret', () => {
      const soknad = {
        soknadType: {
          kode: soknadType.FODSEL,
        },
        fodselsdatoer: {
          0: '2018-01-01',
        },
        termindato: '2018-01-01',
      };
      const familiehendelse = {
        termindato: '2018-01-01',
      };
      const personopplysning = {
        id: 1,
        barnSoktFor: [],
      };
      const annenPartPersonopplysning = {
        id: 2,
      };

      const isFieldEdited = getEditedStatus.resultFunc(soknad, familiehendelse, personopplysning, annenPartPersonopplysning);

      expect(isFieldEdited.termindato).is.false;
    });
  });

  describe('getSkalKunneLeggeTilNyeArbeidsforhold', () => {
    it('skal hente hvorvidt man skal kunne legge til nye arbeidsforhold - true', () => {
      const iayObj = {
        skalKunneLeggeTilNyeArbeidsforhold: true,
      };
      expect(getSkalKunneLeggeTilNyeArbeidsforhold.resultFunc(iayObj)).is.eql(true);
    });
    it('skal hente hvorvidt man skal kunne legge til nye arbeidsforhold - false', () => {
      const iayObj = {
        skalKunneLeggeTilNyeArbeidsforhold: false,
      };
      expect(getSkalKunneLeggeTilNyeArbeidsforhold.resultFunc(iayObj)).is.eql(false);
    });
  });
});
