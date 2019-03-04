import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Fieldset } from 'nav-frontend-skjema';
import { injectIntl, intlShape } from 'react-intl';


import { behandlingFormValueSelector } from 'behandlingFpsak/src/behandlingForm';
import {
  DatepickerField, CheckboxField, DecimalField,
} from '@fpsak-frontend/form';
import {
  ArrowBox, FlexContainer, FlexColumn, FlexRow,
} from '@fpsak-frontend/shared-components';

import {
  required, hasValidDate, hasValidDecimal, minValue, maxValue,
} from '@fpsak-frontend/utils';

const minValue0 = minValue(0);
const maxProsentValue100 = maxValue(100);

export const ArbeidsforholdCheckboxes = ({
  kanGjennomfores,
  redusertArbeid,
  kanIkkeGjennomfores,
  intl,
}) => {
  const arrowBox = (dato, stillingsprosent) => (
    <ArrowBox>
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <DatepickerField
              name={dato}
              label={{ id: 'ArbeidsforholdInnhold.Arbeidsgiver.Dato' }}
              validate={[required, hasValidDate]}
              readOnly={false}
            />
          </FlexColumn>
          {stillingsprosent
          && (
          <FlexColumn>
            <DecimalField
              name={stillingsprosent}
              label={{ id: 'ArbeidsforholdInnhold.Arbeidsgiver.Stillingsprosent' }}
              validate={[required, minValue0, maxProsentValue100, hasValidDecimal]}
              readOnly={false}
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
  return (
    <Fieldset legend={intl.formatMessage({ id: 'ArbeidsforholdInnhold.Arbeidsgiver.Tilrettelegging' })}>
      <CheckboxField name="kanGjennomfores" label={{ id: 'ArbeidsforholdInnhold.Arbeidsgiver.KanGjennomfores' }} readOnly={false} />
      {kanGjennomfores && arrowBox('kanGjennomforesDato')}
      <CheckboxField name="redusertArbeid" label={{ id: 'ArbeidsforholdInnhold.Arbeidsgiver.RedusertArbeid' }} readOnly={false} />
      {redusertArbeid && arrowBox('redusertArbeidDato', 'redusertArbeidStillingsprosent')}
      <CheckboxField name="kanIkkeGjennomfores" label={{ id: 'ArbeidsforholdInnhold.Arbeidsgiver.KanIkkeGjennomfores' }} readOnly={false} />
      {kanIkkeGjennomfores && arrowBox('kanIkkeGjennomforesDato')}
    </Fieldset>
  );
};

ArbeidsforholdCheckboxes.propTypes = {
  kanGjennomfores: PropTypes.bool,
  redusertArbeid: PropTypes.bool,
  kanIkkeGjennomfores: PropTypes.bool,
  intl: intlShape.isRequired,
};

ArbeidsforholdCheckboxes.defaultProps = {
  kanGjennomfores: false,
  redusertArbeid: false,
  kanIkkeGjennomfores: false,
};

const mapStateToProps = state => ({
  kanGjennomfores: behandlingFormValueSelector('selectedFodselOgTilretteleggingForm')(state, 'kanGjennomfores'),
  redusertArbeid: behandlingFormValueSelector('selectedFodselOgTilretteleggingForm')(state, 'redusertArbeid'),
  kanIkkeGjennomfores: behandlingFormValueSelector('selectedFodselOgTilretteleggingForm')(state, 'kanIkkeGjennomfores'),
});

export default injectIntl(connect(mapStateToProps)(ArbeidsforholdCheckboxes));
