import moment from 'moment';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

const uttakAksjonspunkter = [aksjonspunktCodes.AVKLAR_UTTAK, aksjonspunktCodes.AVKLAR_FØRSTE_UTTAKSDATO];

export const sjekkOmfaktaOmUttakAksjonspunkt = aksjonspunkter => aksjonspunkter.some(ap => uttakAksjonspunkter.includes(ap.definisjon.kode));

export const sjekkArbeidsprosentOver100 = periode => periode.arbeidstidsprosent > 100;

export const sjekkOverlappendePerioder = (index, nestePeriode, forrigePeriode) => index !== 0
  && moment(nestePeriode.fom) <= moment(forrigePeriode.tom);

export const sjekkEndretFørsteuttaksdato = (originalStartDato, nyStartDato, aksjonspunkter) => moment(originalStartDato).diff(moment(nyStartDato)) !== 0
  && !aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_FØRSTE_UTTAKSDATO);

export const sjekkNyFørsteuttakdatoStartErEtterSkjæringpunkt = (nyStartDato, førsteuttaksdato, aksjonspunkter) => moment(nyStartDato) > moment(førsteuttaksdato)
  && aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_FØRSTE_UTTAKSDATO);

export const sjekkNyFørsteuttakdatoStartErFørSkjæringpunkt = (nyStartDato, førsteuttaksdato, aksjonspunkter) => moment(nyStartDato) < moment(førsteuttaksdato)
  && aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_FØRSTE_UTTAKSDATO);
