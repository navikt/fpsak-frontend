import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import sinon from 'sinon';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';

import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import faktaPanelCodes from 'fakta/faktaPanelCodes';
import { FormattedMessage } from 'react-intl';
import FaktaEkspandertpanel from 'fakta/components/FaktaEkspandertpanel';
import aksjonspunktStatus from 'kodeverk/aksjonspunktStatus';
import { BeregningInfoPanelImpl } from './BeregningInfoPanel';
import FaktaForATFLOgSNPanel from './fellesFaktaForATFLogSN/FaktaForATFLOgSNPanel';

const helpTexts = [<FormattedMessage key="AvklarBGTilstøtendeYtelse" id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning.TilstøtendeYtelse" />];

describe('<BeregningInfoPanel>', () => {
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
      faktaTilfeller={[]}
    />);
    const panel = wrapper.find(FaktaEkspandertpanel);
    expect(panel).has.length(1);
    expect(panel.prop('title')).to.eql('Fakta om beregning');
    expect(panel.prop('isInfoPanelOpen')).is.true;
    expect(panel.prop('faktaId')).to.eql(faktaPanelCodes.BEREGNING);
    expect(panel.prop('readOnly')).is.true;
  });
  it('skal vise FaktaForATFLOgSN panel', () => {
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
    />);
    const panel = wrapper.find(FaktaForATFLOgSNPanel);
    expect(panel).has.length(1);
  });
});
