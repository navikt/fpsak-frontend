import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Fieldset } from 'nav-frontend-skjema';
import AlertStripe from 'nav-frontend-alertstriper';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import { required } from '@fpsak-frontend/utils';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import {
 VerticalSpacer, ArrowBox, FlexContainer, FlexColumn, FlexRow,
} from '@fpsak-frontend/shared-components';

import { behandlingForm } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import TilretteleggingsvalgPanel from './TilretteleggingsvalgPanel';

export const TILRETTELEGGING_DETAIL_FORM_NAME = 'TilretteleggingDetailForm';

/**
 * TilretteleggingDetailForm
 *
 * Svangerskapspenger
 */
export const TilretteleggingDetailForm = ({
  intl,
  readOnly,
  warning,
  cancelTilrettelegging,
  ...formProps
}) => (
  <Fieldset legend={intl.formatMessage({ id: 'ArbeidsforholdCheckboxes.Arbeidsgiver.Tilrettelegging' })}>
    {warning && warning.permisjonsWarning && (
      <AlertStripe type="feil">
        <FormattedMessage id="ArbeidsforholdInnhold.TilretteleggingWarning" />
      </AlertStripe>
    )}
    <VerticalSpacer eightPx />
    <RadioGroupField name="type" validate={[required]} readOnly={readOnly} direction="vertical">
      <RadioOption label={{ id: 'ArbeidsforholdCheckboxes.Arbeidsgiver.KanGjennomfores' }} value="kanGjennomfores">
        <ArrowBox>
          <TilretteleggingsvalgPanel readOnly={readOnly} />
        </ArrowBox>
      </RadioOption>
      <RadioOption label={{ id: 'ArbeidsforholdCheckboxes.Arbeidsgiver.RedusertArbeid' }} value="redusertArbeid">
        <ArrowBox>
          <TilretteleggingsvalgPanel harStillingsprosent readOnly={readOnly} />
        </ArrowBox>
      </RadioOption>
      <RadioOption label={{ id: 'ArbeidsforholdCheckboxes.Arbeidsgiver.KanIkkeGjennomfores' }} value="kanIkkeGjennomfores">
        <ArrowBox>
          <TilretteleggingsvalgPanel readOnly={readOnly} />
        </ArrowBox>
      </RadioOption>
    </RadioGroupField>
    {!readOnly && (
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <Hovedknapp
              htmlType="button"
              mini
              onClick={formProps.handleSubmit}
            >
              <FormattedMessage id="TilretteleggingDetailForm.Oppdater" />
            </Hovedknapp>
          </FlexColumn>
          <FlexColumn>
            <Knapp
              htmlType="button"
              mini
              onClick={cancelTilrettelegging}
            >
              <FormattedMessage id="TilretteleggingDetailForm.Avbryt" />
            </Knapp>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
      )}
  </Fieldset>
);

TilretteleggingDetailForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  cancelTilrettelegging: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  warning: PropTypes.shape(),
};

TilretteleggingDetailForm.defaultProps = {
  warning: {},
};

// TODO (TOR) Denne brukar ikkje state så her bør ein ta vekk connect
const mapStateToPropsFactory = (initialState, ownProps) => {
  const { valgtTilrettelegging } = ownProps;
  const onSubmit = values => ownProps.updateTilrettelegging(values);
  return () => ({
    onSubmit,
    initialValues: {
      ...valgtTilrettelegging,
    },
  });
};

export default connect(mapStateToPropsFactory)(injectIntl(behandlingForm({
  form: TILRETTELEGGING_DETAIL_FORM_NAME,
  enableReinitialize: true,
})(TilretteleggingDetailForm)));
