import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';

import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';

import VisittkortBarnInfoOmsorgPanel from './VisittkortBarnInfoOmsorgPanel';

describe('<VisittkortBarnInfoOmsorgPanel>', () => {
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

  it('skal vise adopsjonsinformasjon', () => {
    const wrapper = shallow(<VisittkortBarnInfoOmsorgPanel
      familieHendelse={familieHendelse}
    />);

    const message = wrapper.find(FormattedMessage);
    expect(message).has.length(1);
    expect(message.prop('id')).is.eql('VisittkortBarnInfoOmsorgPanel.Adopsjon');
    expect(message.prop('values')).is.eql({
      antall: 1,
      dato: '21.01.2020',
    });
  });

  it('skal vise foreldreansvarsinformasjon', () => {
    const wrapper = shallow(<VisittkortBarnInfoOmsorgPanel
      familieHendelse={{
        ...familieHendelse,
        oppgitt: {
          skjaringstidspunkt: '2020-01-01',
          omsorgsovertakelseDato: '2020-01-21',
          antallBarnTilBeregning: 1,
          soknadType: {
            kode: soknadType.FODSEL,
            kodeverk: 'SOKNAD_TYPE',
          },
        },
      }}
    />);

    const message = wrapper.find(FormattedMessage);
    expect(message).has.length(1);
    expect(message.prop('id')).is.eql('VisittkortBarnInfoOmsorgPanel.Foreldreansvar');
    expect(message.prop('values')).is.eql({
      antall: 1,
      dato: '21.01.2020',
    });
  });
});
