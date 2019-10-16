class MenyBehandlingData {
  $$harValgtBehandling = true;

  $$erPaVent = false;

  $$erKoet = false;

  constructor(id, uuid, versjon, type, erPaVent, erKoet, behandlendeEnhetId, behandlendeEnhetNavn) {
    this.$$id = id;
    this.$$uuid = uuid;
    this.$$versjon = versjon;
    this.$$type = type;
    this.$$erPaVent = erPaVent;
    this.$$erKoet = erKoet;
    this.$$behandlendeEnhetId = behandlendeEnhetId;
    this.$$behandlendeEnhetNavn = behandlendeEnhetNavn;
  }

  static lagIngenValgtBehandling() {
    const data = new MenyBehandlingData();
    data.$$harValgtBehandling = false;
    return data;
  }

  get id() {
    return this.$$id;
  }

  get uuid() {
    return this.$$uuid;
  }

  get versjon() {
    return this.$$versjon;
  }

  get type() {
    return this.$$type;
  }

  get erPaVent() {
    return this.$$erPaVent;
  }

  get erKoet() {
    return this.$$erKoet;
  }

  get behandlendeEnhetId() {
    return this.$$behandlendeEnhetId;
  }

  get behandlendeEnhetNavn() {
    return this.$$behandlendeEnhetNavn;
  }

  get harValgtBehandling() {
    return this.$$harValgtBehandling;
  }
}

export default MenyBehandlingData;
