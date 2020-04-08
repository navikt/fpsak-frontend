import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';

import { omit } from '@fpsak-frontend/utils';

import historikkOpplysningTypeCodes from '../../kodeverk/historikkOpplysningTypeCodes';
import historikkEndretFeltType from '../../kodeverk/historikkEndretFeltType';
import { HistorikkMalTypeTilbakekreving } from './HistorikkMalTypeTilbakekreving';

describe('HistorikkMalTypeTilbakekreving', () => {
  it('skal vise alle historikkelement korrekt', () => {
    const historikkinnslagDeler = [{
      skjermlenke: {
        kode: 'TILBAKEKREVING',
      },
      endredeFelter: [{
        endretFeltNavn: {
          kode: historikkEndretFeltType.ER_VILKARENE_TILBAKEKREVING_OPPFYLT,
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
      }, {
        opplysningType: {
          kode: historikkOpplysningTypeCodes.TILBAKEKREVING_OPPFYLT_BEGRUNNELSE.kode,
          tilVerdi: 'test',
        },
      },
      {
        opplysningType: {
          kode: historikkOpplysningTypeCodes.SÆRLIG_GRUNNER_BEGRUNNELSE.kode,
          tilVerdi: 'test',
        },
      }],
    }];

    const getKodeverknavn = (kodeverk) => {
      if (kodeverk.kode === historikkEndretFeltType.ER_VILKARENE_TILBAKEKREVING_OPPFYLT) {
        return 'testing';
      }
      if (kodeverk.kode === 'Anna feltkode') {
        return 'testing 2';
      }
      return '';
    };

    const wrapper = shallow(<HistorikkMalTypeTilbakekreving
      historikkinnslagDeler={historikkinnslagDeler}
      behandlingLocation={{}}
      getKodeverknavn={getKodeverknavn}
      createLocationForSkjermlenke={() => 'url'}
    />);

    const messages = wrapper.find(FormattedMessage);
    expect(messages).to.have.length(3);
    expect(omit(messages.at(1).prop('values'), 'b')).to.eql({
      navn: 'testing',
      fraVerdi: 'gammel verdi',
      tilVerdi: 'ny verdi',
    });
    expect(omit(messages.at(2).prop('values'), 'b')).to.eql({
      navn: 'testing 2',
      fraVerdi: undefined,
      tilVerdi: 'ny verdi 2',
    });
  });
});
