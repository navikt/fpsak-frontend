import React from 'react';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import VilkarresultatMedOverstyringProsessIndex from '@fpsak-frontend/prosess-vilkar-overstyring';

import { ProsessStegPanelerDef } from './ProsessStegPanelDef';

const harVilkarresultatMedOverstyring = (aksjonspunkterForSteg, aksjonspunktDefKoderForSteg) => {
  const apKoder = aksjonspunkterForSteg.map((ap) => ap.definisjon.kode);
  const harIngenApOgMulighetTilOverstyring = apKoder.length === 0 && aksjonspunktDefKoderForSteg.length > 0;
  const harApSomErOverstyringAp = apKoder.some((apCode) => aksjonspunktDefKoderForSteg.includes(apCode));
  return harIngenApOgMulighetTilOverstyring || harApSomErOverstyringAp;
};

const avslagsarsakerES = ['1002', '1003', '1032'];
const filtrerAvslagsarsaker = (avslagsarsaker, vilkarTypeKode) => (vilkarTypeKode === vilkarType.FODSELSVILKARET_MOR
  ? avslagsarsaker[vilkarTypeKode].filter((arsak) => !avslagsarsakerES.includes(arsak.kode))
  : avslagsarsaker[vilkarTypeKode]);


class ProsessStegOverstyringPanelDef extends ProsessStegPanelerDef {
  overtyrtPanel: ProsessStegPanelerDef

  aksjonspunktKoder: string[]

  constructor(overtyrtPanel, ...aksjonspunktKoder) {
    super();
    this.overtyrtPanel = overtyrtPanel;
    this.aksjonspunktKoder = aksjonspunktKoder;
  }

  getId = () => this.overtyrtPanel.getId()

  getTekstKode = () => this.overtyrtPanel.getTekstKode()

  getVilkarKoder = () => this.overtyrtPanel.getVilkarKoder()

  getOverstyrVisningAvKomponent = ({ vilkarForSteg, aksjonspunkterForSteg, aksjonspunktDefKoderForSteg }) => vilkarForSteg.length > 0
    && harVilkarresultatMedOverstyring(aksjonspunkterForSteg, aksjonspunktDefKoderForSteg)

  getKomponent = (props) => <VilkarresultatMedOverstyringProsessIndex {...props} />

  getData = ({
    vilkarForSteg, alleKodeverk, overstyrteAksjonspunktKoder, prosessStegTekstKode,
  }) => ({
    avslagsarsaker: filtrerAvslagsarsaker(alleKodeverk[kodeverkTyper.AVSLAGSARSAK], vilkarForSteg[0].vilkarType.kode),
    erOverstyrt: overstyrteAksjonspunktKoder.some((o) => this.getAksjonspunktKoder().some((a) => a === o)),
    overstyringApKode: this.getAksjonspunktKoder()[0],
    panelTittelKode: this.getTekstKode() ? this.getTekstKode() : prosessStegTekstKode,
    erMedlemskapsPanel: this.getId() === 'MEDLEMSKAP',
    lovReferanse: vilkarForSteg.length > 0 ? vilkarForSteg[0].lovReferanse : undefined,
  })

  getAksjonspunktKoder = () => this.aksjonspunktKoder;
}

export default ProsessStegOverstyringPanelDef;
