import { notNull } from '@fpsak-frontend/utils';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import familieHendelseType from '@fpsak-frontend/kodeverk/src/familieHendelseType';

class SoknadData {
  constructor(selectedFagsakYtelseType, selectedFamilieHendelseType, selectedForeldreType) {
    this.fagsakYtelseType = notNull(selectedFagsakYtelseType);
    if (selectedFagsakYtelseType === fagsakYtelseType.SVANGERSKAPSPENGER) {
      this.familieHendelseType = familieHendelseType.FODSEL;
    } else {
      this.familieHendelseType = notNull(selectedFamilieHendelseType);
    }
    this.foreldreType = notNull(selectedForeldreType);
  }

  getFagsakYtelseType() {
    return this.fagsakYtelseType;
  }

  getFamilieHendelseType() {
    return this.familieHendelseType;
  }

  getForeldreType() {
    return this.foreldreType;
  }
}

export default SoknadData;
