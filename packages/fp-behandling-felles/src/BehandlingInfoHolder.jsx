// TODO (TOR) Dette er ein midlertidig klasse som held behandlingsdata. Skal fjernast når alle komponentar utanfor
// behandlingskonteksten hentar sin eigen data.
class BehandlingInfoHolder {
    isKontrollerRevurderingAksjonspunkOpen = false;

    behandlingSprak;

    behandlingVersjon;

    brevMaler;

    aksjonspunkter;

    behandlingAnsvarligSaksbehandler;

    behandlingStatus;

    behandlingToTrinnsBehandling = false;

    totrinnskontrollArsakerUtenUdefinert;

    totrinnskontrollArsakerReadOnly;

    totrinnskontrollArsaker;

    behandlingKlageVurdering;

    behandlingIsKlage = false;

    behandlingResultatstruktur;

    behandlingsresultat;

    behandlingType;

    behandlingKlageVurderingResultatNFP;

    behandlingKlageVurderingResultatNK;

    behandlingHasSoknad;

    behandlingIsInnsyn = false;

    behandlingIsOnHold;

    isBehandlingInInnhentSoknadsopplysningerSteg = false;

    behandlingIsQueued;

    behandlingBehandlendeEnhetId;

    behandlingBehandlendeEnhetNavn;

    soknad;

    behandlingIdentifier;

    behandlingsresultatFraOriginalBehandling;

    resultatstrukturFraOriginalBehandling;

    withIsKontrollerRevurderingAksjonspunkOpen = (isKontrollerRevurderingAksjonspunkOpen) => {
      this.isKontrollerRevurderingAksjonspunkOpen = isKontrollerRevurderingAksjonspunkOpen;
      return this;
    }

    withBehandlingSprak = (behandlingSprak) => {
      this.behandlingSprak = behandlingSprak;
      return this;
    }

    withBehandlingVersjon = (behandlingVersjon) => {
      this.behandlingVersjon = behandlingVersjon;
      return this;
    }

    withBrevMaler = (brevMaler) => {
      this.brevMaler = brevMaler;
      return this;
    }

    withAksjonspunkter = (aksjonspunkter) => {
      this.aksjonspunkter = aksjonspunkter;
      return this;
    }

    withBehandlingAnsvarligSaksbehandler = (behandlingAnsvarligSaksbehandler) => {
      this.behandlingAnsvarligSaksbehandler = behandlingAnsvarligSaksbehandler;
      return this;
    }

    withBehandlingStatus = (behandlingStatus) => {
      this.behandlingStatus = behandlingStatus;
      return this;
    }

    withBehandlingToTrinnsBehandling = (behandlingToTrinnsBehandling) => {
      this.behandlingToTrinnsBehandling = behandlingToTrinnsBehandling;
      return this;
    }

    withTotrinnskontrollArsakerUtenUdefinert = (totrinnskontrollArsakerUtenUdefinert) => {
      this.totrinnskontrollArsakerUtenUdefinert = totrinnskontrollArsakerUtenUdefinert;
      return this;
    }

    withTotrinnskontrollArsakerReadOnly = (totrinnskontrollArsakerReadOnly) => {
      this.totrinnskontrollArsakerReadOnly = totrinnskontrollArsakerReadOnly;
      return this;
    }

    withTotrinnskontrollArsaker = (totrinnskontrollArsaker) => {
      this.totrinnskontrollArsaker = totrinnskontrollArsaker;
      return this;
    }

    withBehandlingKlageVurdering = (behandlingKlageVurdering) => {
      this.behandlingKlageVurdering = behandlingKlageVurdering;
      return this;
    }

    withBehandlingIsKlage = (behandlingIsKlage) => {
      this.behandlingIsKlage = behandlingIsKlage;
      return this;
    }

    withBehandlingResultatstruktur = (behandlingResultatstruktur) => {
      this.behandlingResultatstruktur = behandlingResultatstruktur;
      return this;
    }

    withBehandlingsresultat = (behandlingsresultat) => {
      this.behandlingsresultat = behandlingsresultat;
      return this;
    }

    withBehandlingType = (behandlingType) => {
      this.behandlingType = behandlingType;
      return this;
    }

    withBehandlingKlageVurderingResultatNFP = (behandlingKlageVurderingResultatNFP) => {
      this.behandlingKlageVurderingResultatNFP = behandlingKlageVurderingResultatNFP;
      return this;
    }

    withBehandlingKlageVurderingResultatNK = (behandlingKlageVurderingResultatNK) => {
      this.behandlingKlageVurderingResultatNK = behandlingKlageVurderingResultatNK;
      return this;
    }

    withBehandlingHasSoknad = (behandlingHasSoknad) => {
      this.behandlingHasSoknad = behandlingHasSoknad;
      return this;
    }

    withBehandlingIsInnsyn = (behandlingIsInnsyn) => {
      this.behandlingIsInnsyn = behandlingIsInnsyn;
      return this;
    }

    withBehandlingIsOnHold = (behandlingIsOnHold) => {
      this.behandlingIsOnHold = behandlingIsOnHold;
      return this;
    }

    withIsBehandlingInInnhentSoknadsopplysningerSteg = (isBehandlingInInnhentSoknadsopplysningerSteg) => {
      this.isBehandlingInInnhentSoknadsopplysningerSteg = isBehandlingInInnhentSoknadsopplysningerSteg;
      return this;
    }

    withBehandlingIsQueued = (behandlingIsQueued) => {
      this.behandlingIsQueued = behandlingIsQueued;
      return this;
    }

    withBehandlingBehandlendeEnhetId = (behandlingBehandlendeEnhetId) => {
      this.behandlingBehandlendeEnhetId = behandlingBehandlendeEnhetId;
      return this;
    }

    withBehandlendeEnhetNavn = (behandlingBehandlendeEnhetNavn) => {
      this.behandlingBehandlendeEnhetNavn = behandlingBehandlendeEnhetNavn;
      return this;
    }

    withSoknad= (soknad) => {
      this.soknad = soknad;
      return this;
    }

    withBehandlingIdentifier = (behandlingIdentifier) => {
      this.behandlingIdentifier = behandlingIdentifier;
      return this;
    }

    withBehandlingsresultatFraOriginalBehandling = (behandlingsresultatFraOriginalBehandling) => {
      this.behandlingsresultatFraOriginalBehandling = behandlingsresultatFraOriginalBehandling;
      return this;
    }

     withResultatstrukturFraOriginalBehandling = (resultatstrukturFraOriginalBehandling) => {
       this.resultatstrukturFraOriginalBehandling = resultatstrukturFraOriginalBehandling;
       return this;
     }
}

export default BehandlingInfoHolder;
