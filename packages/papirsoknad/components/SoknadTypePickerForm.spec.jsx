import React from 'react';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import familieHendelseType from 'kodeverk/familieHendelseType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import foreldreType from 'kodeverk/foreldreType';
import soknadTypeTillegg from 'kodeverk/soknadTypeTillegg';

import RadioGroupField from 'form/fields/RadioGroupField';
import RadioOption from 'form/fields/RadioOption';
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

  it('radioknapper for tema og foreldretype skal vere disabled ved endring av foreldrepenger', () => {
    const familieHendelseTyper = [{ kode: familieHendelseType.ADOPSJON, navn: 'Adopsjon' }];
    const fagsakYtelseTyper = [{ kode: fagsakYtelseType.ENDRING_FORELDREPENGER, navn: 'Endring foreldrepenger' }];
    const foreldreTyper = [{ kode: foreldreType.MOR, navn: 'Mor' }];
    const soknadTypeTillegger = [{ kode: soknadTypeTillegg.UTSETTELSE, navn: 'Utsettelse' }];
    const selectedFagsakYtelseType = fagsakYtelseType.ENDRING_FORELDREPENGER;

    const wrapper = shallow(<SoknadTypePickerForm
      {...reduxFormPropsMock}
      familieHendelseTyper={familieHendelseTyper}
      fagsakYtelseTyper={fagsakYtelseTyper}
      foreldreTyper={foreldreTyper}
      soknadTypeTillegg={soknadTypeTillegger}
      selectedFagsakYtelseType={selectedFagsakYtelseType}
      ytelseErSatt={false}
    />);

    const radioGroupFields = wrapper.find(RadioGroupField);
    expect(radioGroupFields).has.length(3);


    const radioOptionTema = radioGroupFields.at(1).find(RadioOption);
    expect(radioOptionTema).has.length(1);
    expect(radioOptionTema.prop('disabled')).is.equal(true);

    const radioOptionForeldretype = radioGroupFields.at(2).find(RadioOption);
    expect(radioOptionForeldretype).has.length(1);
    expect(radioOptionForeldretype.prop('disabled')).is.equal(true);
  });

  it('radioknapper for ytelsetype skal vere disabled om ytelsetype er satt i fagsaken', () => {
    const familieHendelseTyper = [{ kode: familieHendelseType.ADOPSJON, navn: 'Adopsjon' }];
    const fagsakYtelseTyper = [{ kode: fagsakYtelseType.ENDRING_FORELDREPENGER, navn: 'Endring foreldrepenger' }];
    const foreldreTyper = [{ kode: foreldreType.MOR, navn: 'Mor' }];
    const soknadTypeTillegger = [{ kode: soknadTypeTillegg.UTSETTELSE, navn: 'Utsettelse' }];
    const selectedFagsakYtelseType = fagsakYtelseType.ENDRING_FORELDREPENGER;

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


  it('skal kalle submitevent', () => {
    const familieHendelseTyper = [{ kode: familieHendelseType.ADOPSJON, navn: 'Adopsjon' }];
    const fagsakYtelseTyper = [{ kode: fagsakYtelseType.ENDRING_FORELDREPENGER, navn: 'Endring foreldrepenger' }];
    const foreldreTyper = [{ kode: foreldreType.MOR, navn: 'Mor' }];
    const selectedFagsakYtelseType = fagsakYtelseType.ENDRING_FORELDREPENGER;

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
    expect(radioOptionTema.prop('disabled')).is.equal(true);

    const radioOptionForeldretype = radioGroupFields.at(2).find(RadioOption);
    expect(radioOptionForeldretype).has.length(1);
    expect(radioOptionForeldretype.prop('disabled')).is.equal(true);

    const form = wrapper.find('form');
    form.simulate('submit', { preventDefault() {} });

    expect(submitEvent).to.have.property('callCount', 1);
  });
});
