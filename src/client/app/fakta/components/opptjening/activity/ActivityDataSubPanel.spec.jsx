import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { InputField, DecimalField } from 'form/Fields';
import DatepickerField from 'form/fields/DatepickerField';
import OAType from 'kodeverk/opptjeningAktivitetType';
import ActivityDataSubPanel from './ActivityDataSubPanel';

describe('<ActivityDataSubPanel>', () => {
  const activity = {
    arbeidsgiver: 'Svensen Eksos',
    oppdragsgiverOrg: '123456789',
  };

  it('skal vise arbeidsgiver, org-nr og stillingsandel for type Arbeid', () => {
    const wrapper = shallow(<ActivityDataSubPanel
      initialValues={activity}
      readOnly={false}
      isManuallyAdded={false}
      selectedActivityType={{ kode: OAType.ARBEID, navn: 'arbeid' }}
    />);

    const arbeidsgiverLabel = wrapper.find(FormattedMessage);
    expect(arbeidsgiverLabel).to.have.length(1);
    expect(arbeidsgiverLabel.prop('id')).is.eql('ActivityPanel.Arbeidsgiver');

    const arbeidsgiverText = wrapper.find(Normaltekst);
    expect(arbeidsgiverText).to.have.length(1);
    expect(arbeidsgiverText.childAt(0).text()).is.eql('Svensen Eksos (123456789)');

    const stillingsandelInput = wrapper.find(DecimalField);
    expect(stillingsandelInput).to.have.length(1);
    expect(stillingsandelInput.prop('name')).is.eql('stillingsandel');
    expect(stillingsandelInput.prop('readOnly')).is.true;

    expect(wrapper.find(DatepickerField)).to.have.length(0);
  });

  it('skal vise "-" når arbeidsgiver ikke er oppgitt', () => {
    const wrapper = shallow(<ActivityDataSubPanel
      initialValues={{}}
      readOnly={false}
      isManuallyAdded={false}
      selectedActivityType={{ kode: OAType.ARBEID, navn: 'arbeid' }}
    />);

    const arbeidsgiverLabel = wrapper.find(FormattedMessage);
    expect(arbeidsgiverLabel).to.have.length(1);
    expect(arbeidsgiverLabel.prop('id')).is.eql('ActivityPanel.Arbeidsgiver');

    const arbeidsgiverText = wrapper.find(Normaltekst);
    expect(arbeidsgiverText).to.have.length(1);
    expect(arbeidsgiverText.childAt(0).text()).is.eql('-');

    const stillingsandelInput = wrapper.find(DecimalField);
    expect(stillingsandelInput).to.have.length(1);
    expect(stillingsandelInput.prop('name')).is.eql('stillingsandel');
    expect(stillingsandelInput.prop('readOnly')).is.true;

    expect(wrapper.find(DatepickerField)).to.have.length(0);
  });

  it('skal ikke vise label Oppdragsgiver for type Frilans', () => {
    const wrapper = shallow(<ActivityDataSubPanel
      initialValues={activity}
      readOnly={false}
      isManuallyAdded={false}
      selectedActivityType={{ kode: OAType.FRILANS, navn: 'FRILANS' }}
    />);

    const arbeidsgiverLabel = wrapper.find(FormattedMessage);
    expect(arbeidsgiverLabel).to.have.length(0);

    expect(wrapper.find(InputField)).to.have.length(0);
    expect(wrapper.find(DatepickerField)).to.have.length(0);
  });

  it('skal vise ikke vise stillingsandel for type Næring', () => {
    const wrapper = shallow(<ActivityDataSubPanel
      initialValues={activity}
      readOnly={false}
      isManuallyAdded={false}
      selectedActivityType={{ kode: OAType.NARING, navn: 'NARING' }}
    />);

    const arbeidsgiverLabel = wrapper.find(FormattedMessage);
    expect(arbeidsgiverLabel).to.have.length(1);
    expect(arbeidsgiverLabel.prop('id')).is.eql('ActivityPanel.Arbeidsgiver');

    expect(wrapper.find(InputField)).to.have.length(0);
    expect(wrapper.find(DatepickerField)).to.have.length(1);
  });

  it('skal ikke vise noen felter for type Vartpenger', () => {
    const wrapper = shallow(<ActivityDataSubPanel
      initialValues={activity}
      readOnly={false}
      isManuallyAdded={false}
      selectedActivityType={{ kode: OAType.VARTPENGER, navn: 'VARTPENGER' }}
    />);

    expect(wrapper.find(FormattedMessage)).to.have.length(0);
    expect(wrapper.find(InputField)).to.have.length(0);
    expect(wrapper.find(DatepickerField)).to.have.length(0);
  });

  it('skal vise inputfelt for organisasjonsnr når saksbehandler manuelt har lagt til aktivitet Arbeid', () => {
    const wrapper = shallow(<ActivityDataSubPanel
      initialValues={activity}
      readOnly={false}
      isManuallyAdded
      selectedActivityType={{ kode: OAType.ARBEID, navn: 'ARBEID' }}
    />);

    expect(wrapper.find(FormattedMessage)).to.have.length(0);
    const inputFields = wrapper.find(InputField);
    expect(inputFields).to.have.length(1);
    expect(inputFields.prop('name')).is.eql('oppdragsgiverOrg');
    expect(inputFields.prop('readOnly')).is.false;
    const decimalField = wrapper.find(DecimalField);
    expect(decimalField).to.have.length(1);
    expect(decimalField.prop('name')).is.eql('stillingsandel');
    expect(decimalField.prop('readOnly')).is.false;
  });

  it('skal vise inputfelt som readOnly', () => {
    const wrapper = shallow(<ActivityDataSubPanel
      initialValues={activity}
      readOnly
      isManuallyAdded
      selectedActivityType={{ kode: OAType.ARBEID, navn: 'ARBEID' }}
    />);

    expect(wrapper.find(FormattedMessage)).to.have.length(0);
    const inputFields = wrapper.find(InputField);
    expect(inputFields).to.have.length(1);
    expect(inputFields.prop('readOnly')).is.true;
    const decimalField = wrapper.find(DecimalField);
    expect(decimalField).to.have.length(1);
    expect(decimalField.prop('name')).is.eql('stillingsandel');
    expect(decimalField.prop('readOnly')).is.true;
  });
});
