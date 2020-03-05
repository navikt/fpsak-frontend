import React from 'react';

import AdopsjonFaktaIndex from '@fpsak-frontend/fakta-adopsjon';
import VergeFaktaIndex from '@fpsak-frontend/fakta-verge';
import MedlemskapFaktaIndex from '@fpsak-frontend/fakta-medlemskap';
import FodselFaktaIndex from '@fpsak-frontend/fakta-fodsel';
import vilkarType, { fodselsvilkarene, adopsjonsvilkarene } from '@fpsak-frontend/kodeverk/src/vilkarType';
import FordelBeregningsgrunnlagFaktaIndex from '@fpsak-frontend/fakta-fordel-beregningsgrunnlag';
import YtelserFaktaIndex from '@fpsak-frontend/fakta-ytelser';
import SakenFaktaIndex from '@fpsak-frontend/fakta-saken';
import UttakFaktaIndex from '@fpsak-frontend/fakta-uttak';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import OmsorgOgForeldreansvarFaktaIndex from '@fpsak-frontend/fakta-omsorg-og-foreldreansvar';
import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import OpptjeningFaktaIndex from '@fpsak-frontend/fakta-opptjening';
import TilleggsopplysningerFaktaIndex from '@fpsak-frontend/fakta-tilleggsopplysninger';
import BeregningFaktaIndex from '@fpsak-frontend/fakta-beregning';
import OmsorgFaktaIndex from '@fpsak-frontend/fakta-omsorg';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';

import { readOnlyUtils } from '@fpsak-frontend/behandling-felles';

import fpBehandlingApi from '../data/fpBehandlingApi';

