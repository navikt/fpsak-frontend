import React from 'react';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import sinon from 'sinon';
import { expect } from 'chai';
import Modal from 'nav-frontend-modal';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { DelOppPeriodeModalImpl } from './DelOppPeriodeModal';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-proses-uttak';

describe('<DelOppPeriodeModal>', () => {
  const periodeData = {
    fom: '2018-01-01',
    tom: '2018-03-01',
  };
  const cancelEvent = sinon.spy();

  it('skal rendre modal for del opp periode', () => {
    const wrapper = shallowWithIntl(<DelOppPeriodeModalImpl
      {...reduxFormPropsMock}
      periodeData={periodeData}
      showModal
      intl={intlMock}
      cancelEvent={cancelEvent}
    />);
    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('closeButton')).is.false;
    expect(modal.prop('onRequestClose')).to.eql(cancelEvent);
    const datepicker = wrapper.find('DatepickerField');
    expect(datepicker).to.have.length(1);
  });

  it('skal rendre lukket modal', () => {
    const wrapper = shallowWithIntl(<DelOppPeriodeModalImpl
      {...reduxFormPropsMock}
      periodeData={periodeData}
      showModal={false}
      intl={intlMock}
      cancelEvent={cancelEvent}
    />);
    const modal = wrapper.find(Modal);
    expect(modal.prop('isOpen')).is.false;
  });

  it('skal lukke modal ved klikk på avbryt-knapp', () => {
    const wrapper = shallowWithIntl(<DelOppPeriodeModalImpl
      {...reduxFormPropsMock}
      periodeData={periodeData}
      showModal
      intl={intlMock}
      cancelEvent={cancelEvent}
    />);
    wrapper.find('Knapp').simulate('click');
    expect(cancelEvent).to.have.property('callCount', 1);
  });
});
