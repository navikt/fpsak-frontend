class BehandlingIdentifier {
  constructor(saksnummer, behandlingId) {
    this.$$saksnummer = saksnummer;
    this.$$behandlingId = behandlingId;
  }

  get saksnummer() {
    return this.$$saksnummer;
  }

  get behandlingId() {
    return this.$$behandlingId;
  }

  toJson() {
    return {
      behandlingId: this.$$behandlingId,
      saksnummer: `${this.$$saksnummer}`,
    };
  }
}

export default BehandlingIdentifier;
