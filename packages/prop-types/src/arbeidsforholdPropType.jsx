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
  id: PropTypes.string.isRequired,
  navn: PropTypes.string.isRequired,
  arbeidsgiverIdentifikator: PropTypes.string.isRequired,
  arbeidsgiverIdentifiktorGUI: PropTypes.string.isRequired,
  arbeidsforholdId: PropTypes.string,
  fomDato: PropTypes.string.isRequired,
  tomDato: PropTypes.string,
  kilde: PropTypes.shape({
    navn: PropTypes.string,
  }),
  mottattDatoInntektsmelding: PropTypes.string,
  beskrivelse: PropTypes.string,
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
  handlingType: PropTypes.shape({
    navn: PropTypes.string,
  }),
});

export default arbeidsforholdPropType;
