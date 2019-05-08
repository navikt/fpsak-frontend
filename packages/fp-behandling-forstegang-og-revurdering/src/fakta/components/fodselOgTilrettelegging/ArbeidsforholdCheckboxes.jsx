import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Fieldset } from 'nav-frontend-skjema';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import { behandlingFormValueSelector } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import {
  DatepickerField, CheckboxField, DecimalField,
} from '@fpsak-frontend/form';
import {
  ArrowBox, FlexContainer, FlexColumn, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';

import {
  required, hasValidDate, hasValidDecimal, minValue, maxValue,
} from '@fpsak-frontend/utils';

/**
 * Svangerskapspenger
 */

const minValue0 = minValue(0);
const maxProsentValue100 = maxValue(100);

export const ArbeidsforholdCheckboxes = ({
  kanGjennomfores,
  redusertArbeid,
  kanIkkeGjennomfores,
  readOnly,
  warning,
  intl,
}) => {
  const arrowBox = (dato, stillingsprosent) => (
    <ArrowBox>
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <DatepickerField
              name={dato}
              label={{ id: 'ArbeidsforholdCheckboxes.Arbeidsgiver.Dato' }}
              validate={[required, hasValidDate]}
              readOnly={readOnly}
            />
          </FlexColumn>
          {stillingsprosent
          && (
          <FlexColumn>
            <DecimalField
              name={stillingsprosent}
              label={{ id: 'ArbeidsforholdCheckboxes.Arbeidsgiver.Stillingsprosent' }}
              validate={[required, minValue0, maxProsentValue100, hasValidDecimal]}
              readOnly={readOnly}
              bredde="XS"
              normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
            />
          </FlexColumn>
          )
        }

        </FlexRow>
      </FlexContainer>
    </ArrowBox>
  );
  const readOnlyInfo = (textId, dato, stillingsprosent) => (
    <FlexContainer>
      <FlexRow>
        <FormattedMessage id={textId} />
      </FlexRow>
      <FlexRow>
        <FlexColumn>
          <DatepickerField
            name={dato}
            label={{ id: 'ArbeidsforholdCheckboxes.Arbeidsgiver.Dato' }}
            validate={[required, hasValidDate]}
            readOnly
          />
        </FlexColumn>
        {stillingsprosent
    && (
    <FlexColumn>
      <DecimalField
        name={stillingsprosent}
        label={{ id: 'ArbeidsforholdCheckboxes.Arbeidsgiver.Stillingsprosent' }}
        validate={[required, minValue0, maxProsentValue100, hasValidDecimal]}
        readOnly
        bredde="XS"
        normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
      />
    </FlexColumn>

    )
  }
      </FlexRow>
    </FlexContainer>
  );
  return (
    <Fieldset legend={intl.formatMessage({ id: 'ArbeidsforholdCheckboxes.Arbeidsgiver.Tilrettelegging' })}>
      {warning && warning.permisjonsWarning
      && (
      <div className="skjemaelement__feilmelding">
        {warning.permisjonsWarning}
        <VerticalSpacer sixteenPx />
      </div>
      )
      }
      {!readOnly && (
        <div>
          <CheckboxField
            name="kanGjennomfores"
            label={{ id: 'ArbeidsforholdCheckboxes.Arbeidsgiver.KanGjennomfores' }}
            readOnly={readOnly}
          />
          {kanGjennomfores && arrowBox('kanGjennomforesDato')}
          <CheckboxField
            name="redusertArbeid"
            label={{ id: 'ArbeidsforholdCheckboxes.Arbeidsgiver.RedusertArbeid' }}
            readOnly={readOnly}
          />
          {redusertArbeid && arrowBox('redusertArbeidDato', 'redusertArbeidStillingsprosent')}
          <CheckboxField
            name="kanIkkeGjennomfores"
            label={{ id: 'ArbeidsforholdCheckboxes.Arbeidsgiver.KanIkkeGjennomfores' }}
            readOnly={readOnly}
          />
          {kanIkkeGjennomfores && arrowBox('kanIkkeGjennomforesDato')}
        </div>
      )}
      {readOnly && kanGjennomfores && readOnlyInfo('ArbeidsforholdCheckboxes.Arbeidsgiver.KanGjennomfores', 'kanGjennomforesDato')}
      {readOnly && redusertArbeid
         && readOnlyInfo('ArbeidsforholdCheckboxes.Arbeidsgiver.RedusertArbeid', 'redusertArbeidDato', 'redusertArbeidStillingsprosent')}
      {readOnly && kanIkkeGjennomfores && readOnlyInfo('ArbeidsforholdCheckboxes.Arbeidsgiver.KanIkkeGjennomfores', 'kanIkkeGjennomforesDato')}
    </Fieldset>
  );
};

ArbeidsforholdCheckboxes.propTypes = {
  kanGjennomfores: PropTypes.bool,
  redusertArbeid: PropTypes.bool,
  kanIkkeGjennomfores: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  warning: PropTypes.shape(),
};

ArbeidsforholdCheckboxes.defaultProps = {
  kanGjennomfores: false,
  redusertArbeid: false,
  kanIkkeGjennomfores: false,
  warning: {},
};

const mapStateToProps = state => ({
  kanGjennomfores: behandlingFormValueSelector('selectedFodselOgTilretteleggingForm')(state, 'kanGjennomfores'),
  redusertArbeid: behandlingFormValueSelector('selectedFodselOgTilretteleggingForm')(state, 'redusertArbeid'),
  kanIkkeGjennomfores: behandlingFormValueSelector('selectedFodselOgTilretteleggingForm')(state, 'kanIkkeGjennomfores'),
});

export default injectIntl(connect(mapStateToProps)(ArbeidsforholdCheckboxes));
