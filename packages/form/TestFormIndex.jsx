import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formPropTypes, reduxForm, formValueSelector } from 'redux-form';
import { Container, Row, Column } from 'nav-frontend-grid';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import BorderBox from 'sharedComponents/BorderBox';
import { required } from 'utils/validation/validators';
import {
  InputField, DatepickerField, TextAreaField, CheckboxField, SelectField, RadioGroupField, RadioOption,
} from './Fields';

const getOptions = values => values.map(value => <option value={`${value}`.toUpperCase()} key={value}>{value}</option>);

const TestFormImpl = ({ handleSubmit, readOnly }) => (
  <form onChange={() => setTimeout(handleSubmit)}>
    <InputField name="InputField" label="InputField" bredde="L" readOnly={readOnly} />
    <TextAreaField name="TextAreaField" label="TextAreaField" readOnly={readOnly} />
    <DatepickerField name="DatepickerField" label={{ id: 'BarnPanel.ChildNumberBornData', args: { childNumber: 2 } }} readOnly={readOnly} />
    <RadioGroupField
      name="RadioGroupField"
      label="RadioGroupField"
      columns={2}
      bredde="L"
      readOnly={readOnly}
      validate={[required]}
      spaceBetween
    >
      <RadioOption label="Ja" value />
      <RadioOption label="Nei" value={false} />
      <RadioOption
        label={(
          <Normaltekst>
Vet
            <b>ikke</b>
          </Normaltekst>
)}
        value={{ reason: 'I truly don\'t know' }}
      />
      <RadioOption label="Ukjent" value="UKJENT" disabled />
    </RadioGroupField>
    <CheckboxField name="CheckboxField1" label="CheckboxField1" readOnly={readOnly} />
    <CheckboxField name="CheckboxField2" label="CheckboxField2" readOnly={readOnly} />
    <SelectField
      name="SelectField"
      selectValues={getOptions(['Et valg', 'Et annet valg'])}
      label="SelectField"
      placeholder="Velg noe"
      bredde="l"
      readOnly={readOnly}
    />
    <hr />
    <CheckboxField name="readOnly" label="readOnly" />
  </form>
);

TestFormImpl.propTypes = {
  ...formPropTypes,
  readOnly: PropTypes.bool,
};

TestFormImpl.defaultProps = {
  readOnly: false,
};

const TestForm = reduxForm({ form: 'TestForm' })(connect(state => ({ readOnly: formValueSelector('TestForm')(state, 'readOnly') }))(TestFormImpl));

class TestFormIndex extends Component {
  constructor() {
    super();
    this.state = {};
    this.setSubmittedFormValues = this.setSubmittedFormValues.bind(this);
  }

  setSubmittedFormValues(submittedFormValues) {
    this.setState({ submittedFormValues });
  }

  render() {
    if (process.env.NODE_ENV !== 'development') {
      return null;
    }
    const { submittedFormValues } = this.state;
    return (
      <Container fluid>
        <Row>
          <Column xs="6">
            <BorderBox>
              <Undertittel>Test form</Undertittel>
              <TestForm onSubmit={this.setSubmittedFormValues} readOnly />
            </BorderBox>
          </Column>
          <Column xs="6">
            <BorderBox>
              <Undertittel>Submitted values</Undertittel>
              <pre>
                {JSON.stringify(submittedFormValues, null, 2)}
              </pre>
            </BorderBox>
          </Column>
        </Row>
      </Container>
    );
  }
}

export default TestFormIndex;
