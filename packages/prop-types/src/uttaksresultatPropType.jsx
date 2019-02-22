import PropTypes from 'prop-types';
import { kodeverkObjektPropType } from './kodeverkPropType';
import { arbeidsgiverUttakPropType } from './arbeidsforholdPropType';


export const uttaksresultatAktivitetPropType = PropTypes.shape({
  arbeidsforholdId: PropTypes.string, // Hvis andel tilhører arbeidsgiver
  arbeidsgiver: arbeidsgiverUttakPropType,
  gradering: PropTypes.bool,
  prosentArbeid: PropTypes.number, // Hvis andel tilhører søker
  samtidigUttak: PropTypes.bool,
  stønadskontoType: kodeverkObjektPropType,
  trekkdager: PropTypes.number,
  trekkdagerFlerbarnKvote: PropTypes.number,
  utbetalingsgrad: PropTypes.number,
});

export const uttaksresultatPeriodePropType = PropTypes.shape({
  fom: PropTypes.string.isRequired,
  tom: PropTypes.string.isRequired,
  begrunnelse: PropTypes.string,
  aktiviteter: PropTypes.arrayOf(uttaksresultatAktivitetPropType).isRequired,
  periodeResultatType: kodeverkObjektPropType.isRequired,
});

export const uttaksresultaltPerioderSøkerPropType = PropTypes.shape({
  perioderSøker: PropTypes.arrayOf(uttaksresultatPeriodePropType).isRequired,
});

export default uttaksresultatPeriodePropType;
