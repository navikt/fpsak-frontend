/**
 * Denne brukers til å utføre operasjoner på behandling utenfor behandlingskonteksten.
 */
class BehandlingEventHandler {
    handler?: {[key: string]: (params: any) => Promise<any> }

    setHandler = (handler) => {
      this.handler = handler;
    }

    clear = () => {
      this.handler = undefined;
    }

    endreBehandlendeEnhet = (params) => this.handler.endreBehandlendeEnhet(params);

    settBehandlingPaVent = (params) => this.handler.settBehandlingPaVent(params);

    taBehandlingAvVent = (params) => this.handler.taBehandlingAvVent(params);

    henleggBehandling = (params) => this.handler.henleggBehandling(params);

    opneBehandlingForEndringer = (params) => this.handler.opneBehandlingForEndringer(params);

    opprettVerge = (params) => this.handler.opprettVerge(params);

    fjernVerge = (params) => this.handler.fjernVerge(params);

    lagreRisikoklassifiseringAksjonspunkt = (params) => this.handler.lagreRisikoklassifiseringAksjonspunkt(params);
}

export default new BehandlingEventHandler();
