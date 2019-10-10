import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import MannAdoptererAleneFaktaForm from './MannAdoptererAleneFaktaForm';

describe('<MannAdoptererAleneFaktaForm>', () => {
  it('skal rendre form som lar NAV-ansatt velge om mann adopterer alene eller ei', () => {
    const wrapper = shallow(
      <MannAdoptererAleneFaktaForm
        readOnly={false}
        mannAdoptererAlene
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
      />,
    );

    const radioFields = wrapper.find('RadioOption');
    expect(radioFields).to.have.length(2);
    expect(radioFields.first().prop('label').id).to.eql('MannAdoptererAleneFaktaForm.AdoptererAlene');
    expect(radioFields.last().prop('label').id).to.eql('MannAdoptererAleneFaktaForm.AdoptererIkkeAlene');
  });

  it('skal sette initielle verdi for mannAdoptererAlene til undefined når ingen data finnes i avklarte data', () => {
    const soknad = {
      farSokerType: 'test',
    };
    const initialValues = MannAdoptererAleneFaktaForm.buildInitialValues(soknad);

    expect(initialValues).to.eql({
      mannAdoptererAlene: undefined,
    });
  });

  it('skal sette initielle verdi for mannAdoptererAlene til verdi i avklarte data', () => {
    const familiehendelse = {
      mannAdoptererAlene: true,
    };
    const soknad = {
      farSokerType: 'test',
    };

    const initialValues = MannAdoptererAleneFaktaForm.buildInitialValues(soknad, familiehendelse);

    expect(initialValues).to.eql({
      mannAdoptererAlene: true,
    });
  });
});
