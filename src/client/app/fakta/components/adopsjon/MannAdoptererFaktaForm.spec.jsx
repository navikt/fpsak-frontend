import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import MannAdoptererFaktaForm from './MannAdoptererFaktaForm';

describe('<MannAdoptererFaktaForm>', () => {
  const model = {
    mannAdoptererAlene: true,
    farSokerType: {
      navn: 'Adopterer alene',
      kode: '',
    },
  };

  it('skal rendre form som lar NAV-ansatt velge om mann adopterer alene eller ei', () => {
    const wrapper = shallowWithIntl(<MannAdoptererFaktaForm.WrappedComponent
      intl={intlMock}
      aksjonspunktData={model}
      readOnly={false}
      error={false}
    />);

    const radioFields = wrapper.find('RadioOption');
    expect(radioFields).to.have.length(2);
    expect(radioFields.first().prop('label').id).to.eql('MannAdoptererAleneFaktaForm.AdoptererAlene');
    expect(radioFields.last().prop('label').id).to.eql('MannAdoptererAleneFaktaForm.AdoptererIkkeAlene');
  });

  it('skal sette initielle verdi for mannAdoptererAlene til undefined når ingen data finnes i avklarte data', () => {
    const soknad = {
      farSokerType: 'test',
    };
    const initialValues = MannAdoptererFaktaForm.buildInitialValues(soknad);

    expect(initialValues).to.eql({
      mannAdoptererAlene: undefined,
      farSokerType: 'test',
    });
  });

  it('skal sette initielle verdi for mannAdoptererAlene til verdi i avklarte data', () => {
    const familiehendelse = {
      mannAdoptererAlene: true,
    };
    const soknad = {
      farSokerType: 'test',
    };

    const initialValues = MannAdoptererFaktaForm.buildInitialValues(soknad, familiehendelse);

    expect(initialValues).to.eql({
      mannAdoptererAlene: true,
      farSokerType: 'test',
    });
  });
});
