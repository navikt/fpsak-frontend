import { SetStateAction } from 'react';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Aksjonspunkt, Vilkar } from '@fpsak-frontend/types';
import aksjonspunktStatus, { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

import { ProsessStegDef, ProsessStegPanelDef } from './ProsessStegDef';

const finnStatus = (vilkar: Vilkar[], aksjonspunkter: Aksjonspunkt[]) => {
  if (vilkar.length > 0) {
    const vilkarStatusCodes = vilkar.map((v) => v.vilkarStatus.kode);
    if (vilkarStatusCodes.some((vsc) => vsc === vilkarUtfallType.IKKE_VURDERT)) {
      return vilkarUtfallType.IKKE_VURDERT;
    }
    return vilkarStatusCodes.every((vsc) => vsc === vilkarUtfallType.OPPFYLT) ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_OPPFYLT;
  }

  if (aksjonspunkter.length > 0) {
    return aksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode)) ? vilkarUtfallType.IKKE_VURDERT : vilkarUtfallType.OPPFYLT;
  }
  return vilkarUtfallType.IKKE_VURDERT;
};

export class ProsessStegDelPanelUtledet {
  prosessStegPanelDef: ProsessStegDef;

  prosessStegDelPanelDef: ProsessStegPanelDef

  isReadOnlyCheck: (aksjonspunkterForPanel: Aksjonspunkt[], vilkarForPanel: Vilkar[]) => boolean

  aksjonspunkter: Aksjonspunkt[]

  vilkar: Vilkar[]

  panelData: {}

  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void

  kanOverstyreAccess: { isEnabled: boolean; employeeHasAccess: boolean }

  overstyrteAksjonspunktKoder: string[]

  constructor(
    prosessStegPanelDef: ProsessStegDef,
    prosessStegDelPanelDef: ProsessStegPanelDef,
    isReadOnlyCheck: (aksjonspunkterForPanel: Aksjonspunkt[], vilkarForPanel: Vilkar[]) => boolean,
    aksjonspunkter: Aksjonspunkt[],
    vilkar: Vilkar[],
    panelData: {},
    toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void,
    kanOverstyreAccess: { isEnabled: boolean; employeeHasAccess: boolean },
    overstyrteAksjonspunktKoder: string[],
  ) {
    this.prosessStegPanelDef = prosessStegPanelDef;
    this.prosessStegDelPanelDef = prosessStegDelPanelDef;
    this.isReadOnlyCheck = isReadOnlyCheck;
    this.aksjonspunkter = aksjonspunkter;
    this.vilkar = vilkar;
    this.panelData = panelData;
    this.toggleOverstyring = toggleOverstyring;
    this.kanOverstyreAccess = kanOverstyreAccess;
    this.overstyrteAksjonspunktKoder = overstyrteAksjonspunktKoder;
  }

  public getId = () => this.prosessStegDelPanelDef.getId()

  public getProsessStegDelPanelDef = () => this.prosessStegDelPanelDef

  public getAksjonspunkterForPanel = () => this.prosessStegDelPanelDef.finnAksjonspunkterForSteg(this.aksjonspunkter)

  private getVilkarForPanel = () => this.prosessStegDelPanelDef.finnVilkarForSteg(this.vilkar)

  public getStatus = () => {
    const overstyrtStatus = this.prosessStegDelPanelDef.getOverstyrtStatus({
      ...this.panelData,
      aksjonspunkterForSteg: this.getAksjonspunkterForPanel(),
      vilkarForSteg: this.getVilkarForPanel(),
    });
    const vilkarForSteg = this.prosessStegDelPanelDef.finnVilkarForSteg(this.vilkar);
    return overstyrtStatus || finnStatus(vilkarForSteg, this.getAksjonspunkterForPanel());
  }

