import faktaPanelCodes from './faktaPanelCodes';
import prosessStegCodes from './prosessStegCodes';

const skjermlenkeCodes = {
  BEREGNING_ENGANGSSTOENAD: {
    kode: 'BEREGNING_ENGANGSSTOENAD',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.BEREGNING,
  },
  BEREGNING_FORELDREPENGER: {
    kode: 'BEREGNING_FORELDREPENGER',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.BEREGNINGSGRUNNLAG,
  },
  FAKTA_OM_ADOPSJON: {
    kode: 'FAKTA_OM_ADOPSJON',
    faktaNavn: faktaPanelCodes.ADOPSJONSVILKARET,
    punktNavn: '',
  },
  FAKTA_OM_BEREGNING: {
    kode: 'FAKTA_OM_BEREGNING',
    faktaNavn: faktaPanelCodes.BEREGNING,
    punktNavn: '',
  },
  FAKTA_OM_FOEDSEL: {
    kode: 'FAKTA_OM_FOEDSEL',
    faktaNavn: faktaPanelCodes.FODSELSVILKARET,
    punktNavn: '',
  },
  FAKTA_OM_FORDELING: {
    kode: 'FAKTA_OM_FORDELING',
    faktaNavn: faktaPanelCodes.FORDELING,
    punktNavn: '',
  },
  FAKTA_OM_MEDLEMSKAP: {
    kode: 'FAKTA_OM_MEDLEMSKAP',
    faktaNavn: faktaPanelCodes.MEDLEMSKAPSVILKARET,
    punktNavn: '',
  },
  FAKTA_FOR_OMSORG: {
    kode: 'FAKTA_FOR_OMSORG',
    faktaNavn: faktaPanelCodes.OMSORG,
    punktNavn: '',
  },
  FAKTA_FOR_OPPTJENING: {
    kode: 'FAKTA_FOR_OPPTJENING',
    faktaNavn: faktaPanelCodes.OPPTJENINGSVILKARET,
    punktNavn: '',
  },
  FAKTA_OM_OPPTJENING: {
    kode: 'FAKTA_OM_OPPTJENING',
    faktaNavn: faktaPanelCodes.OPPTJENINGSVILKARET,
    punktNavn: '',
  },
  FAKTA_OM_OMSORG_OG_FORELDREANSVAR: {
    kode: 'FAKTA_OM_OMSORG_OG_FORELDREANSVAR',
    faktaNavn: faktaPanelCodes.OMSORGSVILKARET,
    punktNavn: '',
  },
  FAKTA_OM_ARBEIDSFORHOLD: {
    kode: 'FAKTA_OM_ARBEIDSFORHOLD',
    faktaNavn: faktaPanelCodes.ARBEIDSFORHOLD,
    punktNavn: '',
  },
  PUNKT_FOR_FORELDREANSVAR: {
    kode: 'PUNKT_FOR_FORELDREANSVAR',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.INNGANGSVILKAR,
  },
  KLAGE_BEH_NFP: {
    kode: 'KLAGE_BEH_NFP',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.KLAGE_NAV_FAMILIE_OG_PENSJON,
  },
  KLAGE_BEH_NK: {
    kode: 'KLAGE_BEH_NK',
    skjermlenkeId: 'Skjermlenke.Klage.ResolveKlage.Title',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.KLAGE_NAV_KLAGEINSTANS,
  },
  FORMKRAV_KLAGE_NFP: {
    kode: 'FORMKRAV_KLAGE_NFP',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.FORMKRAV_KLAGE_NAV_FAMILIE_OG_PENSJON,
  },
  FORMKRAV_KLAGE_KA: {
    kode: 'FORMKRAV_KLAGE_KA',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.FORMKRAV_KLAGE_NAV_KLAGEINSTANS,
  },
  ANKE_VURDERING: {
    kode: 'ANKE_VURDERING',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.ANKEBEHANDLING,
  },
  KONTROLL_AV_SAKSOPPLYSNINGER: {
    kode: 'KONTROLL_AV_SAKSOPPLYSNINGER',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.SAKSOPPLYSNINGER,
  },
  OPPLYSNINGSPLIKT: {
    kode: 'OPPLYSNINGSPLIKT',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.OPPLYSNINGSPLIKT,
  },
  PUNKT_FOR_ADOPSJON: {
    kode: 'PUNKT_FOR_ADOPSJON',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.INNGANGSVILKAR,
  },
  PUNKT_FOR_FOEDSEL: {
    kode: 'PUNKT_FOR_FOEDSEL',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.INNGANGSVILKAR,
  },
  PUNKT_FOR_MEDLEMSKAP: {
    kode: 'PUNKT_FOR_MEDLEMSKAP',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.INNGANGSVILKAR,
  },
  PUNKT_FOR_OMSORG: {
    kode: 'PUNKT_FOR_OMSORG',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.INNGANGSVILKAR,
  },
  PUNKT_FOR_OPPTJENING: {
    kode: 'PUNKT_FOR_OPPTJENING',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.INNGANGSVILKAR,
  },
  SOEKNADSFRIST: {
    kode: 'SOEKNADSFRIST',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.SOEKNADSFRIST,
  },
  VEDTAK: {
    kode: 'VEDTAK',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.VEDTAK,
  },
  FAKTA_OM_UTTAK: {
    kode: 'FAKTA_OM_UTTAK',
    faktaNavn: faktaPanelCodes.UTTAK,
    punktNavn: '',
  },
  UTTAK: {
    kode: 'UTTAK',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.UTTAK,
  },
  FAKTA_OM_VERGE: {
    kode: 'FAKTA_OM_VERGE',
    faktaNavn: faktaPanelCodes.VERGE,
    punktNavn: '',
  },
  TILKJENT_YTELSE: {
    kode: 'TILKJENT_YTELSE',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.TILKJENT_YTELSE,
  },

  FAKTA_OM_SIMULERING: {
    kode: 'SIMULERING',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.SIMULERING,
  },
  FAKTA_OM_FEILUTBETALING: {
    kode: 'FAKTA_OM_FEILUTBETALING',
    faktaNavn: faktaPanelCodes.FEILUTBETALING,
    punktNavn: '',
  },
  UTLAND: {
    kode: 'UTLAND',
    faktaNavn: faktaPanelCodes.SAKEN,
    punktNavn: '',
  },
  FORELDELSE: {
    kode: 'FORELDELSE',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.FORELDELSE,
  },
  TILBAKEKREVING: {
    kode: 'TILBAKEKREVING',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.TILBAKEKREVING,
  },
  PUNKT_FOR_SVP_INNGANG: {
    kode: 'SVANGERSKAP',
    faktaNavn: faktaPanelCodes.FODSELTILRETTELEGGING,
    punktNavn: '',
  },
  PUNKT_FOR_SVANGERSKAPSPENGER: {
    kode: 'SVANGERSKAP',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.INNGANGSVILKAR,
  },
  VURDER_FARESIGNALER: {
    kode: 'VURDER_FARESIGNALER',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: '',
  },
  PUNKT_FOR_MEDLEMSKAP_LØPENDE: {
    kode: 'PUNKT_FOR_MEDLEMSKAP_LØPENDE',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.FORTSATTMEDLEMSKAP,
  },
};

export default skjermlenkeCodes;
