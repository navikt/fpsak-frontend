import PropTypes from 'prop-types';

export const uttakPropType = PropTypes.shape({
  trekkdager: PropTypes.number.isRequired,
  stonadskontoType: PropTypes.string.isRequired, // kodeverk
  periodeType: PropTypes.string, // kodeverk
  periodeResultatType: PropTypes.string.isRequired, // kodeverk
});

export const beregningsresultatPeriodeAndelPropType = PropTypes.shape({
  arbeidsgiverNavn: PropTypes.string, // Hvis andel tilhører arbeidsgiver
  arbeidsgiverOrgnr: PropTypes.string, // Hvis andel tilhører arbeidsgiver
  refusjon: PropTypes.number, // Hvis andel tilhører arbeidsgiver
  tilSoker: PropTypes.number, // Hvis andel tilhører søker
  sisteUtbetalingsdato: PropTypes.string,
  uttaksgrad: PropTypes.number,
  uttak: uttakPropType.isRequired,
  aktivitetStatus: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  }).isRequired,
});

export const beregningsresultatPeriodePropType = PropTypes.shape({
  fom: PropTypes.string.isRequired,
  tom: PropTypes.string.isRequired,
  dagsats: PropTypes.number.isRequired,
  andeler: PropTypes.arrayOf(beregningsresultatPeriodeAndelPropType).isRequired,
});

export default PropTypes.shape({
  sokerErMor: PropTypes.bool.isRequired,
  opphoersdato: PropTypes.string,
  perioder: PropTypes.arrayOf(beregningsresultatPeriodePropType).isRequired,
});
