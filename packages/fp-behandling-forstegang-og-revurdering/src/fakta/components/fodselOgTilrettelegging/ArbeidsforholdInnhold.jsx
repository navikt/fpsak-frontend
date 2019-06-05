import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import {
  DatepickerField,
} from '@fpsak-frontend/form';
import {
  FlexContainer, FlexColumn, FlexRow,
} from '@fpsak-frontend/shared-components';
import {
  required, hasValidDate,
} from '@fpsak-frontend/utils';

import { behandlingForm } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import ArbeidsforholdCheckboxes from './ArbeidsforholdCheckboxes';

/**
 * Svangerskapspenger
 * Vise info pr arbforhold fra søknad og kunne endre feltene.
 */

export const ArbeidsforholdInnhold = ({
  cancelArbeidsforholdCallback,
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
            disabled={Object.keys(warning).length}
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
  const {
 redusertArbeidDato, kanGjennomforesDato, kanIkkeGjennomforesDato, redusertArbeid, kanGjennomfores, kanIkkeGjennomfores,
} = values;
  let warnings = {};

  if ((redusertArbeid && kanGjennomfores && redusertArbeidDato && redusertArbeidDato === kanGjennomforesDato)
  || (kanIkkeGjennomfores && kanGjennomfores && kanIkkeGjennomforesDato && kanIkkeGjennomforesDato === kanGjennomforesDato)
  || (kanIkkeGjennomfores && redusertArbeid && redusertArbeidDato && kanIkkeGjennomforesDato === redusertArbeidDato)) {
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

// TODO (TOR) Denne brukar ikkje state så her bør ein ta vekk connect
const mapStateToPropsFactory = (initialState, ownProps) => {
  const { selectedArbeidsforhold } = ownProps;
  const onSubmit = values => ownProps.updateArbeidsforholdCallback(transformValues(values, selectedArbeidsforhold));
  return () => ({
    initialValues: buildInitialValues(selectedArbeidsforhold),
    warn: values => validateWarning(values),
    onSubmit,
  });
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: 'selectedFodselOgTilretteleggingForm',
  enableReinitialize: true,
})(ArbeidsforholdInnhold));
