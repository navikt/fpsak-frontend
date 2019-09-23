// TODO (TOR) Dette er ein midlertidig klasse som held behandlingsdata. Skal fjernast når alle komponentar utanfor
// behandlingskonteksten hentar sin eigen data.
class BehandlingInfoHolder {
    isKontrollerRevurderingAksjonspunkOpen = false;

    behandlingSprak;

    behandlingVersjon;

    aksjonspunkter;

    behandlingAnsvarligSaksbehandler;

    behandlingToTrinnsBehandling = false;

    behandlingKlageVurdering;

    behandlingResultatstruktur;

    behandlingsresultat;

    behandlingKlageVurderingResultatNFP;

    behandlingKlageVurderingResultatNK;

    behandlingIsOnHold;

    behandlingIsQueued;

    soknad;

    behandlingsresultatFraOriginalBehandling;

    resultatstrukturFraOriginalBehandling;

    erArsakTypeBehandlingEtterKlage = false;

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

    withAksjonspunkter = (aksjonspunkter) => {
      this.aksjonspunkter = aksjonspunkter;
      return this;
    }

    withBehandlingAnsvarligSaksbehandler = (behandlingAnsvarligSaksbehandler) => {
      this.behandlingAnsvarligSaksbehandler = behandlingAnsvarligSaksbehandler;
      return this;
    }

    withBehandlingToTrinnsBehandling = (behandlingToTrinnsBehandling) => {
      this.behandlingToTrinnsBehandling = behandlingToTrinnsBehandling;
      return this;
    }

    withBehandlingKlageVurdering = (behandlingKlageVurdering) => {
      this.behandlingKlageVurdering = behandlingKlageVurdering;
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

    withBehandlingKlageVurderingResultatNFP = (behandlingKlageVurderingResultatNFP) => {
      this.behandlingKlageVurderingResultatNFP = behandlingKlageVurderingResultatNFP;
      return this;
    }

    withBehandlingKlageVurderingResultatNK = (behandlingKlageVurderingResultatNK) => {
      this.behandlingKlageVurderingResultatNK = behandlingKlageVurderingResultatNK;
      return this;
    }

    withBehandlingIsOnHold = (behandlingIsOnHold) => {
      this.behandlingIsOnHold = behandlingIsOnHold;
      return this;
    }

    withBehandlingIsQueued = (behandlingIsQueued) => {
      this.behandlingIsQueued = behandlingIsQueued;
      return this;
    }

    withSoknad= (soknad) => {
      this.soknad = soknad;
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

     withErArsakTypeBehandlingEtterKlage = (erArsakTypeBehandlingEtterKlage) => {
       this.erArsakTypeBehandlingEtterKlage = erArsakTypeBehandlingEtterKlage;
       return this;
     }
}

export default BehandlingInfoHolder;
