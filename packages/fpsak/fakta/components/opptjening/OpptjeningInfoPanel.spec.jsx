import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import faktaPanelCodes from 'fakta/faktaPanelCodes';
import FaktaEkspandertpanel from 'fakta/components/FaktaEkspandertpanel';
import { OpptjeningInfoPanelImpl, buildInitialValues } from './OpptjeningInfoPanel';
import OpptjeningFaktaForm from './OpptjeningFaktaForm';

describe('<OpptjeningInfoPanel>', () => {
  it('skal vise opptjeningspanel', () => {
    const wrapper = shallowWithIntl(<OpptjeningInfoPanelImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      openInfoPanels={[faktaPanelCodes.OPPTJENINGSVILKARET]}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      readOnly={false}
    />);

    const faktaPanel = wrapper.find(FaktaEkspandertpanel);
    expect(faktaPanel).to.have.length(1);
    expect(faktaPanel.prop('hasOpenAksjonspunkter')).is.true;
    expect(faktaPanel.prop('isInfoPanelOpen')).is.true;
    expect(faktaPanel.prop('readOnly')).is.false;

    const opptjeningForm = wrapper.find(OpptjeningFaktaForm);
    expect(opptjeningForm).to.have.length(1);
    expect(opptjeningForm.prop('readOnly')).is.false;
  });

  it('skal ikke bruke aktiviteter som er utenfor opptjeningperioden', () => {
    const opptjeningActivities = [{
      opptjeningFom: '2017-06-01',
      opptjeningTom: '2017-12-31',
      begrunnelse: 'test1',
    }, {
      opptjeningFom: '2018-10-02',
      opptjeningTom: '2019-06-01',
      begrunnelse: 'test2',
    }, {
      opptjeningFom: '2017-12-15',
      opptjeningTom: '2018-11-01',
      begrunnelse: 'test3',
    }, {
      opptjeningFom: '2017-12-15',
      opptjeningTom: '2018-01-01',
      begrunnelse: 'test4',
    }, {
      opptjeningFom: '2018-10-01',
      opptjeningTom: '2018-12-01',
      begrunnelse: 'test5',
    }];
    const fastsattOpptjening = {
      opptjeningFom: '2018-01-01',
      opptjeningTom: '2018-10-01',
    };

    const initialValues = buildInitialValues.resultFunc(opptjeningActivities, fastsattOpptjening);
    expect(initialValues).is.eql({
      opptjeningActivities: [{
        opptjeningFom: '2018-01-01',
        opptjeningTom: '2018-10-01',
        begrunnelse: 'test3',
        originalFom: '2017-12-15',
        originalTom: '2018-11-01',
        id: 1,
      }, {
        opptjeningFom: '2018-01-01',
        opptjeningTom: '2018-01-01',
        begrunnelse: 'test4',
        originalFom: '2017-12-15',
        originalTom: '2018-01-01',
        id: 2,
      }, {
        opptjeningFom: '2018-10-01',
        opptjeningTom: '2018-10-01',
        begrunnelse: 'test5',
        originalFom: '2018-10-01',
        originalTom: '2018-12-01',
        id: 3,
      }],
    });
  });
});
