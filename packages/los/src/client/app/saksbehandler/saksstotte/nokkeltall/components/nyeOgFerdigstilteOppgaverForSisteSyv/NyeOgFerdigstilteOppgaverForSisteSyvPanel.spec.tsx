
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';

import behandlingType from 'kodeverk/behandlingType';
import { NyeOgFerdigstilteOppgaverForSisteSyvPanel, getNyeOgFerdigstilteForSisteSyvDager } from './NyeOgFerdigstilteOppgaverForSisteSyvPanel';
import NyeOgFerdigstilteOppgaverForSisteSyvGraf from './NyeOgFerdigstilteOppgaverForSisteSyvGraf';

describe('<NyeOgFerdigstilteOppgaverForSisteSyvPanel>', () => {
  it('skal vise rendre komponent', () => {
    const nyeOgFerdigstilteOppgaver = [{
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'FORSTEGANGSSOKNAD',
      },
      antallNye: 12,
      antallFerdigstilte: 2,
      dato: '2019-01-01',
    }];

    const wrapper = shallow(<NyeOgFerdigstilteOppgaverForSisteSyvPanel
      width={300}
      height={200}
      nyeOgFerdigstilteOppgaver={nyeOgFerdigstilteOppgaver}
    />);

    expect(wrapper.find(NyeOgFerdigstilteOppgaverForSisteSyvGraf)).to.have.length(1);
  });

  it('skal filtrere bort dagens oppgaver', () => {
    const iDag = moment().format();
    const iGar = moment().subtract(1, 'days').format();
    const atteDagerSiden = moment().subtract(8, 'days').format();
    const nyeOgFerdigstilteOppgaver = [{
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'FORSTEGANGSSOKNAD',
      },
      antallNye: 12,
      antallFerdigstilte: 2,
      dato: iDag,
    }, {
      behandlingType: {
        kode: behandlingType.KLAGE,
        navn: 'KLAGE',
      },
      antallNye: 1,
      antallFerdigstilte: 6,
      dato: iGar,
    }, {
      behandlingType: {
        kode: behandlingType.DOKUMENTINNSYN,
        navn: 'INNSYN',
      },
      antallNye: 8,
      antallFerdigstilte: 9,
      dato: atteDagerSiden,
    }];

    const filtrerteOppgaver = getNyeOgFerdigstilteForSisteSyvDager.resultFunc(nyeOgFerdigstilteOppgaver);

    expect(filtrerteOppgaver).to.have.length(2);
    expect(filtrerteOppgaver[0].dato).is.eql(iGar);
    expect(filtrerteOppgaver[1].dato).is.eql(atteDagerSiden);
  });
});
