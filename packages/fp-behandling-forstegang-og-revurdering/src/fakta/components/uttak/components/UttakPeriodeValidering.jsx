import moment from 'moment';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

const uttakAksjonspunkter = [aksjonspunktCodes.AVKLAR_UTTAK, aksjonspunktCodes.AVKLAR_FØRSTE_UTTAKSDATO];

export const sjekkOmfaktaOmUttakAksjonspunkt = aksjonspunkter => aksjonspunkter.some(ap => uttakAksjonspunkter.includes(ap.definisjon.kode));

export const sjekkArbeidsprosentOver100 = periode => periode.arbeidstidsprosent > 100;

export const sjekkOverlappendePerioder = (index, nestePeriode, forrigePeriode) => index !== 0
  && moment(nestePeriode.fom) <= moment(forrigePeriode.tom);

export const sjekkEndretFørsteUttaksdato = (originalStartDato, nyStartDato, aksjonspunkter) => moment(originalStartDato).diff(moment(nyStartDato)) !== 0
  && !aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_FØRSTE_UTTAKSDATO);

export const sjekkNyFørsteUttakdatoStartErEtterSkjæringpunkt = (nyStartDato, førsteUttaksdato, aksjonspunkter) => moment(nyStartDato) > moment(førsteUttaksdato)
  && aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_FØRSTE_UTTAKSDATO);

export const sjekkNyFørsteUttakdatoStartErFørSkjæringpunkt = (nyStartDato, førsteUttaksdato, aksjonspunkter) => moment(nyStartDato) < moment(førsteUttaksdato)
  && aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_FØRSTE_UTTAKSDATO);
