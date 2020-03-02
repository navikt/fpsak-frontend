import React from 'react';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';

import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-sak-visittkort';
import VisittkortBarnInfoFodselPanel from './VisittkortBarnInfoFodselPanel';

describe('<VisittkortBarnInfoFodselPanel>', () => {
  const familieHendelse = {
    oppgitt: {
      skjaringstidspunkt: '2020-01-01',
      avklartBarn: [],
      termindato: '2020-01-21',
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

  it('skal vise termindato', () => {
    const wrapper = shallowWithIntl(<VisittkortBarnInfoFodselPanel.WrappedComponent
      intl={intlMock}
      familieHendelse={familieHendelse}
    />);

    const message = wrapper.find(FormattedMessage);
    expect(message).has.length(1);
    expect(message.prop('id')).is.eql('VisittkortBarnInfoFodselPanel.Termin');
    expect(message.prop('values')).is.eql({
      dato: '21.01.2020',
    });
  });

  it('skal vise fødselsdato', () => {
    const wrapper = shallowWithIntl(<VisittkortBarnInfoFodselPanel.WrappedComponent
      intl={intlMock}
      familieHendelse={{
        ...familieHendelse,
        oppgitt: {
          skjaringstidspunkt: '2020-01-01',
          avklartBarn: [{
            fodselsdato: '2020-02-02',
          }],
          soknadType: {
            kode: soknadType.FODSEL,
            kodeverk: 'SOKNAD_TYPE',
          },
        },
      }}
    />);

    const messages = wrapper.find(FormattedMessage);
    expect(messages).has.length(2);
    expect(messages.first().prop('id')).is.eql('VisittkortBarnInfoFodselPanel.Fodt');
    expect(messages.first().prop('values')).is.eql({
      dato: '02.02.2020',
    });
  });

  it('skal etikett for dødfødt barn', () => {
    const wrapper = shallowWithIntl(<VisittkortBarnInfoFodselPanel.WrappedComponent
      intl={intlMock}
      familieHendelse={{
        ...familieHendelse,
        oppgitt: {
          skjaringstidspunkt: '2020-01-01',
          avklartBarn: [{
            fodselsdato: '2020-02-02',
            dodsdato: '2020-02-02',
          }],
          soknadType: {
            kode: soknadType.FODSEL,
            kodeverk: 'SOKNAD_TYPE',
          },
        },
      }}
    />);

    const message = wrapper.find(FormattedMessage);
    expect(message).has.length(3);
    expect(message.last().prop('id')).is.eql('VisittkortBarnInfoFodselPanel.Dod');
  });
});
