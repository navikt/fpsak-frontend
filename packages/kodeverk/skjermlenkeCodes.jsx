import behandlingspunktCodes from 'behandlingsprosess/behandlingspunktCodes';
import faktaPanelCodes from 'fakta/faktaPanelCodes';

const skjermlenkeCodes = {
  BEREGNING_ENGANGSSTOENAD: {
    kode: 'BEREGNING_ENGANGSSTOENAD',
    skjermlenkeId: 'Behandlingspunkt.Beregning',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.BEREGNING,
  },
  BEREGNING_FORELDREPENGER: {
    kode: 'BEREGNING_FORELDREPENGER',
    skjermlenkeId: 'Behandlingspunkt.BeregningForeldrepenger',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.BEREGNINGSGRUNNLAG,
  },
  FAKTA_OM_ADOPSJON: {
    kode: 'FAKTA_OM_ADOPSJON',
    skjermlenkeId: 'AdopsjonInfoPanel.Adopsjon',
    faktaNavn: faktaPanelCodes.ADOPSJONSVILKARET,
    punktNavn: '',
  },
  FAKTA_OM_BEREGNING: {
    kode: 'FAKTA_OM_BEREGNING',
    skjermlenkeId: 'BeregningInfoPanel.Title',
    faktaNavn: faktaPanelCodes.BEREGNING,
    punktNavn: '',
  },
  FAKTA_OM_FOEDSEL: {
    kode: 'FAKTA_OM_FOEDSEL',
    skjermlenkeId: 'FodselInfoPanel.Fodsel',
    faktaNavn: faktaPanelCodes.FODSELSVILKARET,
    punktNavn: '',
  },
  FAKTA_OM_MEDLEMSKAP: {
    kode: 'FAKTA_OM_MEDLEMSKAP',
    skjermlenkeId: 'MedlemskapInfoPanel.Medlemskap',
    faktaNavn: faktaPanelCodes.MEDLEMSKAPSVILKARET,
    punktNavn: '',
  },
  FAKTA_FOR_OMSORG: {
    kode: 'FAKTA_FOR_OMSORG',
    skjermlenkeId: 'Behandlingspunkt.FaktaOmOmsorg',
    faktaNavn: faktaPanelCodes.OMSORG,
    punktNavn: '',
  },
  FAKTA_FOR_OPPTJENING: {
    kode: 'FAKTA_FOR_OPPTJENING',
    skjermlenkeId: 'Behandlingspunkt.Opptjeningsvilkaret',
    faktaNavn: faktaPanelCodes.OPPTJENINGSVILKARET,
    punktNavn: '',
  },
  FAKTA_OM_OPPTJENING: {
    kode: 'FAKTA_OM_OPPTJENING',
    skjermlenkeId: 'Behandlingspunkt.FaktaOmOpptjening',
    faktaNavn: faktaPanelCodes.OPPTJENINGSVILKARET,
    punktNavn: '',
  },
  FAKTA_OM_OMSORG_OG_FORELDREANSVAR: {
    kode: 'FAKTA_OM_OMSORG_OG_FORELDREANSVAR',
    skjermlenkeId: 'Behandlingspunkt.OmsorgsvilkaretEngangsstonad',
    faktaNavn: faktaPanelCodes.OMSORGSVILKARET,
    punktNavn: '',
  },
  FAKTA_OM_ARBEIDSFORHOLD: {
    kode: 'FAKTA_OM_ARBEIDSFORHOLD',
    skjermlenkeId: 'Personspanel.Arbeidsforhold',
    faktaNavn: faktaPanelCodes.PERSON,
    punktNavn: '',
  },
  PUNKT_FOR_FORELDREANSVAR: {
    kode: 'PUNKT_FOR_FORELDREANSVAR',
    skjermlenkeId: 'Behandlingspunkt.Foreldreansvar',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.FORELDREANSVAR,
  },
  KLAGE_BEH_NFP: {
    kode: 'KLAGE_BEH_NFP',
    skjermlenkeId: 'Klage.ResolveKlage.Title',
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
    skjermlenkeId: 'Behandlingspunkt.Saksopplysninger',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.SAKSOPPLYSNINGER,
  },
  OPPLYSNINGSPLIKT: {
    kode: 'OPPLYSNINGSPLIKT',
    skjermlenkeId: 'Behandlingspunkt.Opplysningsplikt',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.OPPLYSNINGSPLIKT,
  },
  PUNKT_FOR_ADOPSJON: {
    kode: 'PUNKT_FOR_ADOPSJON',
    skjermlenkeId: 'Behandlingspunkt.Adopsjonsvilkaret',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.ADOPSJON,
  },
  PUNKT_FOR_FOEDSEL: {
    kode: 'PUNKT_FOR_FOEDSEL',
    skjermlenkeId: 'Behandlingspunkt.Fodselsvilkaret',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.FOEDSEL,
  },
  PUNKT_FOR_MEDLEMSKAP: {
    kode: 'PUNKT_FOR_MEDLEMSKAP',
    skjermlenkeId: 'Behandlingspunkt.Medlemskapsvilkaret',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.MEDLEMSKAP,
  },
  PUNKT_FOR_OMSORG: {
    kode: 'PUNKT_FOR_OMSORG',
    skjermlenkeId: 'Behandlingspunkt.Omsorgsvilkaret',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.OMSORG,
  },
  PUNKT_FOR_OPPTJENING: {
    kode: 'PUNKT_FOR_OPPTJENING',
    skjermlenkeId: 'Behandlingspunkt.Opptjeningsvilkaret',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.OPPTJENING,
  },
  SOEKNADSFRIST: {
    kode: 'SOEKNADSFRIST',
    skjermlenkeId: 'Behandlingspunkt.Soknadsfristvilkaret',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.SOEKNADSFRIST,
  },
  VEDTAK: {
    kode: 'VEDTAK',
    skjermlenkeId: 'Behandlingspunkt.Vedtak',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.VEDTAK,
  },
  FAKTA_OM_UTTAK: {
    kode: 'FAKTA_OM_UTTAK',
    skjermlenkeId: 'Behandlingspunkt.FaktaOmUttak',
    faktaNavn: faktaPanelCodes.UTTAK,
    punktNavn: '',
  },
  UTTAK: {
    kode: 'UTTAK',
    skjermlenkeId: 'Behandlingspunkt.Uttak',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: behandlingspunktCodes.UTTAK,
  },
  FAKTA_OM_VERGE: {
    kode: 'FAKTA_OM_VERGE',
    skjermlenkeId: 'Behandlingspunkt.FaktaOmVerge',
    faktaNavn: faktaPanelCodes.VERGE,
    punktNavn: '',
  },
};

export default skjermlenkeCodes;
