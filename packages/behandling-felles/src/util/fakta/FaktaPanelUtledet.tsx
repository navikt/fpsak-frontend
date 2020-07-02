import { Aksjonspunkt, Behandling } from '@fpsak-frontend/types';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

import getAlleMerknaderFraBeslutter from '../getAlleMerknaderFraBeslutter';
import Rettigheter from '../../types/rettigheterTsType';
import readOnlyUtils from '../readOnlyUtils';
import FaktaPanelDef from './FaktaPanelDef';

class FaktaPanelUtledet {
  faktaPanelDef: FaktaPanelDef;

  behandling: Behandling;

  aksjonspunkter: Aksjonspunkt[];

  constructor(faktaPanelDef, behandling, aksjonspunkter) {
    this.faktaPanelDef = faktaPanelDef;
    this.behandling = behandling;
    this.aksjonspunkter = aksjonspunkter;
  }

  public getPanelDef = (): FaktaPanelDef => this.faktaPanelDef

  public getUrlKode = (): string => this.faktaPanelDef.getUrlKode()

  public getTekstKode = (): string => this.faktaPanelDef.getTekstKode()

  private getFiltrerteAksjonspunkter = (): Aksjonspunkt[] => this.aksjonspunkter
    .filter((ap) => this.faktaPanelDef.getAksjonspunktKoder().includes(ap.definisjon.kode))

  public getHarApneAksjonspunkter = (): boolean => this.getFiltrerteAksjonspunkter().some((ap) => isAksjonspunktOpen(ap.status.kode) && ap.kanLoses)

  public getKomponentData = (rettigheter: Rettigheter, ekstraPanelData: any, hasFetchError: boolean) => {
    const filtrerteAksjonspunkter = this.getFiltrerteAksjonspunkter();
    return {
      aksjonspunkter: filtrerteAksjonspunkter,
      readOnly: readOnlyUtils.erReadOnly(this.behandling, filtrerteAksjonspunkter, [], rettigheter, hasFetchError),
      submittable: !filtrerteAksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode)) || filtrerteAksjonspunkter.some((ap) => ap.kanLoses),
      harApneAksjonspunkter: this.getHarApneAksjonspunkter(),
      alleMerknaderFraBeslutter: getAlleMerknaderFraBeslutter(this.behandling, filtrerteAksjonspunkter),
      ...this.faktaPanelDef.getData({
        ...ekstraPanelData,
        rettigheter,
      }),
    };
  }
}

export default FaktaPanelUtledet;
