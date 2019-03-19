import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import sinon from 'sinon';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import { FaktaEkspandertpanel } from '@fpsak-frontend/fp-behandling-felles';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import { FormattedMessage } from 'react-intl';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { BeregningInfoPanelImpl, transformValues } from './BeregningInfoPanel';
import VurderFaktaBeregningPanel from './fellesFaktaForATFLogSN/VurderFaktaBeregningPanel';
import AvklareAktiviteterPanel from './avklareAktiviteter/AvklareAktiviteterPanel';

const helpTexts = [<FormattedMessage key="AvklarBGTilstøtendeYtelse" id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning.TilstøtendeYtelse" />];

describe('<BeregningInfoPanel>', () => {
  it('skal ikkje vise ekspanderbart panel', () => {
    const wrapper = shallowWithIntl(<BeregningInfoPanelImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      aksjonspunkter={[]}
      openInfoPanels={['beregning']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly
      hasFaktaForBeregning
      submitCallback={sinon.spy()}
      helpText={helpTexts}
      knappForInntektstabellSkalKunneKlikkes={false}
      verdiForAvklarAktivitetErEndret={false}
      faktaTilfeller={[]}
      isOnHold
    />);
    const panel = wrapper.find(FaktaEkspandertpanel);
    expect(panel).has.length(0);
  });

  it('skal vise ekspanderbart panel', () => {
    const wrapper = shallowWithIntl(<BeregningInfoPanelImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      aksjonspunkter={[]}
      openInfoPanels={['beregning']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly
      hasFaktaForBeregning
      submitCallback={sinon.spy()}
      helpText={helpTexts}
      knappForInntektstabellSkalKunneKlikkes={false}
      verdiForAvklarAktivitetErEndret={false}
      faktaTilfeller={[]}
      isOnHold={false}
    />);
    const panel = wrapper.find(FaktaEkspandertpanel);
    expect(panel).has.length(1);
    expect(panel.prop('title')).to.eql('Fakta om beregning');
    expect(panel.prop('isInfoPanelOpen')).is.true;
    expect(panel.prop('faktaId')).to.eql(faktaPanelCodes.BEREGNING);
    expect(panel.prop('readOnly')).is.true;
  });
  it('skal vise VurderFaktaBeregning panel', () => {
    const tidsbegrensetAP = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        navn: 'ap1',
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        navn: 's1',
      },
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: true,
      erAktivt: true,
    };
    const wrapper = shallowWithIntl(<BeregningInfoPanelImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      aksjonspunkter={[tidsbegrensetAP]}
      openInfoPanels={['beregning']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly
      hasFaktaForBeregning
      submitCallback={sinon.spy()}
      helpText={helpTexts}
      knappForInntektstabellSkalKunneKlikkes={false}
      faktaTilfeller={[]}
      verdiForAvklarAktivitetErEndret={false}
      isOnHold={false}
    />);
    const panel = wrapper.find(VurderFaktaBeregningPanel);
    expect(panel).has.length(1);
  });


  it('skal ikkje vise VurderFaktaBeregningPanel, kun avklar aktivitet', () => {
    const tidsbegrensetAP = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        navn: 'ap1',
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        navn: 's1',
      },
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: true,
      erAktivt: true,
    };

    const avklarAktiviteterAp = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_AKTIVITETER,
        navn: 'ap1',
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        navn: 's1',
      },
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: true,
      erAktivt: true,
    };

    const wrapper = shallowWithIntl(<BeregningInfoPanelImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      aksjonspunkter={[tidsbegrensetAP, avklarAktiviteterAp]}
      openInfoPanels={['beregning']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly
      hasFaktaForBeregning
      submitCallback={sinon.spy()}
      helpText={helpTexts}
      knappForInntektstabellSkalKunneKlikkes={false}
      faktaTilfeller={[]}
      verdiForAvklarAktivitetErEndret
      isOnHold={false}
    />);
    const faktaPanel = wrapper.find(VurderFaktaBeregningPanel);
    expect(faktaPanel).has.length(0);

    const avklarPanel = wrapper.find(AvklareAktiviteterPanel);
    expect(avklarPanel).has.length(1);
  });

  it('skal kun submitte values fra avklar aktiviteter', () => {
    const transformValuesAvklarAktiviteter = () => ({
      avklarAktiviteter: {
        ventelonnVartpenger: {
          inkludert: true,
        },
      },
    });
    const transformValuesFaktaATFL = () => ({
      fakta: {
        detteErEnTest: 'test',
      },
    });
    const values = transformValues.resultFunc(transformValuesFaktaATFL, transformValuesAvklarAktiviteter)({});
    expect(values.avklarAktiviteter.ventelonnVartpenger.inkludert).to.equal(true);
    expect(values.fakta).to.equal(undefined);
  });

  it('skal submitte values fra fakta', () => {
    const transformValuesAvklarAktiviteter = () => (null);
    const transformValuesFaktaATFL = () => ({
      fakta: {
        detteErEnTest: 'test',
      },
    });
    const values = transformValues.resultFunc(transformValuesFaktaATFL, transformValuesAvklarAktiviteter)({});
    expect(values.avklarAktiviteter).to.equal(undefined);
    expect(values.fakta.detteErEnTest).to.equal('test');
  });
});
