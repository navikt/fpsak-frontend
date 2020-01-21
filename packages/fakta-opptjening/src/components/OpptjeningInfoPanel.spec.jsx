import React from 'react';
import { expect } from 'chai';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { buildInitialValues, OpptjeningInfoPanel } from './OpptjeningInfoPanel';
import OpptjeningFaktaForm from './OpptjeningFaktaForm';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-fakta-opptjening';

describe('<OpptjeningInfoPanel>', () => {
  it('skal vise opptjeningspanel', () => {
    const wrapper = shallowWithIntl(<OpptjeningInfoPanel
      {...reduxFormPropsMock}
      intl={intlMock}
      hasOpenAksjonspunkter
      readOnly={false}
      fastsattOpptjening={{
        opptjeningFom: '2017-01-01',
        opptjeningTom: '2017-10-01',
      }}
      alleMerknaderFraBeslutter={{}}
      alleKodeverk={{}}
    />);

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
    const aksjonspunkter = [{ definisjon: { kode: '5058' }, erAktivt: true, toTrinnsBehandling: false }];

    const initialValues = buildInitialValues.resultFunc(opptjeningActivities, fastsattOpptjening, aksjonspunkter);
    expect(initialValues).is.eql({
      aksjonspunkt: [],
      fastsattOpptjening: {
        opptjeningFom: '2018-01-01',
        opptjeningTom: '2018-10-01',
      },
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
  it('skal ikke bruke aktiviteter som er utenfor opptjeningperioden og vise korrekt aksjonspunkt', () => {
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
    const aksjonspunkter = [{ definisjon: { kode: '5051' }, erAktivt: true, toTrinnsBehandling: false },
      { definisjon: { kode: '5080' }, erAktivt: true, toTrinnsBehandling: false }];

    const initialValues = buildInitialValues.resultFunc(opptjeningActivities, fastsattOpptjening, aksjonspunkter);
    expect(initialValues).is.eql({
      aksjonspunkt: [{
        definisjon: {
          kode: '5051',
        },
        erAktivt: true,
        toTrinnsBehandling: false,
      }],
      fastsattOpptjening: {
        opptjeningFom: '2018-01-01',
        opptjeningTom: '2018-10-01',
      },
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
