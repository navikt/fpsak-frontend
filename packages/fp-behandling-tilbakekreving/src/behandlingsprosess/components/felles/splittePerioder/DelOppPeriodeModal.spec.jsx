import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import Modal from 'nav-frontend-modal';
import { Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import { DatepickerField } from '@fpsak-frontend/form';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import { DelOppPeriodeModalImpl, mapStateToPropsFactory } from './DelOppPeriodeModal';

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
    expect(modal.prop('contentLabel')).to.eql('Periode er splittet');
    expect(modal.prop('onRequestClose')).to.eql(cancelEvent);

    const datepicker = wrapper.find(DatepickerField);
    expect(datepicker).to.have.length(1);

    expect(wrapper.find(Normaltekst).childAt(0).text()).to.eql('01.01.2018 - 01.03.2018');
  });

  it('skal lukke modal ved klikk på avbryt-knapp', () => {
    const wrapper = shallowWithIntl(<DelOppPeriodeModalImpl
      {...reduxFormPropsMock}
      periodeData={periodeData}
      showModal
      intl={intlMock}
      cancelEvent={cancelEvent}
    />);
    wrapper.find(Knapp).simulate('click');
    expect(cancelEvent).to.have.property('callCount', 1);
  });

  it('skal validere ok når valgt dato er innenfor periode', () => {
    const initialState = {};
    const ownProps = {
      periodeData: {
        fom: '2019-10-10',
        tom: '2019-11-10',
      },
    };

    const validateAndOnSubmit = mapStateToPropsFactory(initialState, ownProps)();

    const values = {
      ForstePeriodeTomDato: '2019-10-20',
    };
    const result = validateAndOnSubmit.validate(values);
    expect(result).to.eql(null);
  });

  it('skal gi feilmelding når valgt dato er før periode', () => {
    const initialState = {};
    const ownProps = {
      periodeData: {
        fom: '2019-10-10',
        tom: '2019-11-10',
      },
    };

    const validateAndOnSubmit = mapStateToPropsFactory(initialState, ownProps)();

    const values = {
      ForstePeriodeTomDato: '2019-10-09',
    };
    const result = validateAndOnSubmit.validate(values);
    expect(result).to.eql({
      ForstePeriodeTomDato: [{ id: 'DelOppPeriodeModalImpl.DatoUtenforPeriode' }],
    });
  });

  it('skal gi feilmelding når valgt dato er etter periode', () => {
    const initialState = {};
    const ownProps = {
      periodeData: {
        fom: '2019-10-10',
        tom: '2019-11-10',
      },
    };

    const validateAndOnSubmit = mapStateToPropsFactory(initialState, ownProps)();

    const values = {
      ForstePeriodeTomDato: '2019-11-11',
    };
    const result = validateAndOnSubmit.validate(values);
    expect(result).to.eql({
      ForstePeriodeTomDato: [{ id: 'DelOppPeriodeModalImpl.DatoUtenforPeriode' }],
    });
  });

  it('skal transformere form-data før splitting av perioder', () => {
    const initialState = {};
    const ownProps = {
      periodeData: {
        fom: '2019-10-10',
        tom: '2019-11-10',
      },
      splitPeriod: value => value,
    };

    const validateAndOnSubmit = mapStateToPropsFactory(initialState, ownProps)();

    const values = {
      ForstePeriodeTomDato: '2019-10-20',
    };
    const result = validateAndOnSubmit.onSubmit(values);
    expect(result).to.eql({
      forstePeriode: {
        fom: '2019-10-10',
        tom: '2019-10-20',
      },
      andrePeriode: {
        fom: '2019-10-21',
        tom: '2019-11-10',
      },
    });
  });
});
