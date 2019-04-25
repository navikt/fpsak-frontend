import { expect } from 'chai';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import arbeidType from '@fpsak-frontend/kodeverk/src/arbeidType';

import { getKodeverknavnFraKode, getKodeverknavnFn } from './kodeverkUtils';

describe('<kodeverkUtils>', () => {
  it('skal finne navn til gitt kodeverk-kode', () => {
    const alleKodeverk = {
      [kodeverkTyper.ARBEID_TYPE]: [{
        kode: arbeidType.LONN_UNDER_UTDANNING,
        kodeverk: 'ARBEID_TYPE',
        navn: 'Lønn under utdanning',
      }],
    };

    const kodeverkType = kodeverkTyper.ARBEID_TYPE;
    const kode = arbeidType.LONN_UNDER_UTDANNING;

    const navn = getKodeverknavnFraKode(alleKodeverk, kodeverkType, kode);

    expect(navn).to.equal('Lønn under utdanning');
  });

  it('skal finne navn til gitt kodeverk-objekt', () => {
    const alleKodeverk = {
      [kodeverkTyper.ARBEID_TYPE]: [{
        kode: arbeidType.LONN_UNDER_UTDANNING,
        kodeverk: 'ARBEID_TYPE',
        navn: 'Lønn under utdanning',
      }],
    };

    const kodeverk = {
      kodeverk: 'ARBEID_TYPE',
      kode: arbeidType.LONN_UNDER_UTDANNING,
    };

    const navn = getKodeverknavnFn(alleKodeverk, kodeverkTyper)(kodeverk);

    expect(navn).to.equal('Lønn under utdanning');
  });
});
