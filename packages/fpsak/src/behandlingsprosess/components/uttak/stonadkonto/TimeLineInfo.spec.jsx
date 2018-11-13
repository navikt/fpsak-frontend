import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/assets/testHelpers/intl-enzyme-test-helper';
import TimeLineInfo from './TimeLineInfo';

const stonadskonto = {
  FORELDREPENGER_FØR_FØDSEL: {
    saldo: 30,
    maxDager: 30,
    aktivitetSaldoDtoList: [
    ],
  },
  FELLESPERIODE: {
    saldo: 30,
    maxDager: 30,
    aktivitetSaldoDtoList: [
    ],
  },
  MØDREKVOTE: {
    saldo: 40,
    maxDager: 30,
    aktivitetSaldoDtoList: [
    ],
  },
  FEDREKVOTE: {
    saldo: 20,
    maxDager: 30,
    aktivitetSaldoDtoList: [
    ],
  },
};

describe('<TimeLineInfo>', () => {
  it('skal vise max-uker tilgjengelig lik summen av alle kontoers max dager delt på fem', () => {
    const wrapper = shallowWithIntl(<TimeLineInfo
      stonadskonto={stonadskonto}
      maksDatoUttak="2018-12-01"
    />);

    const messages = wrapper.find('FormattedHTMLMessage');
    expect(messages).to.have.length(2);
    expect(messages.at(0).props().values.ukerVerdi).to.equal(24);
  });

  it('skal vise tabell med disponible dager', () => {
    const wrapper = shallowWithIntl(<TimeLineInfo
      stonadskonto={stonadskonto}
      maksDatoUttak="2018-12-01"
    />);

    const konto = {
      kontonavn: 'FELLESPERIODE',
      kontoinfo: {
        saldo: 40,
        maxDager: 40,
        stonadskontotype: 'FELLESPERIODE',
        aktivitetSaldoDtoList: [{
          aktivitetIdentifikator: {
            arbeidsforholdId: '123',
            arbeidsforholdNavn: 'Statoil',
            arbeidsforholdOrgnr: '987',
            uttakArbeidType: {
              kode: 'FRILANS',
            },
          },
        },
        ],
      },
    };

    wrapper.setState({ aktiv: 1, visKonto: konto });
    const messages = wrapper.find('FormattedHTMLMessage');
    expect(messages).to.have.length(2);
    expect(messages.at(1).props().values.dato).to.equal('01.12.2018');
    expect(messages.at(0).props().values.ukerVerdi).to.equal(24);
  });

  it('skal vise tabs', () => {
    const wrapper = shallowWithIntl(<TimeLineInfo
      stonadskonto={stonadskonto}
      maksDato="2018-12-01"
    />);
    wrapper.setState({ aktiv: 1 });
    const timelineTab = wrapper.find('TimeLineTab');
    expect(timelineTab).to.have.length(4);
    expect(timelineTab.at(0).props().aktiv).to.equal(false);
    expect(timelineTab.at(1).props().aktiv).to.equal(true);
    expect(timelineTab.at(2).props().aktiv).to.equal(false);
    expect(timelineTab.at(3).props().aktiv).to.equal(false);
  });
});
