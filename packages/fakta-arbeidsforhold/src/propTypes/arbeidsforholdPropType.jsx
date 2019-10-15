import PropTypes from 'prop-types';

// fra uttak
export const arbeidsgiverUttakPropType = PropTypes.shape({
  aktørId: PropTypes.string,
  identifikator: PropTypes.string,
  navn: PropTypes.string,
  virksomhet: PropTypes.bool,
});

// fra beregning
export const arbeidsforholdBeregningProptype = PropTypes.shape({
  arbeidsgiverNavn: PropTypes.string,
  arbeidsgiverId: PropTypes.string,
  startdato: PropTypes.string,
  opphoersdato: PropTypes.string,
  arbeidsforholdId: PropTypes.string,
});


export const arbeidsforholdPropType = PropTypes.shape({
  id: PropTypes.string,
  navn: PropTypes.string,
  arbeidsgiverIdentifikator: PropTypes.string,
  arbeidsgiverIdentifiktorGUI: PropTypes.string,
  arbeidsforholdId: PropTypes.string,
  fomDato: PropTypes.string,
  tomDato: PropTypes.string,
  kilde: PropTypes.shape({
    navn: PropTypes.string.isRequired,
  }),
  mottattDatoInntektsmelding: PropTypes.string,
  stillingsprosent: PropTypes.number,
  brukArbeidsforholdet: PropTypes.bool,
  fortsettBehandlingUtenInntektsmelding: PropTypes.bool,
  erNyttArbeidsforhold: PropTypes.bool,
  erSlettet: PropTypes.bool,
  erstatterArbeidsforholdId: PropTypes.string,
  harErsattetEttEllerFlere: PropTypes.bool,
  ikkeRegistrertIAaRegister: PropTypes.bool,
  tilVurdering: PropTypes.bool,
  vurderOmSkalErstattes: PropTypes.bool,
  erEndret: PropTypes.bool,
  brukMedJustertPeriode: PropTypes.bool,
  overstyrtTom: PropTypes.string,
  lagtTilAvSaksbehandler: PropTypes.bool,
  basertPaInntektsmelding: PropTypes.bool,
  inntektMedTilBeregningsgrunnlag: PropTypes.bool,
  skjaeringstidspunkt: PropTypes.string,
  begrunnelse: PropTypes.string,
  permisjoner: PropTypes.arrayOf(PropTypes.shape({
    permisjonFom: PropTypes.string,
    permisjonTom: PropTypes.string,
    permisjonsprosent: PropTypes.number,
    type: PropTypes.shape({
      kode: PropTypes.string,
      kodeverk: PropTypes.string,
    }),
  })),
  brukPermisjon: PropTypes.bool,
});

export default arbeidsforholdPropType;
