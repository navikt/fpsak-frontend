class BehandlingsprosessIndexProps {
  constructor(fagsakYtelseType, isSelectedBehandlingHenlagt, behandlingIdentifier, behandlingVersjon, behandlingspunkter, defaultBehandlingspunkt,
    selectedBehandlingspunkt, resolveProsessAksjonspunkterSuccess, behandlingStatus, behandlingsresultat,
    getBehandlingspunkterStatus, getBehandlingspunkterTitleCodes, getAksjonspunkterOpenStatus,
    fetchPreviewBrev, resolveProsessAksjonspunkter, resetBehandlingspunkter) {
    this.$$fagsakYtelseType = fagsakYtelseType;
    this.$$isSelectedBehandlingHenlagt = isSelectedBehandlingHenlagt;
    this.$$behandlingIdentifier = behandlingIdentifier;
    this.$$behandlingVersjon = behandlingVersjon;
    this.$$behandlingspunkter = behandlingspunkter;
    this.$$defaultBehandlingspunkt = defaultBehandlingspunkt;
    this.$$selectedBehandlingspunkt = selectedBehandlingspunkt;
    this.$$resolveProsessAksjonspunkterSuccess = resolveProsessAksjonspunkterSuccess;
    this.$$behandlingStatus = behandlingStatus;
    this.$$behandlingsresultat = behandlingsresultat;
    this.$$getBehandlingspunkterStatus = getBehandlingspunkterStatus;
    this.$$getBehandlingspunkterTitleCodes = getBehandlingspunkterTitleCodes;
    this.$$getAksjonspunkterOpenStatus = getAksjonspunkterOpenStatus;
    this.$$fetchPreviewBrev = fetchPreviewBrev;
    this.$$resolveProsessAksjonspunkter = resolveProsessAksjonspunkter;
    this.$$resetBehandlingspunkter = resetBehandlingspunkter;
  }

  get fagsakYtelseType() {
    return this.$$fagsakYtelseType;
  }

  get isSelectedBehandlingHenlagt() {
    return this.$$isSelectedBehandlingHenlagt;
  }

  get behandlingIdentifier() {
    return this.$$behandlingIdentifier;
  }

  get behandlingVersjon() {
    return this.$$behandlingVersjon;
  }

  get behandlingspunkter() {
    return this.$$behandlingspunkter;
  }

  get defaultBehandlingspunkt() {
    return this.$$defaultBehandlingspunkt;
  }

  get selectedBehandlingspunkt() {
    return this.$$selectedBehandlingspunkt;
  }

  get resolveProsessAksjonspunkterSuccess() {
    return this.$$resolveProsessAksjonspunkterSuccess;
  }

  get behandlingStatus() {
    return this.$$behandlingStatus;
  }

  get behandlingsresultat() {
    return this.$$behandlingsresultat;
  }

  get getBehandlingspunkterStatus() {
    return this.$$getBehandlingspunkterStatus;
  }

  get getBehandlingspunkterTitleCodes() {
    return this.$$getBehandlingspunkterTitleCodes;
  }

  get getAksjonspunkterOpenStatus() {
    return this.$$getAksjonspunkterOpenStatus;
  }

  get fetchPreviewBrev() {
    return this.$$fetchPreviewBrev;
  }

  get resolveProsessAksjonspunkter() {
    return this.$$resolveProsessAksjonspunkter;
  }

  get resetBehandlingspunkter() {
    return this.$$resetBehandlingspunkter;
  }
}

export default BehandlingsprosessIndexProps;
