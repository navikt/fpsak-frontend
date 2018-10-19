import behandlingspunktCodes from 'behandlingsprosess/behandlingspunktCodes';
import faktaPanelCodes from 'fakta/faktaPanelCodes';

const skjermlenkeCodes = {
  BEREGNING_ENGANGSSTOENAD: {
    kode: 'BEREGNING_ENGANGSSTOENAD',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.BEREGNING,
  },
  BEREGNING_FORELDREPENGER: {
    kode: 'BEREGNING_FORELDREPENGER',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.BEREGNINGSGRUNNLAG,
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
    faktaNavn: faktaPanelCodes.PERSON,
    punktNavn: '',
  },
  PUNKT_FOR_FORELDREANSVAR: {
    kode: 'PUNKT_FOR_FORELDREANSVAR',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.FORELDREANSVAR,
  },
  KLAGE_BEH_NFP: {
    kode: 'KLAGE_BEH_NFP',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.KLAGE_NAV_FAMILIE_OG_PENSJON,
  },
  KLAGE_BEH_NK: {
    kode: 'KLAGE_BEH_NK',
    skjermlenkeId: 'Klage.ResolveKlage.Title',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.KLAGE_NAV_KLAGEINSTANS,
  },
  KONTROLL_AV_SAKSOPPLYSNINGER: {
    kode: 'KONTROLL_AV_SAKSOPPLYSNINGER',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.SAKSOPPLYSNINGER,
  },
  OPPLYSNINGSPLIKT: {
    kode: 'OPPLYSNINGSPLIKT',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.OPPLYSNINGSPLIKT,
  },
  PUNKT_FOR_ADOPSJON: {
    kode: 'PUNKT_FOR_ADOPSJON',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.ADOPSJON,
  },
  PUNKT_FOR_FOEDSEL: {
    kode: 'PUNKT_FOR_FOEDSEL',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.FOEDSEL,
  },
  PUNKT_FOR_MEDLEMSKAP: {
    kode: 'PUNKT_FOR_MEDLEMSKAP',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.MEDLEMSKAP,
  },
  PUNKT_FOR_OMSORG: {
    kode: 'PUNKT_FOR_OMSORG',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.OMSORG,
  },
  PUNKT_FOR_OPPTJENING: {
    kode: 'PUNKT_FOR_OPPTJENING',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.OPPTJENING,
  },
  SOEKNADSFRIST: {
    kode: 'SOEKNADSFRIST',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.SOEKNADSFRIST,
  },
  VEDTAK: {
    kode: 'VEDTAK',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.VEDTAK,
  },
  FAKTA_OM_UTTAK: {
    kode: 'FAKTA_OM_UTTAK',
    faktaNavn: faktaPanelCodes.UTTAK,
    punktNavn: '',
  },
  UTTAK: {
    kode: 'UTTAK',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.UTTAK,
  },
  FAKTA_OM_VERGE: {
    kode: 'FAKTA_OM_VERGE',
    faktaNavn: faktaPanelCodes.VERGE,
    punktNavn: '',
  },
};

export default skjermlenkeCodes;
