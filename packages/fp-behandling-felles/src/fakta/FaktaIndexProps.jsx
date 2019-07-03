class FaktaIndexProps {
  constructor(behandlingIdentifier, behandlingVersjon, openInfoPanels, shouldOpenDefaultInfoPanels, resetFakta, resolveFaktaAksjonspunkter,
      resolveFaktaOverstyrAksjonspunkter) {
    this.$$behandlingIdentifier = behandlingIdentifier;
    this.$$behandlingVersjon = behandlingVersjon;
    this.$$openInfoPanels = openInfoPanels;
    this.$$shouldOpenDefaultInfoPanels = shouldOpenDefaultInfoPanels;
    this.$$resetFakta = resetFakta;
    this.$$resolveFaktaAksjonspunkter = resolveFaktaAksjonspunkter;
    this.$$resolveFaktaOverstyrAksjonspunkter = resolveFaktaOverstyrAksjonspunkter;
  }

  get behandlingIdentifier() {
    return this.$$behandlingIdentifier;
  }

  get behandlingVersjon() {
    return this.$$behandlingVersjon;
  }

  get openInfoPanels() {
    return this.$$openInfoPanels;
  }

  get shouldOpenDefaultInfoPanels() {
    return this.$$shouldOpenDefaultInfoPanels;
  }

  get resetFakta() {
    return this.$$resetFakta;
  }

  get resolveFaktaAksjonspunkter() {
    return this.$$resolveFaktaAksjonspunkter;
  }

  get resolveFaktaOverstyrAksjonspunkter() {
    return this.$$resolveFaktaOverstyrAksjonspunkter;
  }
}

export default FaktaIndexProps;
