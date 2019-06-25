import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import { DatepickerField } from '@fpsak-frontend/form';
import {
 FlexContainer, FlexColumn, FlexRow,
} from '@fpsak-frontend/shared-components';
import { required, hasValidDate } from '@fpsak-frontend/utils';

import { behandlingForm } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import TilretteleggingFaktaPanel from './tilrettelegging/TilretteleggingFaktaPanel';

export const ARBEIDSFORHOLD_DETAIL_FORM_NAME = 'selectedFodselOgTilretteleggingForm';

/**
 * ArbeidsforholdDetailForm
 *
 * Svangerskapspenger
 * Vise info pr arbforhold fra søknad og kunne endre feltene.
 */
export const ArbeidsforholdDetailForm = ({
  cancelArbeidsforholdCallback,
  readOnly,
  warning,
  ...formProps
}) => {
  const [valgtTilrettelegging, settValgtTilrettelegging] = useState();
  return (
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
      <FlexRow>
        <FlexColumn>
          <TilretteleggingFaktaPanel
            settValgtTilrettelegging={settValgtTilrettelegging}
            parentFormName={ARBEIDSFORHOLD_DETAIL_FORM_NAME}
            readOnly={readOnly}
          />
        </FlexColumn>
      </FlexRow>
      {!readOnly && !valgtTilrettelegging && (
        <FlexRow>
          <FlexColumn>
            <Hovedknapp
              htmlType="button"
              mini
              onClick={formProps.handleSubmit}
              disabled={Object.keys(warning).length > 0}
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
      )}
    </FlexContainer>
  );
};

ArbeidsforholdDetailForm.propTypes = {
  cancelArbeidsforholdCallback: PropTypes.func.isRequired,
  updateArbeidsforholdCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  warning: PropTypes.shape(),
};

ArbeidsforholdDetailForm.defaultProps = {
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
  transformvalue.tilrettelegginger = values.tilrettelegginger;
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
  tilrettelegginger: values.tilrettelegginger,
});

// TODO (TOR) Denne brukar ikkje state så her bør ein ta vekk connect
const mapStateToPropsFactory = (initialState, ownProps) => {
  const { selectedArbeidsforhold } = ownProps;
  const onSubmit = values => ownProps.updateArbeidsforholdCallback(transformValues(values, selectedArbeidsforhold));
  const warn = values => validateWarning(values);
  return () => ({
    initialValues: buildInitialValues(selectedArbeidsforhold),
    warn,
    onSubmit,
  });
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: ARBEIDSFORHOLD_DETAIL_FORM_NAME,
  enableReinitialize: true,
})(ArbeidsforholdDetailForm));
