// TODO (TOR) Dette er ein midlertidig klasse som held behandlingsdata. Skal fjernast når alle komponentar utanfor
// behandlingskonteksten hentar sin eigen data.
class BehandlingInfoHolder {
    behandlingVersjon;

    withBehandlingVersjon = (behandlingVersjon) => {
      this.behandlingVersjon = behandlingVersjon;
      return this;
    }
}

export default BehandlingInfoHolder;
