import moment from 'moment';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

const uttakAksjonspunkter = [
  aksjonspunktCodes.AVKLAR_UTTAK,
  aksjonspunktCodes.ANNEN_FORELDER_IKKE_RETT_OG_LØPENDE_VEDTAK,
  aksjonspunktCodes.AVKLAR_FØRSTE_UTTAKSDATO,
];

export const sjekkOmfaktaOmUttakAksjonspunkt = (aksjonspunkter) => aksjonspunkter.some((ap) => uttakAksjonspunkter.includes(ap.definisjon.kode));

export const sjekkArbeidsprosentOver100 = (periode) => periode.arbeidstidsprosent > 100;

export const sjekkOverlappendePerioder = (index, nestePeriode, forrigePeriode) => index !== 0
  && moment(nestePeriode.fom) <= moment(forrigePeriode.tom);


export const sjekkEndretFørsteUttaksdato = (nyStartDato, førsteUttaksdato) => moment(nyStartDato).isBefore(moment(førsteUttaksdato));
