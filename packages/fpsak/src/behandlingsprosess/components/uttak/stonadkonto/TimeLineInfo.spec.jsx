import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/assets/testHelpers/intl-enzyme-test-helper';
import TimeLineInfo from './TimeLineInfo';

const stonadskonto = {
  FORELDREPENGER_FØR_FØDSEL: {
    maxDager: 30,
    aktivitetFordeligDtoList: [
      {
        fordelteDager: 30,
      },
    ],
  },
  FELLESPERIODE: {
    maxDager: 30,
    aktivitetFordeligDtoList: [
      {
        fordelteDager: 20,
      },
    ],
  },
  MØDREKVOTE: {
    maxDager: 40,
    aktivitetFordeligDtoList: [
      {
        fordelteDager: 33,
      },
    ],
  },
  FEDREKVOTE: {
    maxDager: 20,
    aktivitetFordeligDtoList: [
      {
        fordelteDager: 17,
      },
    ],
  },
};

describe('<TimeLineInfo>', () => {
  it('skal vise max-uker tilgjengelig lik summen av alle kontoers max dager delt på fem', () => {
    const wrapper = shallowWithIntl(<TimeLineInfo
      stonadskonto={stonadskonto}
      maksDato="2018-12-01"
    />);

    const messages = wrapper.find('FormattedHTMLMessage');
    expect(messages).to.have.length(2);
    expect(messages.at(0).props().values.ukerVerdi).to.equal(24);
  });

  it('skal vise tabell med disponible dager', () => {
    const wrapper = shallowWithIntl(<TimeLineInfo
      stonadskonto={stonadskonto}
      maksDato="2018-12-01"
    />);

    const konto = {
      kontonavn: '',
      kontoinfo: {
        maxDager: 40,
        aktivitetFordeligDtoList: [{
          aktivitetIdentifikator: {
            arbeidsforholdId: '123',
            arbeidsforholdNavn: 'Statoil',
            arbeidsforholdOrgnr: '987',
            uttakArbeidType: {
              kode: 'FRILANS',
            },
          },
          fordelteDager: 33,
        },
        ],
      },
    };

    wrapper.setState({ aktiv: 1, visKonto: konto });
    const messages = wrapper.find('FormattedHTMLMessage');
    expect(messages).to.have.length(3);
    expect(messages.at(2).props().values.ukerVerdi).to.equal(1);
    expect(messages.at(2).props().values.dagerVerdi).to.equal(2);
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
