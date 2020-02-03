import React from 'react';

import VergeFaktaIndex from '@fpsak-frontend/fakta-verge';
import MedlemskapFaktaIndex from '@fpsak-frontend/fakta-medlemskap';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import YtelserFaktaIndex from '@fpsak-frontend/fakta-ytelser';
import FordelBeregningsgrunnlagFaktaIndex from '@fpsak-frontend/fakta-fordel-beregningsgrunnlag';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import OpptjeningFaktaIndex from '@fpsak-frontend/fakta-opptjening';
import FodselOgTilretteleggingFaktaIndex from '@fpsak-frontend/fakta-fodsel-og-tilrettelegging';
import TilleggsopplysningerFaktaIndex from '@fpsak-frontend/fakta-tilleggsopplysninger';
import BeregningFaktaIndex from '@fpsak-frontend/fakta-beregning';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';

import { readOnlyUtils } from '@fpsak-frontend/behandling-felles';

import svpBehandlingApi from '../data/svpBehandlingApi';

const faktaPanelDefinisjoner = [{
  urlCode: faktaPanelCodes.ARBEIDSFORHOLD,
  textCode: 'ArbeidsforholdInfoPanel.Title',
  aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD],
  endpoints: [],
  renderComponent: (props) => <ArbeidsforholdFaktaIndex {...props} />,
  showComponent: ({ personopplysninger }) => personopplysninger,
  getData: ({ inntektArbeidYtelse, personopplysninger }) => ({ inntektArbeidYtelse, personopplysninger }),
}, {
  urlCode: faktaPanelCodes.YTELSER,
  textCode: 'YtelserFaktaIndex.Ytelser',
  aksjonspunkterCodes: [],
  endpoints: [],
  renderComponent: (props) => <YtelserFaktaIndex {...props} />,
  showComponent: ({ inntektArbeidYtelse }) => inntektArbeidYtelse
    && inntektArbeidYtelse.relatertTilgrensendeYtelserForSoker && inntektArbeidYtelse.relatertTilgrensendeYtelserForSoker.length > 0,
  getData: ({ inntektArbeidYtelse }) => ({ inntektArbeidYtelse }),
}, {
  urlCode: faktaPanelCodes.VERGE,
  textCode: 'RegistrereVergeInfoPanel.Info',
  aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_VERGE],
  endpoints: [svpBehandlingApi.VERGE],
  renderComponent: (props) => <VergeFaktaIndex {...props} />,
  showComponent: () => false,
  getData: () => ({}),
}, {
  urlCode: faktaPanelCodes.TILLEGGSOPPLYSNINGER,
  textCode: 'TilleggsopplysningerInfoPanel.Tilleggsopplysninger',
  aksjonspunkterCodes: [aksjonspunktCodes.TILLEGGSOPPLYSNINGER],
  endpoints: [],
  renderComponent: (props) => <TilleggsopplysningerFaktaIndex {...props} />,
  showComponent: () => false,
  getData: ({ soknad }) => ({ soknad }),
}, {
  urlCode: faktaPanelCodes.FODSELTILRETTELEGGING,
  textCode: 'FodselOgTilretteleggingInfoPanel.FaktaFodselOgTilrettelegging',
  aksjonspunkterCodes: [aksjonspunktCodes.FODSELTILRETTELEGGING],
  endpoints: [svpBehandlingApi.SVANGERSKAPSPENGER_TILRETTELEGGING],
  renderComponent: (props) => <FodselOgTilretteleggingFaktaIndex {...props} />,
  showComponent: () => false,
  getData: ({ inntektArbeidYtelse }) => ({ inntektArbeidYtelse }),
}, {
  urlCode: faktaPanelCodes.MEDLEMSKAPSVILKARET,
  textCode: 'MedlemskapInfoPanel.Medlemskap',
  aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN, aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
    aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE, aksjonspunktCodes.AVKLAR_OPPHOLDSRETT, aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
    aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP, aksjonspunktCodes.OVERSTYR_AVKLAR_STARTDATO],
  endpoints: [svpBehandlingApi.MEDLEMSKAP, svpBehandlingApi.MEDLEMSKAP_V2],
  renderComponent: (props) => <MedlemskapFaktaIndex {...props} />,
  showComponent: ({ personopplysninger, soknad }) => personopplysninger && soknad,
  getData: ({
    fagsak, behandling, hasFetchError, personopplysninger, soknad, inntektArbeidYtelse,
  }) => ({
    personopplysninger,
    soknad,
    inntektArbeidYtelse,
    isForeldrepengerFagsak: false,
    fagsakPerson: fagsak.fagsakPerson,
    readOnlyBehandling: hasFetchError || readOnlyUtils.harBehandlingReadOnlyStatus(behandling),
  }),
}, {
  urlCode: faktaPanelCodes.OPPTJENINGSVILKARET,
  textCode: 'OpptjeningInfoPanel.KontrollerFaktaForOpptjening',
  aksjonspunkterCodes: [aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING],
  endpoints: [svpBehandlingApi.OPPTJENING],
  renderComponent: (props) => <OpptjeningFaktaIndex {...props} />,
  showComponent: ({ vilkar }) => vilkar.some((v) => v.vilkarType.kode === vilkarType.OPPTJENINGSVILKARET)
    && vilkar.some((v) => v.vilkarType.kode === vilkarType.MEDLEMSKAPSVILKARET && v.vilkarStatus.kode === vilkarUtfallType.OPPFYLT),
  getData: () => ({}),
}, {
  urlCode: faktaPanelCodes.BEREGNING,
  textCode: 'BeregningInfoPanel.Title',
  aksjonspunkterCodes: [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN, aksjonspunktCodes.AVKLAR_AKTIVITETER,
    aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG],
  endpoints: [],
  renderComponent: (props) => <BeregningFaktaIndex {...props} />,
  showComponent: ({ beregningsgrunnlag }) => beregningsgrunnlag,
  getData: ({ rettigheter, beregningsgrunnlag }) => ({ erOverstyrer: rettigheter.kanOverstyreAccess.isEnabled, beregningsgrunnlag }),
}, {
  urlCode: faktaPanelCodes.FORDELING,
  textCode: 'FordelBeregningsgrunnlag.Title',
  aksjonspunkterCodes: [aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG],
  endpoints: [],
  renderComponent: (props) => <FordelBeregningsgrunnlagFaktaIndex {...props} />,
  showComponent: () => false,
  getData: ({ beregningsgrunnlag }) => ({ beregningsgrunnlag }),
}];

export default faktaPanelDefinisjoner;
