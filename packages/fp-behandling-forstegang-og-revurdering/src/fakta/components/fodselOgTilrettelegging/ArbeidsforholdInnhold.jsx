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

import { behandlingForm } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
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
  readOnly,
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
      <ArbeidsforholdCheckboxes readOnly={readOnly} />
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
};

const transformValues = (values, selectedArbeidsforhold) => {
  const { ...transformvalue } = selectedArbeidsforhold;
  transformvalue.tilretteleggingBehovFom = values.jordmorTilretteleggingFra;
  transformvalue.helTilretteleggingFom = values.kanGjennomfores ? values.kanGjennomforesDato : null;
  transformvalue.slutteArbeidFom = values.kanIkkeGjennomfores ? values.kanIkkeGjennomforesDato : null;
  transformvalue.delvisTilretteleggingFom = values.redusertArbeid ? values.redusertArbeidDato : null;
  transformvalue.stillingsprosent = values.redusertArbeid ? values.redusertArbeidStillingsprosent : null;
  transformvalue.begrunnelse = values.begrunnelse;
  return transformvalue;
};

export const buildInitialValues = values => ({
  jordmorTilretteleggingFra: values.tilretteleggingBehovFom,
  begrunnelse: values.begrunnelse,
  kanGjennomfores: !!values.helTilretteleggingFom,
  kanGjennomforesDato: values.helTilretteleggingFom,
  kanIkkeGjennomfores: !!values.slutteArbeidFom,
  kanIkkeGjennomforesDato: values.slutteArbeidFom,
  redusertArbeid: !!values.delvisTilretteleggingFom,
  redusertArbeidDato: values.delvisTilretteleggingFom,
  redusertArbeidStillingsprosent: values.stillingsprosent,
});

const mapStateToProps = (state, ownProps) => {
  const { selectedArbeidsforhold } = ownProps;
  return {
    initialValues: buildInitialValues(selectedArbeidsforhold),
    onSubmit: values => ownProps.updateArbeidsforholdCallback(transformValues(values, selectedArbeidsforhold)),
  };
};

export default connect(mapStateToProps)(behandlingForm({
  form: 'selectedFodselOgTilretteleggingForm',
  enableReinitialize: true,
})(ArbeidsforholdInnhold));
