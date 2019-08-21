import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import moment from 'moment';
import { Fieldset } from 'nav-frontend-skjema';
import AlertStripe from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';

import { required } from '@fpsak-frontend/utils';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import {
 VerticalSpacer, ArrowBox, FlexContainer, FlexColumn, FlexRow,
} from '@fpsak-frontend/shared-components';
import tilretteleggingType from '@fpsak-frontend/kodeverk/src/tilretteleggingType';

import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
import { behandlingFormForstegangOgRevurdering } from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import TilretteleggingsvalgPanel from './TilretteleggingsvalgPanel';

export const TILRETTELEGGING_DETAIL_FORM_NAME = 'TilretteleggingDetailForm';

/**
 * TilretteleggingDetailForm
 *
 * Svangerskapspenger
 */
export const TilretteleggingDetailFormImpl = ({
  intl,
  readOnly,
  warning,
  cancelTilrettelegging,
  submittable,
  harIngenTilretteleggingDatoer,
  ...formProps
}) => (
  <Fieldset legend={intl.formatMessage({ id: 'ArbeidsforholdCheckboxes.Arbeidsgiver.Tilrettelegging' })}>
    {warning && warning.permisjonsWarning && (
      <AlertStripe type="feil">
        <FormattedMessage id="ArbeidsforholdInnhold.TilretteleggingWarning" />
      </AlertStripe>
    )}
    <VerticalSpacer eightPx />
    <RadioGroupField name="type.kode" validate={[required]} readOnly={readOnly} direction="vertical">
      <RadioOption label={{ id: 'ArbeidsforholdCheckboxes.Arbeidsgiver.KanGjennomfores' }} value={tilretteleggingType.HEL_TILRETTELEGGING}>
        <ArrowBox>
          <TilretteleggingsvalgPanel readOnly={readOnly} />
        </ArrowBox>
      </RadioOption>
      <RadioOption label={{ id: 'ArbeidsforholdCheckboxes.Arbeidsgiver.RedusertArbeid' }} value={tilretteleggingType.DELVIS_TILRETTELEGGING}>
        <ArrowBox>
          <TilretteleggingsvalgPanel harStillingsprosent readOnly={readOnly} />
        </ArrowBox>
      </RadioOption>
      <RadioOption label={{ id: 'ArbeidsforholdCheckboxes.Arbeidsgiver.KanIkkeGjennomfores' }} value={tilretteleggingType.INGEN_TILRETTELEGGING}>
        <ArrowBox>
          <TilretteleggingsvalgPanel readOnly={readOnly} />
        </ArrowBox>
      </RadioOption>
    </RadioGroupField>
    {!readOnly && (
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <FaktaSubmitButton
              formName={TILRETTELEGGING_DETAIL_FORM_NAME}
              isSubmittable={submittable}
              isReadOnly={readOnly}
              hasOpenAksjonspunkter={false}
              onClick={formProps.handleSubmit}
              buttonTextId={formProps.initialValues === undefined || formProps.initialValues.fom === undefined || harIngenTilretteleggingDatoer
                ? 'TilretteleggingDetailForm.LeggTil' : 'TilretteleggingDetailForm.Endre'}
            />
          </FlexColumn>
          {!harIngenTilretteleggingDatoer && (
            <FlexColumn>
              <Knapp
                htmlType="button"
                mini
                onClick={cancelTilrettelegging}
              >
                <FormattedMessage id="TilretteleggingDetailForm.Avbryt" />
              </Knapp>
            </FlexColumn>
          )}
        </FlexRow>
      </FlexContainer>
      )}
  </Fieldset>
);

TilretteleggingDetailFormImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  cancelTilrettelegging: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  warning: PropTypes.shape(),
  submittable: PropTypes.bool.isRequired,
  harIngenTilretteleggingDatoer: PropTypes.bool.isRequired,
};

TilretteleggingDetailFormImpl.defaultProps = {
  warning: {},
};

const TilretteleggingDetailForm = injectIntl(behandlingFormForstegangOgRevurdering({
  form: TILRETTELEGGING_DETAIL_FORM_NAME,
  enableReinitialize: true,
})(TilretteleggingDetailFormImpl));

TilretteleggingDetailForm.validate = (values, tilretteleggingDatoer, jordmorTilretteleggingFraDato) => {
  const errors = {};
  if (tilretteleggingDatoer.filter(td => td.id !== values.id).some(td => td.fom === values.fom)) {
    errors.fom = [{ id: 'TilretteleggingDetailForm.DatoFinnes' }];
  }
  if (moment(values.fom).isBefore(jordmorTilretteleggingFraDato)) {
    errors.fom = [{ id: 'TilretteleggingDetailForm.TidligereEnnOppgittAvJordmor' }];
  }

  return errors;
};

export default TilretteleggingDetailForm;
