import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import {
  DatepickerField, TextAreaField,
} from '@fpsak-frontend/form';
import {
  FlexContainer, FlexColumn, FlexRow,
} from '@fpsak-frontend/shared-components';
import {
  required, hasValidDate, maxLength, minLength, hasValidText,
} from '@fpsak-frontend/utils';
import { behandlingForm } from 'behandlingFpsak/src/behandlingForm';

import ArbeidsforholdCheckboxes from './ArbeidsforholdCheckboxes';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

export const ArbeidsforholdInnhold = ({
  cancelArbeidsforholdCallback,
  updateArbeidsforholdCallback,
  ...formProps
}) => (
  <div>
    <FlexContainer>
      <FlexRow>
        <FlexColumn>
          <DatepickerField
            name="jordmorTilretteleggingFra"
            label={{ id: 'ArbeidsforholdInnhold.Jordmor.TilretteleggingFra' }}
            validate={[required, hasValidDate]}
            readOnly={false}
          />
        </FlexColumn>
      </FlexRow>
      <ArbeidsforholdCheckboxes />
      <FlexRow>
        <FlexColumn>
          <TextAreaField
            name="begrunnelse"
            label={{ id: 'ArbeidsforholdInnhold.BegrunnEndringene' }}
            readOnly={false}
            validate={[
              minLength3,
              maxLength1500,
              hasValidText,
            ]}
            maxLength={1500}
          />
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
    <FlexContainer fluid>
      <FlexRow>
        <FlexColumn>
          <Hovedknapp
            htmlType="button"
            mini
            onClick={formProps.handleSubmit}
          >
            <FormattedMessage id="ArbeidsforholdFaktaPanel.Oppdater" />
          </Hovedknapp>
        </FlexColumn>
        <FlexColumn>
          <Knapp
            htmlType="button"
            mini
            onClick={cancelArbeidsforholdCallback}
          >
            <FormattedMessage id="ArbeidsforholdFaktaPanel.Avbryt" />
          </Knapp>
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  </div>
);

ArbeidsforholdInnhold.propTypes = {
  cancelArbeidsforholdCallback: PropTypes.func.isRequired,
  updateArbeidsforholdCallback: PropTypes.func.isRequired,
};
const transformValues = (values, selectedArbeidsforhold) => {
  const { ...transformvalue } = selectedArbeidsforhold;
  transformvalue.kanGjennomfores.kanGjennomfores = values.kanGjennomfores;
  transformvalue.kanGjennomfores.dato = values.kanGjennomforesDato;
  transformvalue.kanIkkeGjennomfores.kanIkkeGjennomfores = values.kanIkkeGjennomfores;
  transformvalue.kanIkkeGjennomfores.dato = values.kanIkkeGjennomforesDato;
  transformvalue.redusertArbeid.redusertArbeid = values.redusertArbeid;
  transformvalue.redusertArbeid.dato = values.redusertArbeidDato;
  transformvalue.redusertArbeid.stillingsprosent = values.redusertArbeidStillingsprosent;
  return transformvalue;
};
const mapStateToProps = (state, ownProps) => {
  const { selectedArbeidsforhold } = ownProps;
  // TODO: Tilpasse responsen fra backend
  return {
    initialValues: {
      jordmorTilretteleggingFra: selectedArbeidsforhold.jordmor.tilretteleggingFra,
      begrunnelse: selectedArbeidsforhold.begrunnelse,
      kanGjennomfores: selectedArbeidsforhold.kanGjennomfores.kanGjennomfores,
      kanGjennomforesDato: selectedArbeidsforhold.kanGjennomfores.dato,
      kanIkkeGjennomfores: selectedArbeidsforhold.kanIkkeGjennomfores.kanIkkeGjennomfores,
      kanIkkeGjennomforesDato: selectedArbeidsforhold.kanIkkeGjennomfores.dato,
      redusertArbeid: selectedArbeidsforhold.redusertArbeid.redusertArbeid,
      redusertArbeidDato: selectedArbeidsforhold.redusertArbeid.dato,
      redusertArbeidStillingsprosent: selectedArbeidsforhold.redusertArbeid.stillingsprosent,
    },
    onSubmit: values => ownProps.updateArbeidsforholdCallback(transformValues(values, selectedArbeidsforhold)),
  };
};

export default connect(mapStateToProps)(behandlingForm({
  form: 'selectedFodselOgTilretteleggingForm',
  enableReinitialize: true,
})(ArbeidsforholdInnhold));
