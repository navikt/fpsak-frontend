import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { FormattedHTMLMessage } from 'react-intl';

import historikkOpplysningTypeCodes from '@fpsak-frontend/kodeverk/src/historikkOpplysningTypeCodes';

import HistorikkMalTypeForeldelse from './HistorikkMalTypeForeldelse';

describe('HistorikkMalTypeForeldelse', () => {
  it('skal vise alle historikkelement korrekt', () => {
    const historikkinnslagDeler = [{
      skjermlenke: {
        kode: 'FORELDELSE',
      },
      endredeFelter: [{
        endretFeltNavn: {
          kode: 'feltkode',
          navn: 'testing',
        },
        fraVerdi: 'gammel verdi',
        tilVerdi: 'ny verdi',
      }, {
        endretFeltNavn: {
          kode: 'Anna feltkode',
          navn: 'testing 2',
        },
        tilVerdi: 'ny verdi 2',
      }],
      opplysninger: [{
        opplysningType: {
          kode: historikkOpplysningTypeCodes.PERIODE_FOM.kode,
          tilVerdi: '10.10.2018',
        },
      }, {
        opplysningType: {
          kode: historikkOpplysningTypeCodes.PERIODE_TOM.kode,
          tilVerdi: '10.12.2018',
        },
      }],
    }];
    const wrapper = shallow(<HistorikkMalTypeForeldelse
      historikkinnslagDeler={historikkinnslagDeler}
      behandlingLocation={{}}
    />);

    const messages = wrapper.find(FormattedHTMLMessage);
    expect(messages).to.have.length(3);
    expect(messages.at(1).prop('values')).to.eql({
      navn: 'testing',
      fraVerdi: 'gammel verdi',
      tilVerdi: 'ny verdi',
    });
    expect(messages.at(2).prop('values')).to.eql({
      navn: 'testing 2',
      fraVerdi: undefined,
      tilVerdi: 'ny verdi 2',
    });
  });
});
