import { ReactNode } from 'react';

import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import { Aksjonspunkt, Vilkar, Behandling } from '@fpsak-frontend/types';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

export abstract class ProsessStegPanelerDef {
  public getId = () => ''

  public getTekstKode = () => ''

  public abstract getKomponent(props: any): ReactNode

  public getAksjonspunktKoder = (): string[] => []

  public getAksjonspunktTekstkoder = (): string[] => []

  public getVilkarKoder = (): string[] => []

  public getEndepunkter = (): EndpointOperations[] => []

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getOverstyrVisningAvKomponent = (_data: any): boolean => false

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getOverstyrtStatus = (_data: any): boolean => undefined

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getData = (_data: any): any => ({})

  public getOverstyringspanelDef = (): ProsessStegPanelerDef => undefined

  public finnAksjonspunkterForSteg = (aksjonspunkter: Aksjonspunkt[]) => {
    const panelDef = this.skalBrukeOverstyringspanel(aksjonspunkter) ? this.getOverstyringspanelDef() : this;
    return aksjonspunkter.filter((ap) => panelDef.getAksjonspunktKoder().includes(ap.definisjon.kode));
  }

  public finnVilkarForSteg = (vilkar: Vilkar[]) => vilkar
    .filter((v) => this.getVilkarKoder().includes(v.vilkarType.kode));

  public skalBrukeOverstyringspanel = (aksjonspunkter: Aksjonspunkt[]) => this.getOverstyringspanelDef()
    && !this.getAksjonspunktKoder().some((ac) => aksjonspunkter.some((a) => a.definisjon.kode === ac))

  public skalVisePanel = (behandling: Behandling, aksjonspunkter: Aksjonspunkt[], vilkar: Vilkar[]) => {
    const panelDef = this.skalBrukeOverstyringspanel(aksjonspunkter) ? this.getOverstyringspanelDef() : this;

    const data = {
      behandling,
      aksjonspunktDefKoderForSteg: panelDef.getAksjonspunktKoder(),
      aksjonspunkterForSteg: this.finnAksjonspunkterForSteg(aksjonspunkter),
      vilkarForSteg: this.finnVilkarForSteg(vilkar),
    };

    if (panelDef.getOverstyrVisningAvKomponent(data)) {
      return true;
    }

    const harAksjonspunkter = panelDef.getAksjonspunktKoder().some((ac) => aksjonspunkter.some((a) => a.definisjon.kode === ac));
    if (panelDef.getVilkarKoder().length === 0) {
      return harAksjonspunkter;
    }

    const harVilkar = panelDef.getVilkarKoder().some((vc) => vilkar.some((v) => v.vilkarType.kode === vc));
    if (harVilkar && !harAksjonspunkter /* && panel.overridePanel */) {
      return true;
    }

    return harAksjonspunkter && harVilkar;
  }

  public harApentAksjonspunkt = (aksjonspunkter: Aksjonspunkt[], overstyrteAksjonspunktKoder: string[]) => {
    const panelDef = this.skalBrukeOverstyringspanel(aksjonspunkter) ? this.getOverstyringspanelDef() : this;
    return panelDef.getAksjonspunktKoder().some((apKode) => overstyrteAksjonspunktKoder.includes(apKode))
      || this.finnAksjonspunkterForSteg(aksjonspunkter).some((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET);
  }
}

export abstract class ProsessStegPanelDef {
  public abstract getUrlKode(): string

  public abstract getTekstKode(): string

  public abstract getPanelDefinisjoner(): ProsessStegPanelerDef[]

  public skalViseMinstEttPanelForSteg = (behandling: Behandling, aksjonspunkter: Aksjonspunkt[], vilkar: Vilkar[]) => this.getPanelDefinisjoner()
    .some((pDef) => pDef.skalVisePanel(behandling, aksjonspunkter, vilkar))

  public harMinstEttApentAksjonspunkt = (aksjonspunkter, overstyrteAksjonspunktKoder) => this.getPanelDefinisjoner()
    .some((pDef) => pDef.harApentAksjonspunkt(aksjonspunkter, overstyrteAksjonspunktKoder))
}
