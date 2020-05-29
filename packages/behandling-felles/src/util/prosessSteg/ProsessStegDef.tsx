import { ReactNode } from 'react';

import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import { Aksjonspunkt, Vilkar, Behandling } from '@fpsak-frontend/types';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

/**
 * Definerer en mal for prosess-steg. Et steg kan ha ett eller flere paneler.
 * Steget defineres av @see ProsessStegDef
 * Panel definers av @see ProsessStegPanelDef
 */

/**
 * Definerer en mal for et prosess-steg-panel. Alle panel må ha en komponent.
 */
export abstract class ProsessStegPanelDef {
  /**
   * Returnerer React-komponenten som definerer panelet
   * @param props Alle props som skal sendes med til komponenten.
   */
  public abstract getKomponent(props: any): ReactNode

  /**
   * Unik id for panelet. Må kun oppgi dette når det er flere paneler for steget.
   */
  public getId = () => ''

  /**
   * Kode som definerer tekst som skal vises som overskriften til panelet
   */
  public getTekstKode = () => ''

  /**
   * Aksjonspunktkoder som er koblet til panelet.
   */
  public getAksjonspunktKoder = (): string[] => []

  /**
   * Tekster som blir skal vises i tilknytning til aksjonspunktkodene. Kun relevant å bruke når det er flere paneler for steget.
   */
  public getAksjonspunktTekstkoder = (): string[] => []

  /**
   * Vilkarkoder som er koblet til panelet.
   */
  public getVilkarKoder = (): string[] => []

  /**
   * Data som komponent er avhengig av må defineres her slik at det kan hentes fra server
   */
  public getEndepunkter = (): EndpointOperations[] => []

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getOverstyrVisningAvKomponent = (_data: any): boolean => false

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getOverstyrtStatus = (_data: any): boolean => undefined

  /**
   * Data som skal sendes med til komponent. Dette er data som frontend allerede har tilgang til (Trenger ikke hente på nytt)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getData = (_data: any): any => ({})

  public getOverstyringspanelDef = (): ProsessStegPanelDef => undefined

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

/**
 * Definerer en mal for prosess-steget. Alle steg må ha en url-kode, en tekst-kode og minst ett tilhørende panel.
 */
export abstract class ProsessStegDef {
  /**
   * Kode som blir vist som query-param i URL. Denne koden skal defineres i @see prosessStegCodes
   */
  public abstract getUrlKode(): string

  /**
   * Kode som definerer tekst som skal vises i prosess-steg-menyen
   */
  public abstract getTekstKode(): string

  /**
   * Alle tilhørende paneler
   */
  public abstract getPanelDefinisjoner(): ProsessStegPanelDef[]

  public skalViseProsessSteg = (behandling: Behandling, aksjonspunkter: Aksjonspunkt[], vilkar: Vilkar[]) => this.getPanelDefinisjoner()
    .some((panelDef) => panelDef.skalVisePanel(behandling, aksjonspunkter, vilkar))

  public harMinstEttApentAksjonspunkt = (aksjonspunkter, overstyrteAksjonspunktKoder) => this.getPanelDefinisjoner()
    .some((panelDef) => panelDef.harApentAksjonspunkt(aksjonspunkter, overstyrteAksjonspunktKoder))
}
