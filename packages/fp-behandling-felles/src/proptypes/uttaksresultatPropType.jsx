import PropTypes from 'prop-types';

export const kodeverkPropType = PropTypes.shape({
  kode: PropTypes.string.isRequired,
  kodeverk: PropTypes.string.isRequired,
  navn: PropTypes.string.isRequired,
});

const arbeidsgiverPropType = PropTypes.shape({
  aktørId: PropTypes.string,
  identifikator: PropTypes.string,
  navn: PropTypes.string,
  virksomhet: PropTypes.bool,
});

export const uttaksresultatAktivitetPropType = PropTypes.shape({
  arbeidsforholdId: PropTypes.string, // Hvis andel tilhører arbeidsgiver
  arbeidsgiver: arbeidsgiverPropType,
  gradering: PropTypes.bool,
  prosentArbeid: PropTypes.number, // Hvis andel tilhører søker
  samtidigUttak: PropTypes.bool,
  stønadskontoType: kodeverkPropType,
  trekkdager: PropTypes.number,
  trekkdagerFlerbarnKvote: PropTypes.number,
  utbetalingsgrad: PropTypes.number,
});

export const uttaksresultatPeriodePropType = PropTypes.shape({
  fom: PropTypes.string.isRequired,
  tom: PropTypes.string.isRequired,
  begrunnelse: PropTypes.string,
  aktiviteter: PropTypes.arrayOf(uttaksresultatAktivitetPropType).isRequired,
  periodeResultatType: kodeverkPropType.isRequired,
});

export default PropTypes.shape({
  perioderSøker: PropTypes.arrayOf(uttaksresultatPeriodePropType).isRequired,
});
