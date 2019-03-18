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
import styles from './arbeidsforholdInnhold.less';

/**
 * Svangerskapspenger
 * Vise info pr arbforhold fra søknad og kunne endre feltene.
 */

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

export const ArbeidsforholdInnhold = ({
  cancelArbeidsforholdCallback,
  updateArbeidsforholdCallback,
  readOnly,
  warning,
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
            readOnly={readOnly}
          />
        </FlexColumn>
      </FlexRow>
      <ArbeidsforholdCheckboxes readOnly={readOnly} warning={warning} />
      <FlexRow>
        <FlexColumn className={styles.textAreaBredde}>
          <TextAreaField
            name="begrunnelse"
            label={{ id: 'ArbeidsforholdInnhold.BegrunnEndringene' }}
            readOnly={readOnly}
            validate={[
              minLength3,
              maxLength1500,
              hasValidText,
              required,
            ]}
            maxLength={1500}
          />
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
    {!readOnly
    && (
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
    )
  }
  </div>
);

ArbeidsforholdInnhold.propTypes = {
  cancelArbeidsforholdCallback: PropTypes.func.isRequired,
  updateArbeidsforholdCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  warning: PropTypes.shape(),
};

ArbeidsforholdInnhold.defaultProps = {
  warning: {},
};

const validateWarning = (values) => {
  let warnings = {};

  if (!values.kanGjennomfores && !values.kanIkkeGjennomfores && !values.redusertArbeid) {
    warnings = {
      _warning: {
        permisjonsWarning: <FormattedMessage id="ArbeidsforholdInnhold.TilretteleggingWarning" />,
      },
    };
  }
  return warnings;
};

const transformValues = (values, selectedArbeidsforhold) => {
  const { ...transformvalue } = selectedArbeidsforhold;
  transformvalue.jordmor.tilretteleggingFra = values.jordmorTilretteleggingFra;
  transformvalue.kanGjennomfores.kanGjennomfores = values.kanGjennomfores;
  transformvalue.kanGjennomfores.dato = values.kanGjennomforesDato;
  transformvalue.kanIkkeGjennomfores.kanIkkeGjennomfores = values.kanIkkeGjennomfores;
  transformvalue.kanIkkeGjennomfores.dato = values.kanIkkeGjennomforesDato;
  transformvalue.redusertArbeid.redusertArbeid = values.redusertArbeid;
  transformvalue.redusertArbeid.dato = values.redusertArbeidDato;
  transformvalue.redusertArbeid.stillingsprosent = values.redusertArbeidStillingsprosent;
  transformvalue.begrunnelse = values.begrunnelse;
  return transformvalue;
};

export const buildInitialValues = values => ({
  jordmorTilretteleggingFra: values.jordmor.tilretteleggingFra,
  begrunnelse: values.begrunnelse,
  kanGjennomfores: values.kanGjennomfores.kanGjennomfores,
  kanGjennomforesDato: values.kanGjennomfores.dato,
  kanIkkeGjennomfores: values.kanIkkeGjennomfores.kanIkkeGjennomfores,
  kanIkkeGjennomforesDato: values.kanIkkeGjennomfores.dato,
  redusertArbeid: values.redusertArbeid.redusertArbeid,
  redusertArbeidDato: values.redusertArbeid.dato,
  redusertArbeidStillingsprosent: values.redusertArbeid.stillingsprosent,
});

const mapStateToProps = (state, ownProps) => {
  const { selectedArbeidsforhold } = ownProps;
  // TODO: Tilpasse responsen fra backend
  return {
    initialValues: buildInitialValues(selectedArbeidsforhold),
    warn: values => validateWarning(values),
    onSubmit: values => ownProps.updateArbeidsforholdCallback(transformValues(values, selectedArbeidsforhold)),
  };
};

export default connect(mapStateToProps)(behandlingForm({
  form: 'selectedFodselOgTilretteleggingForm',
  enableReinitialize: true,
})(ArbeidsforholdInnhold));
