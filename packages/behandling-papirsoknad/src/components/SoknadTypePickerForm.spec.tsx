import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import familieHendelseType from '@fpsak-frontend/kodeverk/src/familieHendelseType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import foreldreType from '@fpsak-frontend/kodeverk/src/foreldreType';
import soknadTypeTillegg from '@fpsak-frontend/kodeverk/src/soknadTypeTillegg';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';

import { SoknadTypePickerForm } from './SoknadTypePickerForm';

describe('<SoknadTypePickerForm>', () => {
  it('skal rendre komponent og vise kodeverk i radioknapper', () => {
    const familieHendelseTyper = [{ kode: familieHendelseType.ADOPSJON, navn: 'Adopsjon' }];
    const fagsakYtelseTyper = [{ kode: fagsakYtelseType.FORELDREPENGER, navn: 'Foreldrepenger' }];
    const foreldreTyper = [{ kode: foreldreType.MOR, navn: 'Mor' }];
    const soknadTypeTillegger = [{ kode: soknadTypeTillegg.UTSETTELSE, navn: 'Utsettelse' }];
    const ytelseErSatt = false;

    const wrapper = shallow(<SoknadTypePickerForm
      {...reduxFormPropsMock}
      familieHendelseTyper={familieHendelseTyper}
      fagsakYtelseTyper={fagsakYtelseTyper}
      foreldreTyper={foreldreTyper}
      soknadTypeTillegg={soknadTypeTillegger}
      ytelseErSatt={ytelseErSatt}
    />);

    const radioGroupFields = wrapper.find(RadioGroupField);
    expect(radioGroupFields).has.length(3);

    const radioOptionsField1 = radioGroupFields.first().find(RadioOption);
    expect(radioOptionsField1).has.length(1);
    expect(radioOptionsField1.prop('label')).is.equal('Foreldrepenger');

    const radioOptionsField2 = radioGroupFields.at(1).find(RadioOption);
    expect(radioOptionsField2).has.length(1);
    expect(radioOptionsField2.prop('label')).is.equal('Adopsjon');

    const radioOptionsField3 = radioGroupFields.last().find(RadioOption);
    expect(radioOptionsField3).has.length(1);
    expect(radioOptionsField3.prop('label')).is.equal('Mor');
  });

  it('radioknapper for ytelsetype skal vere disabled om ytelsetype er satt i fagsaken', () => {
    const familieHendelseTyper = [{ kode: familieHendelseType.ADOPSJON, navn: 'Adopsjon' }];
    const fagsakYtelseTyper = [{ kode: fagsakYtelseType.FORELDREPENGER, navn: 'Endring foreldrepenger' }];
    const foreldreTyper = [{ kode: foreldreType.MOR, navn: 'Mor' }];
    const soknadTypeTillegger = [{ kode: soknadTypeTillegg.UTSETTELSE, navn: 'Utsettelse' }];
    const selectedFagsakYtelseType = fagsakYtelseType.FORELDREPENGER;

    const wrapper = shallow(<SoknadTypePickerForm
      {...reduxFormPropsMock}
      familieHendelseTyper={familieHendelseTyper}
      fagsakYtelseTyper={fagsakYtelseTyper}
      foreldreTyper={foreldreTyper}
      soknadTypeTillegg={soknadTypeTillegger}
      selectedFagsakYtelseType={selectedFagsakYtelseType}
      ytelseErSatt
    />);

    const radioGroupFields = wrapper.find(RadioGroupField);

    const radioOptionTema = radioGroupFields.at(0).find(RadioOption);
    expect(radioOptionTema.prop('disabled')).is.equal(true);
  });

  it('radioknapper for familieHendelseType skal vere disabled og validering slått av når ytelsetype er svangerskapspenger', () => {
    const familieHendelseTyper = [{ kode: familieHendelseType.ADOPSJON, navn: 'Adopsjon' }];
    const fagsakYtelseTyper = [{ kode: fagsakYtelseType.SVANGERSKAPSPENGER, navn: 'Endring foreldrepenger' }];
    const foreldreTyper = [{ kode: foreldreType.MOR, navn: 'Mor' }];
    const soknadTypeTillegger = [{ kode: soknadTypeTillegg.UTSETTELSE, navn: 'Utsettelse' }];
    const selectedFagsakYtelseType = fagsakYtelseType.SVANGERSKAPSPENGER;

    const wrapper = shallow(<SoknadTypePickerForm
      {...reduxFormPropsMock}
      familieHendelseTyper={familieHendelseTyper}
      fagsakYtelseTyper={fagsakYtelseTyper}
      foreldreTyper={foreldreTyper}
      soknadTypeTillegg={soknadTypeTillegger}
      selectedFagsakYtelseType={selectedFagsakYtelseType}
      ytelseErSatt
    />);

    const familieHendelseRadioGroup = wrapper.find('[name="familieHendelseType"]');
    expect(familieHendelseRadioGroup.prop('validate')).is.eql([]);

    const familieHendelseRadioButton = familieHendelseRadioGroup.at(0).find(RadioOption);
    expect(familieHendelseRadioButton.prop('disabled')).is.true;
  });

  it('skal kalle submitevent', () => {
    const familieHendelseTyper = [{ kode: familieHendelseType.ADOPSJON, navn: 'Adopsjon' }];
    const fagsakYtelseTyper = [{ kode: fagsakYtelseType.FORELDREPENGER, navn: 'Endring foreldrepenger' }];
    const foreldreTyper = [{ kode: foreldreType.MOR, navn: 'Mor' }];
    const selectedFagsakYtelseType = fagsakYtelseType.FORELDREPENGER;

    const submitEvent = sinon.spy();

    const wrapper = shallow(<SoknadTypePickerForm
      {...reduxFormPropsMock}
      handleSubmit={submitEvent}
      familieHendelseTyper={familieHendelseTyper}
      fagsakYtelseTyper={fagsakYtelseTyper}
      foreldreTyper={foreldreTyper}
      selectedFagsakYtelseType={selectedFagsakYtelseType}
      ytelseErSatt={false}
    />);

    const radioGroupFields = wrapper.find(RadioGroupField);
    expect(radioGroupFields).has.length(3);

    const radioOptionType = radioGroupFields.at(0).find(RadioOption);
    radioOptionType.simulate('click');

    const radioOptionTema = radioGroupFields.at(1).find(RadioOption);
    expect(radioOptionTema).has.length(1);
    expect(radioOptionTema.prop('disabled')).is.false;

    const radioOptionForeldretype = radioGroupFields.at(2).find(RadioOption);
    expect(radioOptionForeldretype).has.length(1);
    expect(radioOptionForeldretype.prop('disabled')).is.false;

    const form = wrapper.find('form');
    form.simulate('submit', { preventDefault() { return undefined; } });

    expect(submitEvent).to.have.property('callCount', 1);
  });
});
