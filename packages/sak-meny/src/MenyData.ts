import { ReactNode } from 'react';

class MenyData {
  erSynlig: boolean;

  tekst: string;

  modal: (lukkModal: () => void) => ReactNode;

  constructor(erSynlig, tekst) {
    this.erSynlig = erSynlig;
    this.tekst = tekst;
  }

  medModal = (modal: (lukkModal: () => void) => ReactNode) => {
    this.modal = modal;
    return this;
  }

  getErSynlig = () => this.erSynlig

  getTekst = () => this.tekst

  getModal = () => this.modal
}

export default MenyData;
