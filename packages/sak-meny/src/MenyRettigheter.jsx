class MenyRettigheter {
  constructor(rettigheter) {
    this.$$henleggBehandlingAccess = rettigheter.henleggBehandlingAccess;
    this.$$settBehandlingPaVentAccess = rettigheter.settBehandlingPaVentAccess;
    this.$$byttBehandlendeEnhetAccess = rettigheter.byttBehandlendeEnhetAccess;
    this.$$opprettRevurderingAccess = rettigheter.opprettRevurderingAccess;
    this.$$opprettNyForstegangsBehandlingAccess = rettigheter.opprettNyForstegangsBehandlingAccess;
    this.$$gjenopptaBehandlingAccess = rettigheter.gjenopptaBehandlingAccess;
    this.$$opneBehandlingForEndringerAccess = rettigheter.opneBehandlingForEndringerAccess;
    this.$$ikkeVisOpprettNyBehandling = rettigheter.ikkeVisOpprettNyBehandling;
  }

  get henleggBehandlingAccess() {
    return this.$$henleggBehandlingAccess;
  }

  get settBehandlingPaVentAccess() {
    return this.$$settBehandlingPaVentAccess;
  }

  get byttBehandlendeEnhetAccess() {
    return this.$$byttBehandlendeEnhetAccess;
  }

  get opprettRevurderingAccess() {
    return this.$$opprettRevurderingAccess;
  }

  get opprettNyForstegangsBehandlingAccess() {
    return this.$$opprettNyForstegangsBehandlingAccess;
  }

  get gjenopptaBehandlingAccess() {
    return this.$$gjenopptaBehandlingAccess;
  }

  get opneBehandlingForEndringerAccess() {
    return this.$$opneBehandlingForEndringerAccess;
  }

  get ikkeVisOpprettNyBehandling() {
    return this.$$ikkeVisOpprettNyBehandling;
  }
}

export default MenyRettigheter;
