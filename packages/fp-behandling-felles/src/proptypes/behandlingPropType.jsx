import PropTypes from 'prop-types';

import aksjonspunktPropType from './aksjonspunktPropType';
import behandlingsresultatPropType from './behandlingsresultatPropType';
import soknadPropType from './soknadPropType';
import familiehendelsePropType from './familiehendelsePropType';
import medlemPropType from './medlemPropType';
import personopplysningPropType from './personopplysningPropType';
import beregningsgrunnlagPropType from './beregningsgrunnlagPropType';
import opptjeningPropType from './opptjeningPropType';

const commonBehandlingProps = {
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  type: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }).isRequired,
  status: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }).isRequired,
  fagsakId: PropTypes.number.isRequired,
  opprettet: PropTypes.string.isRequired,
  avsluttet: PropTypes.string,
  endret: PropTypes.string,
  behandlingPaaVent: PropTypes.bool,
  behandlingKoet: PropTypes.bool,
  behandlendeEnhetId: PropTypes.string,
  behandlendeEnhetNavn: PropTypes.string,
  behandlingHenlagt: PropTypes.bool,
  fristBehandlingPaaVent: PropTypes.string,
  venteArsakKode: PropTypes.string,
  vilkar: PropTypes.arrayOf(PropTypes.shape({
    vilkarType: PropTypes.shape({
      kode: PropTypes.string.isRequired,
      navn: PropTypes.string.isRequired,
    }),
    vilkarStatus: PropTypes.shape({
      kode: PropTypes.string.isRequired,
      navn: PropTypes.string.isRequired,
    }),
    merknadParametere: PropTypes.shape(),
    avslagKode: PropTypes.string,
    lovReferanse: PropTypes.string.isRequired,
    overstyrbar: PropTypes.bool.isRequired,
  })),
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType),
  sprakkode: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }),
};

const forstegangsbehandlingPropType = PropTypes.shape({
  ...commonBehandlingProps,
  soknad: soknadPropType,
  familiehendelse: familiehendelsePropType,
  behandlingsresultat: behandlingsresultatPropType,
  behandlingArsak: PropTypes.shape({
    erAutomatiskRevurdering: PropTypes.bool,
  }),
  beregningResultat: PropTypes.shape({
    beregnetTilkjentYtelse: PropTypes.number,
    satsVerdi: PropTypes.number,
    antallBarn: PropTypes.number,
  }),
  toTrinnsBehandling: PropTypes.bool,
  medlem: medlemPropType,
  personopplysning: personopplysningPropType,
  vedtaksDatoSomSvangerskapsuke: PropTypes.number,
  skjaringstidspunkt: PropTypes.string,
  relatertTilgrensendeYtelserForSoker: PropTypes.arrayOf(PropTypes.shape({
    relatertYtelseType: PropTypes.string,
    tilgrensendeYtelserListe: PropTypes.arrayOf(PropTypes.shape({
      relatertYtelseType: PropTypes.string,
      periodeFraDato: PropTypes.string,
      periodeTilDato: PropTypes.string,
      saksNummer: PropTypes.string,
      status: PropTypes.string,
    })),
  })),
  relatertTilgrensendeYtelserForAnnenForelder: PropTypes.arrayOf(PropTypes.shape({
    relatertYtelseType: PropTypes.string,
    tilgrensendeYtelserListe: PropTypes.arrayOf(PropTypes.shape({
      relatertYtelseType: PropTypes.string,
      periodeFraDato: PropTypes.string,
      periodeTilDato: PropTypes.string,
      saksNummer: PropTypes.string,
      status: PropTypes.string,
    })),
  })),
  'beregningsresultat-foreldrepenger': PropTypes.shape({
    beregningsgrunnlag: beregningsgrunnlagPropType,
  }),
  'beregningsresultat-engangsstonad': PropTypes.shape({
    beregningsgrunnlag: beregningsgrunnlagPropType,
  }),
  opptjening: opptjeningPropType,
});

const innsynsbehandlingPropType = PropTypes.shape({
  ...commonBehandlingProps,
  innsynMottattDato: PropTypes.string,
  innsynResultatType: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }),
  vedtaksdokumentasjon: PropTypes.shape({
    dokumentId: PropTypes.string.isRequired,
    tittel: PropTypes.string.isRequired,
    opprettetDato: PropTypes.string.isRequired,
  }),
  dokumenter: PropTypes.shape({
    journalpostId: PropTypes.string.isRequired,
    dokumentId: PropTypes.string.isRequired,
    fikkInnsyn: PropTypes.bool.isRequired,
  }),
});

const klagebehandlingPropType = PropTypes.shape({
  ...commonBehandlingProps,
  klageVurderingResultatNFP: PropTypes.shape({
    klageVurdering: PropTypes.string,
    klageMedholdArsak: PropTypes.string,
    klageMedholdArsakNavn: PropTypes.string,
    klageAvvistArsak: PropTypes.string,
    klageAvvistArsakNavn: PropTypes.string,
    begrunnelse: PropTypes.string,
  }),
  klageVurderingResultatNK: PropTypes.shape({
    klageVurdering: PropTypes.string,
    klageMedholdArsak: PropTypes.string,
    klageMedholdArsakNavn: PropTypes.string,
    klageAvvistArsak: PropTypes.string,
    klageAvvistArsakNavn: PropTypes.string,
    begrunnelse: PropTypes.string,
  }),
  toTrinnsBehandling: PropTypes.bool,
  behandlingsresultat: behandlingsresultatPropType,
});

const behandlingPropType = PropTypes.oneOfType([
  forstegangsbehandlingPropType,
  innsynsbehandlingPropType,
  klagebehandlingPropType,
]);

export default behandlingPropType;
