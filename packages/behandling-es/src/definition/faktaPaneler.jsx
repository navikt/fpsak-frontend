import React from 'react';

import MedlemskapFaktaIndex from '@fpsak-frontend/fakta-medlemskap';
import FodselFaktaIndex from '@fpsak-frontend/fakta-fodsel';
import { fodselsvilkarene } from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import TilleggsopplysningerFaktaIndex from '@fpsak-frontend/fakta-tilleggsopplysninger';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import esBehandlingApi from '../data/esBehandlingApi';

const faktaPaneler = [{
  textCode: 'ArbeidsforholdInfoPanel.Title',
  urlCode: faktaPanelCodes.ARBEIDSFORHOLD,
  aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD],
  endpoints: [],
  renderComponent: (props) => <ArbeidsforholdFaktaIndex {...props} />,
  showComponent: ({ personopplysninger }) => personopplysninger,
  getExtraData: ({ personopplysninger, inntektArbeidYtelse }) => ({ personopplysninger, inntektArbeidYtelse }),
}, {
  textCode: 'TilleggsopplysningerInfoPanel.Tilleggsopplysninger',
  urlCode: faktaPanelCodes.TILLEGGSOPPLYSNINGER,
  aksjonspunkterCodes: [aksjonspunktCodes.TILLEGGSOPPLYSNINGER],
  endpoints: [],
  renderComponent: (props) => <TilleggsopplysningerFaktaIndex {...props} />,
  showComponent: () => false,
  getExtraData: ({ soknad }) => ({ soknad }),
}, {
  textCode: 'FodselInfoPanel.Fodsel',
  urlCode: faktaPanelCodes.FODSELSVILKARET,
  aksjonspunkterCodes: [aksjonspunktCodes.TERMINBEKREFTELSE, aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL,
    aksjonspunktCodes.VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT],
  endpoints: [esBehandlingApi.FAMILIEHENDELSE, esBehandlingApi.FAMILIEHENDELSE_ORIGINAL_BEHANDLING, esBehandlingApi.SOKNAD_ORIGINAL_BEHANDLING],
  renderComponent: (props) => <FodselFaktaIndex {...props} />,
  showComponent: ({ vilkarListe }) => vilkarListe.some((vilkar) => fodselsvilkarene.includes(vilkar.vilkarType.kode)),
  getExtraData: ({ personopplysninger, soknad }) => ({ personopplysninger, soknad }),
}, {
  textCode: 'MedlemskapInfoPanel.Medlemskap',
  urlCode: faktaPanelCodes.MEDLEMSKAPSVILKARET,
  aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN, aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
    aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE, aksjonspunktCodes.AVKLAR_OPPHOLDSRETT, aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
    aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP, aksjonspunktCodes.OVERSTYR_AVKLAR_STARTDATO],
  endpoints: [esBehandlingApi.MEDLEMSKAP, esBehandlingApi.MEDLEMSKAP_V2],
  renderComponent: (props) => <MedlemskapFaktaIndex {...props} />,
  showComponent: ({ personopplysninger, soknad }) => personopplysninger && soknad,
  getExtraData: ({
    fagsak, personopplysninger, inntektArbeidYtelse, soknad,
  }) => ({
    isForeldrepengerFagsak: fagsak.fagsakYtelseType.kode === fagsakYtelseType.FORELDREPENGER,
    fagsakPerson: fagsak.fagsakPerson,
    personopplysninger,
    inntektArbeidYtelse,
    soknad,
  }),
}];

export default faktaPaneler;
