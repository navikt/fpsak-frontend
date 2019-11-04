import React from 'react';
import { expect } from 'chai';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import sinon from 'sinon';

import { faktaPanelCodes, FaktaEkspandertpanel } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { BeregningInfoPanelImpl } from './BeregningInfoPanel';
import VurderFaktaBeregningPanel from './fellesFaktaForATFLogSN/VurderFaktaBeregningPanel';
import AvklareAktiviteterPanel from './avklareAktiviteter/AvklareAktiviteterPanel';

const {
  AVKLAR_AKTIVITETER,
  VURDER_FAKTA_FOR_ATFL_SN,
  OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
  OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
} = aksjonspunktCodes;

const alleKodeverk = {};

const behandlingId = 1;
const behandlingVersjon = 1;


const beregningsgrunnlag = {
  faktaOmBeregning: {
    faktaOmBeregningTilfeller: [],
    andelerForFaktaOmBeregning: [],
  },
};

describe('<BeregningInfoPanel>', () => {
  it('skal vise ekspanderbart panel', () => {
    const wrapper = shallowWithIntl(<BeregningInfoPanelImpl
      intl={intlMock}
      aksjonspunkter={[]}
      openInfoPanels={['beregning']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly
      submitCallback={sinon.spy()}
      alleKodeverk={alleKodeverk}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      beregningsgrunnlag={beregningsgrunnlag}
      erOverstyrer={false}
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
        kode: VURDER_FAKTA_FOR_ATFL_SN,
        navn: 'ap1',
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        navn: 's1',
      },
    };

    const wrapper = shallowWithIntl(<BeregningInfoPanelImpl
      intl={intlMock}
      aksjonspunkter={[tidsbegrensetAP]}
      openInfoPanels={['beregning']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly
      alleKodeverk={alleKodeverk}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      submitCallback={sinon.spy()}
      beregningsgrunnlag={beregningsgrunnlag}
      erOverstyrer={false}
    />);
    const panel = wrapper.find(VurderFaktaBeregningPanel);
    expect(panel).has.length(1);
  });

  it('skal vise VurderFaktaBeregning panel med readonly for vanlig saksbehandler uten overstyrerrolle med overstyringsaksjonspunkt', () => {
    const overstyringAP = {
      id: 1,
      definisjon: {
        kode: OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
        navn: 'ap1',
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        navn: 's1',
      },
    };
    const wrapper = shallowWithIntl(<BeregningInfoPanelImpl
      intl={intlMock}
      aksjonspunkter={[overstyringAP]}
      openInfoPanels={['beregning']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      submitCallback={sinon.spy()}
      alleKodeverk={alleKodeverk}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      beregningsgrunnlag={beregningsgrunnlag}
      erOverstyrer={false}
    />);
    const panel = wrapper.find(VurderFaktaBeregningPanel);
    expect(panel).has.length(1);
    expect(panel.prop('readOnly')).to.equal(true);
  });

  it('skal vise AvklareAktiviteterPanel panel med readonly for vanlig saksbehandler uten overstyrerrolle med overstyringsaksjonspunkt', () => {
    const overstyringAP = {
      id: 1,
      definisjon: {
        kode: OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
        navn: 'ap1',
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        navn: 's1',
      },
    };
    const wrapper = shallowWithIntl(<BeregningInfoPanelImpl
      intl={intlMock}
      aksjonspunkter={[overstyringAP]}
      openInfoPanels={['beregning']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      submitCallback={sinon.spy()}
      alleKodeverk={alleKodeverk}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      beregningsgrunnlag={beregningsgrunnlag}
      erOverstyrer={false}
    />);
    const panel = wrapper.find(AvklareAktiviteterPanel);
    expect(panel).has.length(1);
    expect(panel.prop('readOnly')).to.equal(true);
  });

  it('skal vise AvklareAktiviteterPanel panel', () => {
    const tidsbegrensetAP = {
      id: 1,
      definisjon: {
        kode: AVKLAR_AKTIVITETER,
        navn: 'ap1',
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        navn: 's1',
      },
    };
    const wrapper = shallowWithIntl(<BeregningInfoPanelImpl
      intl={intlMock}
      aksjonspunkter={[tidsbegrensetAP]}
      openInfoPanels={['beregning']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly
      submitCallback={sinon.spy()}
      alleKodeverk={alleKodeverk}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      beregningsgrunnlag={beregningsgrunnlag}
      erOverstyrer={false}
    />);
    const panel = wrapper.find(AvklareAktiviteterPanel);
    expect(panel).has.length(1);
  });
});
