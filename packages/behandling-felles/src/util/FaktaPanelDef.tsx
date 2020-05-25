import { ReactNode } from 'react';

import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';

abstract class FaktaPanelDef {
  abstract getUrlKode(): string

  abstract getTekstKode(): string

  abstract getKomponent(props: any): ReactNode

  getAksjonspunktKoder = (): string[] => []

  getEndepunkter = (): EndpointOperations[] => []

  getOverstyrVisningAvKomponent = (data: any): boolean => false

  getData = (data: any): any => ({})

  skalViseKomponent = (apCodes, utvidetEkstraPanelData) => this.getAksjonspunktKoder()
    .some((a) => apCodes.includes(a)) || this.getOverstyrVisningAvKomponent(utvidetEkstraPanelData)
}

export default FaktaPanelDef;
