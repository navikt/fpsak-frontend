import React from 'react';
import { expect } from 'chai';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { Normaltekst } from 'nav-frontend-typografi';
import sinon from 'sinon';
import { FeilutbetalingInfoPanelImpl } from './FeilutbetalingInfoPanel';

const feilutbetaling = {
  tidligereVarseltBeløp: 49863,
  aktuellFeilUtbetaltBeløp: 51000,
  datoForRevurderingsvedtak: '2019-01-04',
  totalPeriodeFom: '2018-09-01',
  totalPeriodeTom: '2019-01-31',
  behandlingÅrsaker: [{
    behandlingArsakType: {
      kode: 'test',
    },
  }],
  behandlingsresultat: {
    type: {
      kode: 'test2',
    },
    konsekvenserForYtelsen: [{
      kode: '2',
    }, {
      kode: '3',
    }],
  },
  tilbakekrevingValg: {
    videreBehandling: {
      kode: 'test',
    },
  },
  perioder: [
    {
      fom: '2016-03-16',
      tom: '2016-05-26',
      belop: 51000,
      feilutbetalingÅrsakDto: {
        årsakKode: 'BARN_ALDER_OVER_TRE',
        årsak: null,
        kodeverk: null,
        underÅrsaker: [],
      },
    },
  ],
};

const getKodeverknavn = (kodeverk) => {
  if (kodeverk.kode === 'test') {
    return 'Endring fra bruker Inntekstmelding Nyeregisteropplysninger';
  }
  if (kodeverk.kode === 'test2') {
    return 'Innvilget';
  }
  if (kodeverk.kode === '2') {
    return 'Endring i beregning og uttak';
  }
  if (kodeverk.kode === '3') {
    return 'Feilutbetaling med tilbakekreving';
  }
  if (kodeverk.kode === 'arsakType') {
    return 'test';
  }
  return null;
};

describe('<FeilutbetalingInfoPanel>', () => {
  it('skal rendre komponent korrekt', () => {
    const wrapper = shallowWithIntl(<FeilutbetalingInfoPanelImpl
      {...reduxFormPropsMock}
      getKodeverknavn={getKodeverknavn}
      feilutbetaling={feilutbetaling}
      intl={intlMock}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      readOnly={false}
      openInfoPanels={['feilutbetaling']}
      submitCallback={sinon.spy()}
      årsaker={[]}
      merknaderFraBeslutter={{
        notAccepted: false,
      }}
    />);

    const normaltekstfelter = wrapper.find(Normaltekst);
    expect(normaltekstfelter).length(8);

    expect(normaltekstfelter.first().childAt(0).text()).is.eql('01.09.2018 - 31.01.2019');
    expect(normaltekstfelter.at(1).childAt(0).text()).is.eql('51000');
    expect(normaltekstfelter.at(2).childAt(0).text()).is.eql('49863');
    expect(normaltekstfelter.at(3).childAt(0).text()).is.eql('Endring fra bruker Inntekstmelding Nyeregisteropplysninger');
    expect(normaltekstfelter.at(4).childAt(0).text()).is.eql('04.01.2019');
    expect(normaltekstfelter.at(5).childAt(0).text()).is.eql('Innvilget');
    expect(normaltekstfelter.at(6).childAt(0).text()).is.eql('Endring i beregning og uttak, Feilutbetaling med tilbakekreving');
    expect(normaltekstfelter.at(7).childAt(0).text()).is.eql('Endring fra bruker Inntekstmelding Nyeregisteropplysninger');
  });
});
