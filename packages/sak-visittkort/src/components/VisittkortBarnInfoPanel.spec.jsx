import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';

import VisittkortBarnInfoFodselPanel from './VisittkortBarnInfoFodselPanel';
import VisittkortBarnInfoOmsorgPanel from './VisittkortBarnInfoOmsorgPanel';
import VisittkortBarnInfoPanel from './VisittkortBarnInfoPanel';

describe('<VisittkortBarnInfoPanel>', () => {
  const familieHendelse = {
    oppgitt: {
      skjaringstidspunkt: '2020-01-01',
      omsorgsovertakelseDato: '2020-01-21',
      adopsjonFodelsedatoer: [{
        1: '2019-01-01',
      }],
      soknadType: {
        kode: soknadType.FODSEL,
        kodeverk: 'SOKNAD_TYPE',
      },
    },
    gjeldende: {
      skjaringstidspunkt: '2020-01-01',
      soknadType: {
        kode: soknadType.FODSEL,
        kodeverk: 'SOKNAD_TYPE',
      },
    },
    register: {
      skjaringstidspunkt: '2020-01-01',
      soknadType: {
        kode: soknadType.FODSEL,
        kodeverk: 'SOKNAD_TYPE',
      },
    },
  };

  it('skal vise panel for fødsel', () => {
    const wrapper = shallow(<VisittkortBarnInfoPanel
      familieHendelse={familieHendelse}
    />);

    expect(wrapper.find(VisittkortBarnInfoFodselPanel)).has.length(1);
  });

  it('skal vise panel for omsorg', () => {
    const wrapper = shallow(<VisittkortBarnInfoPanel
      familieHendelse={{
        ...familieHendelse,
        oppgitt: {
          ...familieHendelse.oppgitt,
          soknadType: {
            kode: 'ANNET',
            kodeverk: 'SOKNAD_TYPE',
          },
        },
      }}
    />);

    expect(wrapper.find(VisittkortBarnInfoOmsorgPanel)).has.length(1);
  });
});
