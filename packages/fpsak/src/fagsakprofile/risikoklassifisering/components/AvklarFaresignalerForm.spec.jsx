import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { RadioOption, RadioGroupField, TextAreaField } from '@fpsak-frontend/form';
import faresignalVurdering from '@fpsak-frontend/kodeverk/src/faresignalVurdering';

import {
  AvklarFaresignalerForm as UnwrappedForm, buildInitialValues, begrunnelseFieldName, radioFieldName,
} from './AvklarFaresignalerForm';

const mockAksjonspunkt = (status, begrunnelse) => ({
  definisjon: {
    kode: '5095',
  },
  status: {
    kode: status,
  },
  begrunnelse,
  kanLoses: true,
  erAktivt: true,
});

const mockRisikoklassifisering = (kode) => ({
  kontrollresultat: {
    kode: 'HOY',
    kodeverk: 'Kontrollresultat',
  },
  faresignalVurdering: {
    kode,
    kodeverk: 'Faresignalvurdering',
  },
  medlFaresignaler: undefined,
  iayFaresignaler: undefined,
});

describe('<AvklarFaresignalerForm>', () => {
  it('skal teste at komponent mountes korrekt med inputfelter', () => {
    const wrapper = shallow(<UnwrappedForm
      readOnly
      aksjonspunkt={mockAksjonspunkt('UTFO', undefined)}
      formProps={reduxFormPropsMock}
    />);
    expect(wrapper.find(TextAreaField)).has.length(1);
    expect(wrapper.find(RadioOption)).has.length(2);
    expect(wrapper.find(RadioGroupField)).has.length(1);
  });

  it('skal teste at komponent gir inputfelter korrekte verdier', () => {
    const wrapper = shallow(<UnwrappedForm
      readOnly
      aksjonspunkt={mockAksjonspunkt('UTFO', undefined)}
      formProps={reduxFormPropsMock}
    />);
    const textArea = wrapper.find('TextAreaField');
    expect(textArea.props().readOnly).to.equal(true);

    const radioGroup = wrapper.find('RadioGroupField');
    expect(radioGroup.props().readOnly).to.equal(true);
    expect(radioGroup.props().isEdited).to.equal(true);
  });

  it('skal teste at buildInitialValues gir korrekte verdier', () => {
    const expectedInitialValues = {
      [begrunnelseFieldName]: 'Dette er en begrunnelse',
      [radioFieldName]: true,
    };
    const actualValues = buildInitialValues.resultFunc(mockRisikoklassifisering(faresignalVurdering.INNVIRKNING),
      mockAksjonspunkt('UTFO', 'Dette er en begrunnelse'));

    expect(actualValues).to.deep.equal(expectedInitialValues);
  });
});
