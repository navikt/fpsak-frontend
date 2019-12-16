/**
 * Denne brukers til å utføre operasjoner på behandling utenfor behandlingskonteksten.
 */
class BehandlingEventHandler {
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
}

export default new BehandlingEventHandler();