const faktaPanelDefinisjoner = [{
  urlCode: faktaPanelCodes.SAKEN,
  textCode: 'SakenFaktaPanel.Title',
  aksjonspunkterCodes: [aksjonspunktCodes.AUTOMATISK_MARKERING_AV_UTENLANDSSAK, aksjonspunktCodes.MANUELL_MARKERING_AV_UTLAND_SAKSTYPE],
  endpoints: [fpBehandlingApi.UTLAND_DOK_STATUS],
  renderComponent: (props) => <SakenFaktaIndex {...props} />,
  showComponent: () => true,
  getData: () => ({}),
}, {
  urlCode: faktaPanelCodes.ARBEIDSFORHOLD,
  textCode: 'ArbeidsforholdInfoPanel.Title',
  aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD],
  endpoints: [],
  renderComponent: (props) => <ArbeidsforholdFaktaIndex {...props} />,
  showComponent: ({ personopplysninger }) => personopplysninger,
  getData: ({ personopplysninger, inntektArbeidYtelse }) => ({ personopplysninger, inntektArbeidYtelse }),
},
{
  urlCode: faktaPanelCodes.YTELSER,
  textCode: 'YtelserFaktaIndex.Ytelser',
  aksjonspunkterCodes: [],
  endpoints: [],
  renderComponent: (props) => <YtelserFaktaIndex {...props} />,
  showComponent: ({ inntektArbeidYtelse }) => inntektArbeidYtelse
      && inntektArbeidYtelse.relatertTilgrensendeYtelserForSoker
      && inntektArbeidYtelse.relatertTilgrensendeYtelserForSoker.length > 0,
  getData: ({ inntektArbeidYtelse }) => ({ inntektArbeidYtelse }),
},
{
  urlCode: faktaPanelCodes.VERGE,
  textCode: 'RegistrereVergeInfoPanel.Info',
  aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_VERGE],
  endpoints: [fpBehandlingApi.VERGE],
  renderComponent: (props) => <VergeFaktaIndex {...props} />,
  showComponent: () => false,
  getData: () => ({}),
},
{
  urlCode: faktaPanelCodes.TILLEGGSOPPLYSNINGER,
  textCode: 'TilleggsopplysningerInfoPanel.Tilleggsopplysninger',
  aksjonspunkterCodes: [aksjonspunktCodes.TILLEGGSOPPLYSNINGER],
  endpoints: [],
  renderComponent: (props) => <TilleggsopplysningerFaktaIndex {...props} />,
  showComponent: () => false,
  getData: ({ soknad }) => ({ soknad }),
},
{
  urlCode: faktaPanelCodes.OMSORGSVILKARET,
  textCode: 'OmsorgOgForeldreansvarInfoPanel.Omsorg',
  aksjonspunkterCodes: [aksjonspunktCodes.OMSORGSOVERTAKELSE, aksjonspunktCodes.AVKLAR_VILKAR_FOR_FORELDREANSVAR],
  endpoints: [fpBehandlingApi.FAMILIEHENDELSE],
  renderComponent: (props) => <OmsorgOgForeldreansvarFaktaIndex {...props} />,
  showComponent: () => false,
  getData: ({ soknad, personopplysninger, inntektArbeidYtelse }) => ({
    soknad,
    personopplysninger,
    inntektArbeidYtelse,
  }),
},
{
  urlCode: faktaPanelCodes.ADOPSJONSVILKARET,
  textCode: 'AdopsjonInfoPanel.Adopsjon',
  aksjonspunkterCodes: [
    aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE,
    aksjonspunktCodes.ADOPSJONSDOKUMENTAJON,
    aksjonspunktCodes.OM_ADOPSJON_GJELDER_EKTEFELLES_BARN,
  ],
  endpoints: [fpBehandlingApi.FAMILIEHENDELSE],
  renderComponent: (props) => <AdopsjonFaktaIndex {...props} />,
  showComponent: ({ vilkar }) => vilkar.some((v) => adopsjonsvilkarene.includes(v.vilkarType.kode)),
  getData: ({ soknad, personopplysninger }) => ({
    isForeldrepengerFagsak: true,
    soknad,
    personopplysninger,
  }),
},
{
  urlCode: faktaPanelCodes.FODSELSVILKARET,
  textCode: 'FodselInfoPanel.Fodsel',
  aksjonspunkterCodes: [
    aksjonspunktCodes.TERMINBEKREFTELSE,
    aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL,
    aksjonspunktCodes.VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT,
  ],
  endpoints: [
    fpBehandlingApi.FAMILIEHENDELSE,
    fpBehandlingApi.FAMILIEHENDELSE_ORIGINAL_BEHANDLING,
    fpBehandlingApi.SOKNAD_ORIGINAL_BEHANDLING,
  ],
  renderComponent: (props) => <FodselFaktaIndex {...props} />,
  showComponent: ({ vilkar }) => vilkar.some((v) => fodselsvilkarene.includes(v.vilkarType.kode)),
  getData: ({ soknad, personopplysninger }) => ({ soknad, personopplysninger }),
},
{
  urlCode: faktaPanelCodes.MEDLEMSKAPSVILKARET,
  textCode: 'MedlemskapInfoPanel.Medlemskap',
  aksjonspunkterCodes: [
    aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN,
    aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
    aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
    aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
    aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
    aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP,
    aksjonspunktCodes.OVERSTYR_AVKLAR_STARTDATO,
  ],
  endpoints: [fpBehandlingApi.MEDLEMSKAP, fpBehandlingApi.MEDLEMSKAP_V2],
  renderComponent: (props) => <MedlemskapFaktaIndex {...props} />,
  showComponent: ({ personopplysninger, soknad }) => personopplysninger && soknad,
  getData: ({
    fagsak, behandling, hasFetchError, soknad, personopplysninger, inntektArbeidYtelse,
  }) => ({
    isForeldrepengerFagsak: true,
    fagsakPerson: fagsak.fagsakPerson,
    readOnlyBehandling: hasFetchError || readOnlyUtils.harBehandlingReadOnlyStatus(behandling),
    soknad,
    personopplysninger,
    inntektArbeidYtelse,
  }),
},
{
  urlCode: faktaPanelCodes.OPPTJENINGSVILKARET,
  textCode: 'OpptjeningInfoPanel.KontrollerFaktaForOpptjening',
  aksjonspunkterCodes: [aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING],
  endpoints: [fpBehandlingApi.OPPTJENING, fpBehandlingApi.UTLAND_DOK_STATUS],
  renderComponent: (props) => <OpptjeningFaktaIndex {...props} />,
  showComponent: ({ vilkar }) => vilkar.some((v) => v.vilkarType.kode === vilkarType.OPPTJENINGSVILKARET)
      && vilkar.some(
        (v) => v.vilkarType.kode === vilkarType.MEDLEMSKAPSVILKARET && v.vilkarStatus.kode === vilkarUtfallType.OPPFYLT,
      ),
  getData: () => ({}),
},
{
  urlCode: faktaPanelCodes.BEREGNING,
  textCode: 'BeregningInfoPanel.Title',
  aksjonspunkterCodes: [
    aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
    aksjonspunktCodes.AVKLAR_AKTIVITETER,
    aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
    aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
  ],
  endpoints: [],
  renderComponent: (props) => <BeregningFaktaIndex {...props} />,
  showComponent: ({ beregningsgrunnlag }) => beregningsgrunnlag,
  getData: ({ rettigheter, beregningsgrunnlag }) => ({
    erOverstyrer: rettigheter.kanOverstyreAccess.isEnabled,
    beregningsgrunnlag,
  }),
},
{
  urlCode: faktaPanelCodes.FORDELING,
  textCode: 'FordelBeregningsgrunnlag.Title',
  aksjonspunkterCodes: [aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG],
  endpoints: [],
  renderComponent: (props) => <FordelBeregningsgrunnlagFaktaIndex {...props} />,
  showComponent: () => false,
  getData: ({ beregningsgrunnlag }) => ({ beregningsgrunnlag }),
},
{
  urlCode: faktaPanelCodes.OMSORG,
  textCode: 'OmsorgInfoPanel.Omsorg',
  aksjonspunkterCodes: [
    aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG,
    aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG,
  ],
  endpoints: [],
  renderComponent: (props) => <OmsorgFaktaIndex {...props} />,
  showComponent: () => false,
  getData: ({ ytelsefordeling, personopplysninger, soknad }) => ({ ytelsefordeling, personopplysninger, soknad }),
},
{
  urlCode: faktaPanelCodes.UTTAK,
  textCode: 'UttakInfoPanel.FaktaUttak',
  aksjonspunkterCodes: [
    aksjonspunktCodes.AVKLAR_UTTAK,
    aksjonspunktCodes.AVKLAR_FØRSTE_UTTAKSDATO,
    aksjonspunktCodes.ANNEN_FORELDER_IKKE_RETT_OG_LØPENDE_VEDTAK,
    aksjonspunktCodes.AVKLAR_ANNEN_FORELDER_RETT,
    aksjonspunktCodes.MANUELL_AVKLAR_FAKTA_UTTAK,
    aksjonspunktCodes.OVERSTYR_AVKLAR_FAKTA_UTTAK,
    aksjonspunktCodes.AVKLAR_FAKTA_UTTAK_GRADERING_UKJENT_AKTIVITET,
    aksjonspunktCodes.AVKLAR_FAKTA_UTTAK_GRADERING_AKTIVITET_UTEN_BEREGNINGSGRUNNLAG,
  ],
  endpoints: [
    fpBehandlingApi.UTTAK_KONTROLLER_FAKTA_PERIODER,
    fpBehandlingApi.FAKTA_ARBEIDSFORHOLD,
    fpBehandlingApi.FAMILIEHENDELSE,
  ],
  renderComponent: (props) => <UttakFaktaIndex {...props} />,
  showComponent: ({ personopplysninger, ytelsefordeling }) => ytelsefordeling
      && ytelsefordeling.endringsdato !== undefined
      && personopplysninger !== null
      && personopplysninger !== undefined,
  getData: ({ rettigheter, ytelsefordeling, personopplysninger }) => ({
    kanOverstyre: rettigheter.kanOverstyreAccess.isEnabled,
    ytelsefordeling,
    personopplysninger,
  }),
}];

export default faktaPanelDefinisjoner;
