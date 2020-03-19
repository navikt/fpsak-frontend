import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { FormattedHTMLMessage } from 'react-intl';

import historikkOpplysningTypeCodes from '../../kodeverk/historikkOpplysningTypeCodes';
import { HistorikkMalTypeForeldelse } from './HistorikkMalTypeForeldelse';

describe('HistorikkMalTypeForeldelse', () => {
  it('skal vise alle historikkelement korrekt', () => {
    const historikkinnslagDeler = [{
      skjermlenke: {
        kode: 'FORELDELSE',
      },
      endredeFelter: [{
        endretFeltNavn: {
          kode: 'feltkode',
        },
        fraVerdi: 'gammel verdi',
        tilVerdi: 'ny verdi',
      }, {
        endretFeltNavn: {
          kode: 'Anna feltkode',
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

    const getKodeverknavn = (kodeverk) => {
      if (kodeverk.kode === 'feltkode') {
        return 'testing';
      }
      if (kodeverk.kode === 'Anna feltkode') {
        return 'testing 2';
      }
      return '';
    };

    const wrapper = shallow(<HistorikkMalTypeForeldelse
      historikkinnslagDeler={historikkinnslagDeler}
      behandlingLocation={{}}
      getKodeverknavn={getKodeverknavn}
      createLocationForSkjermlenke={() => 'url'}
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
