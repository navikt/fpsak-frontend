import React from 'react';
import { expect } from 'chai';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import sinon from 'sinon';
import { FeilutbetalingInfoPanelImpl } from './FeilutbetalingInfoPanel';

const feilutbetaling = {
  årsakRevurdering: 'Endring fra bruker Inntekstmelding Nyeregisteropplysninger',
  resultatRevurdering: null,
  resultatFeilutbetaling: 'Innviliget:Endring i beregning og uttak.Feilutbetaling med tilbakekreving',
  tidligereVarseltBeløp: 49863,
  aktuellFeilUtbetaltBeløp: 51000,
  datoForVarselSendt: '2019-01-04',
  datoForRevurderingsvedtak: '2019-01-04',
  totalPeriodeFom: '2018-09-01',
  totalPeriodeTom: '2019-01-31',
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

const mockProps = {
  ...reduxFormPropsMock,
  feilutbetaling,
  intl: intlMock,
  toggleInfoPanelCallback: sinon.spy(),
  hasOpenAksjonspunkter: true,
  readOnly: false,
  openInfoPanels: ['feilutbetaling'],
  submitCallback: sinon.spy(),
  årsaker: [],
  merknaderFraBeslutter: {
    notAccepted: false,
  },
};

describe('<FeilutbetalingInfoPanel>', () => {
  it('skal rendre FeilutbetalingInfoPanel', () => {
    const wrapper = shallowWithIntl(<FeilutbetalingInfoPanelImpl
      {...mockProps}
    />);

    const faktaEkspandertpanel = wrapper.find('FaktaEkspandertpanel');
    expect(faktaEkspandertpanel).has.length(1);
    expect(faktaEkspandertpanel.prop('title')).to.eql('Fakta om feilutbetaling');
    expect(faktaEkspandertpanel.prop('hasOpenAksjonspunkter')).is.true;
    expect(faktaEkspandertpanel.prop('isInfoPanelOpen')).is.true;
    expect(faktaEkspandertpanel.prop('faktaId')).to.eql(faktaPanelCodes.FEILUTBETALING);
    const formattedMessage = wrapper.find('FormattedMessage');
    expect(formattedMessage).has.length(11);
    const element = wrapper.find('Element');
    expect(element).has.length(3);
    const undertekst = wrapper.find('Undertekst');
    expect(undertekst).has.length(6);
    const normaltekst = wrapper.find('Normaltekst');
    expect(normaltekst).has.length(6);
    expect(normaltekst.at(0).html()).to.equal('<p class="typo-normal">01.09.2018 - 31.01.2019</p>');
    expect(normaltekst.at(1).html()).to.equal(`<p class="typo-normal">${feilutbetaling.aktuellFeilUtbetaltBeløp}</p>`);
    expect(normaltekst.at(2).html()).to.equal(`<p class="typo-normal">${feilutbetaling.tidligereVarseltBeløp}</p>`);
    expect(normaltekst.at(3).html()).to.equal(`<p class="typo-normal">${feilutbetaling.årsakRevurdering}</p>`);
    expect(normaltekst.at(4).html()).to.equal(`<p class="typo-normal">${feilutbetaling.resultatFeilutbetaling}</p>`);
    expect(normaltekst.at(5).html()).to.equal('<p class="typo-normal">04.01.2019</p>');
    const feilutbetalingPerioderTable = wrapper.find('FeilutbetalingPerioderTable');
    expect(feilutbetalingPerioderTable).has.length(1);
    const textAreaField = wrapper.find('TextAreaField');
    expect(textAreaField).has.length(1);
    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).has.length(1);
    const row = wrapper.find('Row');
    expect(row).has.length(21);
    const column = wrapper.find('Column');
    expect(column).has.length(25);
    const form = wrapper.find('form');
    expect(form).has.length(1);
  });
});