  public getAksjonspunktHjelpetekster = () => {
    const opneAksjonspunkter = this.getAksjonspunkterForPanel().filter((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET && ap.kanLoses);
    const indekser = opneAksjonspunkter.map((a) => this.prosessStegDelPanelDef.getAksjonspunktKoder().findIndex((ac) => a.definisjon.kode === ac));
    return this.prosessStegDelPanelDef.getAksjonspunktTekstkoder().filter((a, index) => indekser.includes(index));
  }

  public getErAksjonspunktOpen = (): boolean => {
    const opneAksjonspunkter = this.getAksjonspunkterForPanel().filter((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET && ap.kanLoses);
    return this.prosessStegDelPanelDef.getAksjonspunktKoder().some((a) => this.overstyrteAksjonspunktKoder.includes(a))
        || opneAksjonspunkter.length > 0;
  }

  public getErReadOnly = (): boolean => this.isReadOnlyCheck(this.getAksjonspunkterForPanel(), this.getVilkarForPanel())

  public getKomponentData = () => {
    const status = this.getStatus();
    const aksjonspunkterForPanel = this.getAksjonspunkterForPanel();
    const erAksjonspunktOpent = this.getErAksjonspunktOpen();
    const vilkarForPanel = this.getVilkarForPanel();
    const erReadOnly = this.getErReadOnly();
    const harMinstEttPanelApentAksjonspunkt = this.prosessStegPanelDef.harMinstEttApentAksjonspunkt(this.aksjonspunkter, this.overstyrteAksjonspunktKoder);

    return {
      status,
      isReadOnly: erReadOnly,
      readOnlySubmitButton: (!(aksjonspunkterForPanel.some((ap) => ap.kanLoses)) || vilkarUtfallType.OPPFYLT === status),
      aksjonspunkter: aksjonspunkterForPanel,
      vilkar: vilkarForPanel,
      isAksjonspunktOpen: erAksjonspunktOpent,
      ...this.prosessStegDelPanelDef.getData({
        ...this.panelData,
        aksjonspunkterForSteg: aksjonspunkterForPanel,
        vilkarForSteg: vilkarForPanel,
        overstyrteAksjonspunktKoder: this.overstyrteAksjonspunktKoder,
        prosessStegTekstKode: this.prosessStegDelPanelDef.getTekstKode() || this.prosessStegPanelDef.getTekstKode(),
        overrideReadOnly: erReadOnly || (harMinstEttPanelApentAksjonspunkt && !erAksjonspunktOpent),
        kanOverstyreAccess: this.kanOverstyreAccess,
        toggleOverstyring: this.toggleOverstyring,
      }),
    };
  }
}

export class ProsessStegPanelUtledet {
  prosessStegPanelDef: ProsessStegDef;

  delPaneler: ProsessStegDelPanelUtledet[];

  constructor(prosessStegPanelDef: ProsessStegDef, delPaneler: ProsessStegDelPanelUtledet[]) {
    this.prosessStegPanelDef = prosessStegPanelDef;
    this.delPaneler = delPaneler;
  }

  public getUrlKode = (): string => this.prosessStegPanelDef.getUrlKode()

  public getTekstKode = (): string => this.prosessStegPanelDef.getTekstKode()

  private harMinstEttDelPanelStatus = (vuType: string): boolean => this.delPaneler.some((p) => p.getStatus() === vuType)

  public getStatus = () => {
    const harStatusIkkeVurdert = this.harMinstEttDelPanelStatus(vilkarUtfallType.IKKE_VURDERT);
    const harStatusOppfylt = this.harMinstEttDelPanelStatus(vilkarUtfallType.OPPFYLT);
    const tempStatus = harStatusOppfylt && !harStatusIkkeVurdert ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_VURDERT;
    return this.harMinstEttDelPanelStatus(vilkarUtfallType.IKKE_OPPFYLT) ? vilkarUtfallType.IKKE_OPPFYLT : tempStatus;
  }

  public getErAksjonspunktOpen = (): boolean => {
    const harUlikeStatuserIPanelene = this.harMinstEttDelPanelStatus(vilkarUtfallType.IKKE_VURDERT)
      && this.harMinstEttDelPanelStatus(vilkarUtfallType.IKKE_OPPFYLT)
      && !this.harMinstEttDelPanelStatus(vilkarUtfallType.IKKE_OPPFYLT);
    return harUlikeStatuserIPanelene || this.delPaneler.some((p) => p.getErAksjonspunktOpen());
  }

  public getErStegBehandlet = (): boolean => this.getStatus() !== vilkarUtfallType.IKKE_VURDERT || this.getErAksjonspunktOpen()

  public getAksjonspunkter = (): Aksjonspunkt[] => this.delPaneler
    .filter((pd) => pd.getAksjonspunkterForPanel()).reduce((acc, pd) => [...acc, ...pd.getAksjonspunkterForPanel()], [])

  public getErReadOnly = (): boolean => this.delPaneler.every((p) => p.getErReadOnly())

  public getDelPaneler = (): ProsessStegDelPanelUtledet[] => this.delPaneler
}
