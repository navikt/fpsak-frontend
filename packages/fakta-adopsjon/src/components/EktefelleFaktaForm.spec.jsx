import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { EktefelleFaktaForm } from './EktefelleFaktaForm';

describe('<EktefelleFaktaForm>', () => {
  it('skal rendre form som lar NAV-ansatt velge om barnet er ektefelles barn eller ei', () => {
    const wrapper = shallow(<EktefelleFaktaForm
      readOnly={false}
      alleMerknaderFraBeslutter={{}}
    />);

    const radioFields = wrapper.find('RadioOption');
    expect(radioFields).to.have.length(2);
    expect(radioFields.first().prop('label').id).to.eql('EktefelleFaktaForm.ErIkkeValg');
    expect(radioFields.last().prop('label').id).to.eql('EktefelleFaktaForm.ErValg');
  });

  it('skal sette initielle verdi for ektefellesBarn til undefined når ingen data finnes i avklarte data', () => {
    const initialValues = EktefelleFaktaForm.buildInitialValues({});

    expect(initialValues).to.eql({
      ektefellesBarn: undefined,
    });
  });

  it('skal sette initielle verdi for ektefellesBarn til verdi i avklarte data', () => {
    const familiehendelse = {
      ektefellesBarn: true,
    };

    const initialValues = EktefelleFaktaForm.buildInitialValues(familiehendelse);

    expect(initialValues).to.eql({
      ektefellesBarn: true,
    });
  });
});
