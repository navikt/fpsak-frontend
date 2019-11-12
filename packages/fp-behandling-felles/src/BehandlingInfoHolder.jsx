// TODO (TOR) Dette er ein midlertidig klasse som held behandlingsdata. Skal fjernast når alle komponentar utanfor
// behandlingskonteksten hentar sin eigen data.
class BehandlingInfoHolder {
    isKontrollerRevurderingAksjonspunkOpen = false;

    behandlingVersjon;

    aksjonspunkter;

    behandlingKlageVurdering;

    behandlingResultatstruktur;

    behandlingsresultat;

    behandlingKlageVurderingResultatNFP;

    behandlingKlageVurderingResultatNK;

    soknad;

    behandlingsresultatFraOriginalBehandling;

    resultatstrukturFraOriginalBehandling;

    erArsakTypeBehandlingEtterKlage = false;

    withIsKontrollerRevurderingAksjonspunkOpen = (isKontrollerRevurderingAksjonspunkOpen) => {
      this.isKontrollerRevurderingAksjonspunkOpen = isKontrollerRevurderingAksjonspunkOpen;
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
