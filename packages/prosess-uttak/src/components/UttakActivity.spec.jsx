import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import sinon from 'sinon';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { initialValue, UttakActivity } from './UttakActivity';

describe('<UttakActivity>', () => {
  const selectedItem = {
    id: 1,
    fom: '2018-01-01',
    tom: '2018-02-01',
    periodeResultatType: {
      kode: '',
      navn: '',
      kodeverk: '',
    },
    periodeResultatÅrsak: {
      kode: '',
      navn: '',
      kodeverk: '',
    },
    flerbarnsdager: false,
    utsettelseType: {
      kode: '-',
    },
    periodeType: {
      kode: '-',
    },
    oppholdÅrsak: {
      kode: '-',
    },
    aktiviteter: [{
      trekkdagerDesimaler: 28.5,
      utbetalingsgrad: 100,
      stønadskontoType: {
        kode: '',
        navn: 'Mødrekvote',
        kodeverk: '',
      },
    }],
  };
  it('skal rendre uttakactivity med oppfylt periode', () => {
    const wrapper = shallow(<UttakActivity
      {...reduxFormPropsMock}
      erOppfylt
      selectedItemData={selectedItem}
      readOnly={false}
      periodeTyper={[]}
      oppholdArsakTyper={[]}
      cancelSelectedActivity={sinon.spy()}
      avslagAarsakKoder={[{ kode: '4011', navn: 'mitt navn', kodeverk: 'MITT_KODEVERK' }]}
      innvilgelseAarsakKoder={[]}
      graderingAvslagAarsakKoder={[]}
      starttidspunktForeldrepenger=""
      stonadskontoer={{}}
      harSoktOmFlerbarnsdager={false}
      hasValidationError={false}
      alleKodeverk={{}}
    />);

    const fieldArray = wrapper.find('FieldArray');
    expect(fieldArray).to.have.length(1);
    const radioGroup = wrapper.find('RadioGroupField');
    expect(radioGroup).to.have.length(1);
    const selectAvslag = wrapper.find('SelectField');
    expect(selectAvslag).to.have.length(1);
    const textArea = wrapper.find('TextAreaField');
    expect(textArea).to.have.length(1);
    const updateKnapp = wrapper.find('Hovedknapp');
    expect(updateKnapp).to.have.length(1);
    const cancelKnapp = wrapper.find('Knapp');
    expect(cancelKnapp).to.have.length(1);
  });

  it('skal rendre rows and columns', () => {
    const wrapper = shallow(<UttakActivity
      {...reduxFormPropsMock}
      erOppfylt
      isApOpen={false}
      selectedItemData={selectedItem}
      readOnly={false}
      periodeTyper={[]}
      oppholdArsakTyper={[]}
      cancelSelectedActivity={sinon.spy()}
      avslagAarsakKoder={[{ kode: '4011', navn: 'mitt navn', kodeverk: 'MITT_KODEVERK' }]}
      innvilgelseAarsakKoder={[]}
      graderingAvslagAarsakKoder={[]}
      starttidspunktForeldrepenger=""
      stonadskontoer={{}}
      harSoktOmFlerbarnsdager={false}
      hasValidationError={false}
      alleKodeverk={{}}
    />);

    const row = wrapper.find('Row');
    expect(row).to.have.length(2);
    const column = wrapper.find('Column');
    expect(column).to.have.length(1);
    const formattedMessage = wrapper.find('FormattedMessage');
    expect(formattedMessage).to.have.length(2);
  });

  it('skal rendre uttakactivity med ikke oppfylt', () => {
    const wrapper = shallow(<UttakActivity
      {...reduxFormPropsMock}
      erOppfylt={false}
      readOnly={false}
      selectedItemData={selectedItem}
      periodeTyper={[]}
      oppholdArsakTyper={[]}
      cancelSelectedActivity={sinon.spy()}
      avslagAarsakKoder={[{ kode: '4011', navn: 'mitt navn', kodeverk: 'MITT_KODEVERK' }]}
      innvilgelseAarsakKoder={[]}
      graderingAvslagAarsakKoder={[]}
      starttidspunktForeldrepenger=""
      stonadskontoer={{}}
      harSoktOmFlerbarnsdager={false}
      hasValidationError={false}
      alleKodeverk={{}}
    />);

    const fieldArray = wrapper.find('FieldArray');
    expect(fieldArray).to.have.length(1);
    const radioGroup = wrapper.find('RadioGroupField');
    expect(radioGroup).to.have.length(1);
    const selectAvslag = wrapper.find('SelectField');
    expect(selectAvslag).to.have.length(1);
    const textArea = wrapper.find('TextAreaField');
    expect(textArea).to.have.length(1);
    const updateKnapp = wrapper.find('Hovedknapp');
    expect(updateKnapp).to.have.length(1);
    const cancelKnapp = wrapper.find('Knapp');
    expect(cancelKnapp).to.have.length(1);
  });

  it('skal rendre uttakactivity med aksjonspunkt', () => {
    const wrapper = shallow(<UttakActivity
      {...reduxFormPropsMock}
      erOppfylt="undefined"
      readOnly={false}
      selectedItemData={selectedItem}
      periodeTyper={[]}
      oppholdArsakTyper={[]}
      cancelSelectedActivity={sinon.spy()}
      avslagAarsakKoder={[]}
      innvilgelseAarsakKoder={[{ kode: '4011', navn: 'mitt navn', kodeverk: 'MITT_KODEVERK' }]}
      graderingAvslagAarsakKoder={[]}
      starttidspunktForeldrepenger=""
      stonadskontoer={{}}
      harSoktOmFlerbarnsdager={false}
      hasValidationError={false}
      alleKodeverk={{}}
    />);

    const fieldArray = wrapper.find('FieldArray');
    expect(fieldArray).to.have.length(1);
    const radioGroup = wrapper.find('RadioGroupField');
    expect(radioGroup).to.have.length(1);
    const selectAvslag = wrapper.find('SelectField');
    expect(selectAvslag).to.have.length(1);
    const textArea = wrapper.find('TextAreaField');
    expect(textArea).to.have.length(1);
    const updateKnapp = wrapper.find('Hovedknapp');
    expect(updateKnapp).to.have.length(1);
    const cancelKnapp = wrapper.find('Knapp');
    expect(cancelKnapp).to.have.length(1);
  });

  it('skal rendre uttakactivity readonly', () => {
    const wrapper = shallow(<UttakActivity
      {...reduxFormPropsMock}
      erOppfylt
      selectedItemData={selectedItem}
      readOnly
      periodeTyper={[]}
      oppholdArsakTyper={[]}
      cancelSelectedActivity={sinon.spy()}
      avslagAarsakKoder={[{ kode: '4011', navn: 'mitt navn', kodeverk: 'MITT_KODEVERK' }]}
      innvilgelseAarsakKoder={[]}
      graderingAvslagAarsakKoder={[]}
      starttidspunktForeldrepenger=""
      stonadskontoer={{}}
      harSoktOmFlerbarnsdager={false}
      hasValidationError={false}
      alleKodeverk={{}}
    />);

    const fieldArray = wrapper.find('FieldArray');
    expect(fieldArray).to.have.length(1);
    const radioGroup = wrapper.find('RadioGroupField');
    expect(radioGroup).to.have.length(0);
    const selectAvslag = wrapper.find('SelectField');
    expect(selectAvslag).to.have.length(0);
    const textArea = wrapper.find('TextAreaField');
    expect(textArea).to.have.length(1);
    const updateKnapp = wrapper.find('Hovedknapp');
    expect(updateKnapp).to.have.length(0);
    const cancelKnapp = wrapper.find('Knapp');
    expect(cancelKnapp).to.have.length(0);
  });

  it('skal sette opp initial values for perioder', () => {
    const initialValues = initialValue(selectedItem);
    expect(initialValues).to.eql([{
      days: '3.5',
      fom: '2018-01-01',
      tom: '2018-02-01',
      stønadskontoType: {
        kode: '',
        navn: 'Mødrekvote',
        kodeverk: '',
      },
      trekkdagerDesimaler: 28.5,
      utbetalingsgrad: 100,
      weeks: 5,
    }]);
  });
});
