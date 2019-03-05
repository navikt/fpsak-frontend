import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Fieldset } from 'nav-frontend-skjema';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import { behandlingFormValueSelector } from 'behandlingFpsak/src/behandlingForm';
import {
  DatepickerField, CheckboxField, DecimalField,
} from '@fpsak-frontend/form';
import {
  ArrowBox, FlexContainer, FlexColumn, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';

import {
  required, hasValidDate, hasValidDecimal, minValue, maxValue,
} from '@fpsak-frontend/utils';

import styles from './arbeidsforholdCheckboxes.less';

const minValue0 = minValue(0);
const maxProsentValue100 = maxValue(100);

export const ArbeidsforholdCheckboxes = ({
  kanGjennomfores,
  redusertArbeid,
  kanIkkeGjennomfores,
  readOnly,
  error,
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
              readOnly={readOnly}
            />
          </FlexColumn>
          {stillingsprosent
          && (
          <FlexColumn>
            <DecimalField
              name={stillingsprosent}
              label={{ id: 'ArbeidsforholdInnhold.Arbeidsgiver.Stillingsprosent' }}
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
  return (
    <Fieldset legend={intl.formatMessage({ id: 'ArbeidsforholdInnhold.Arbeidsgiver.Tilrettelegging' })}>
      {error && error.permisjonsError
      && (
      <div className="skjemaelement__feilmelding">
        <FormattedMessage id={error.permisjonsError} />
        <VerticalSpacer sixteenPx />
      </div>
      )
      }
      <CheckboxField
        className={error && error.permisjonsError ? styles.showErrorBackground : ''}
        name="kanGjennomfores"
        label={{ id: 'ArbeidsforholdInnhold.Arbeidsgiver.KanGjennomfores' }}
        readOnly={readOnly}
      />
      {kanGjennomfores && arrowBox('kanGjennomforesDato')}
      <CheckboxField
        className={error && error.permisjonsError ? styles.showErrorBackground : ''}
        name="redusertArbeid"
        label={{ id: 'ArbeidsforholdInnhold.Arbeidsgiver.RedusertArbeid' }}
        readOnly={readOnly}
      />
      {redusertArbeid && arrowBox('redusertArbeidDato', 'redusertArbeidStillingsprosent')}
      <CheckboxField
        className={error && error.permisjonsError ? styles.showErrorBackground : ''}
        name="kanIkkeGjennomfores"
        label={{ id: 'ArbeidsforholdInnhold.Arbeidsgiver.KanIkkeGjennomfores' }}
        readOnly={readOnly}
      />
      {kanIkkeGjennomfores && arrowBox('kanIkkeGjennomforesDato')}
    </Fieldset>
  );
};

ArbeidsforholdCheckboxes.propTypes = {
  kanGjennomfores: PropTypes.bool,
  redusertArbeid: PropTypes.bool,
  kanIkkeGjennomfores: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  error: PropTypes.shape(),
};

ArbeidsforholdCheckboxes.defaultProps = {
  kanGjennomfores: false,
  redusertArbeid: false,
  kanIkkeGjennomfores: false,
  error: {},
};

const mapStateToProps = state => ({
  kanGjennomfores: behandlingFormValueSelector('selectedFodselOgTilretteleggingForm')(state, 'kanGjennomfores'),
  redusertArbeid: behandlingFormValueSelector('selectedFodselOgTilretteleggingForm')(state, 'redusertArbeid'),
  kanIkkeGjennomfores: behandlingFormValueSelector('selectedFodselOgTilretteleggingForm')(state, 'kanIkkeGjennomfores'),
});

export default injectIntl(connect(mapStateToProps)(ArbeidsforholdCheckboxes));
