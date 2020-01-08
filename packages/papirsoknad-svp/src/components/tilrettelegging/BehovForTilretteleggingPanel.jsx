import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { formValueSelector, FieldArray } from 'redux-form';
import { Fieldset } from 'nav-frontend-skjema';

import { RadioGroupField, RadioOption, DatepickerField } from '@fpsak-frontend/form';
import { BorderBox, ArrowBox } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';

import BehovForTilrettteleggingFieldArray from './BehovForTilrettteleggingFieldArray';
import TilretteleggingForArbeidsgiverFieldArray from './TilretteleggingForArbeidsgiverFieldArray';

const selvstendigNaringsdrivendeFieldArrayName = 'tilretteleggingSelvstendigNaringsdrivende';
const frilansFieldArrayName = 'tilretteleggingFrilans';
const tilretteleggingForArbeidsgiverFieldArrayName = 'tilretteleggingForArbeidsgiver';

/*
 * BehovForTilretteleggingPanel
 *
 * Form som brukes for registrere om det er behov for tilrettelegging.
 */
export const BehovForTilretteleggingPanelImpl = ({
  readOnly,
  sokForSelvstendigNaringsdrivende,
  sokForFrilans,
  sokForArbeidsgiver,
  intl,
}) => (
  <BorderBox>
    <Fieldset legend={intl.formatMessage({ id: 'BehovForTilretteleggingPanel.BehovForTilrettelegging' })}>
      <RadioGroupField
        name="sokForSelvstendigNaringsdrivende"
        label={intl.formatMessage({ id: 'BehovForTilretteleggingPanel.SokForSelvstendigNaringsdrivende' })}
        validate={[required]}
        readOnly={readOnly}
      >
        <RadioOption value label={{ id: 'BehovForTilretteleggingPanel.Ja' }} />
        <RadioOption value={false} label={{ id: 'BehovForTilretteleggingPanel.Nei' }} />
      </RadioGroupField>
      {sokForSelvstendigNaringsdrivende && (
        <ArrowBox>
          <DatepickerField
            name="behovsdatoSN"
            label={{ id: 'BehovForTilretteleggingPanel.TilretteleggingFra' }}
            validate={[required]}
            readOnly={readOnly}
          />
          <FieldArray
            name={selvstendigNaringsdrivendeFieldArrayName}
            component={BehovForTilrettteleggingFieldArray}
            readOnly={readOnly}
          />
        </ArrowBox>
      )}
      <RadioGroupField
        name="sokForFrilans"
        label={intl.formatMessage({ id: 'BehovForTilretteleggingPanel.SokForFrilans' })}
        validate={[required]}
        readOnly={readOnly}
      >
        <RadioOption value label={{ id: 'BehovForTilretteleggingPanel.Ja' }} />
        <RadioOption value={false} label={{ id: 'BehovForTilretteleggingPanel.Nei' }} />
      </RadioGroupField>
      {sokForFrilans && (
        <ArrowBox>
          <DatepickerField
            name="behovsdatoFrilans"
            label={{ id: 'BehovForTilretteleggingPanel.TilretteleggingFra' }}
            validate={[required]}
            readOnly={readOnly}
          />
          <FieldArray
            name={frilansFieldArrayName}
            component={BehovForTilrettteleggingFieldArray}
            readOnly={readOnly}
          />
        </ArrowBox>
      )}
      <RadioGroupField
        name="sokForArbeidsgiver"
        label={intl.formatMessage({ id: 'BehovForTilretteleggingPanel.SokForArbeidsgiver' })}
        validate={[required]}
        readOnly={readOnly}
      >
        <RadioOption value label={{ id: 'BehovForTilretteleggingPanel.Ja' }} />
        <RadioOption value={false} label={{ id: 'BehovForTilretteleggingPanel.Nei' }} />
      </RadioGroupField>
      {sokForArbeidsgiver && (
        <ArrowBox>
          <FieldArray
            name={tilretteleggingForArbeidsgiverFieldArrayName}
            component={TilretteleggingForArbeidsgiverFieldArray}
            readOnly={readOnly}
          />
        </ArrowBox>
      )}
    </Fieldset>
  </BorderBox>
);

BehovForTilretteleggingPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  sokForSelvstendigNaringsdrivende: PropTypes.bool,
  sokForFrilans: PropTypes.bool,
  sokForArbeidsgiver: PropTypes.bool,
  intl: PropTypes.shape().isRequired,
};

BehovForTilretteleggingPanelImpl.defaultProps = {
  sokForSelvstendigNaringsdrivende: undefined,
  sokForFrilans: undefined,
  sokForArbeidsgiver: undefined,
};

const mapStateToProps = (state, ownProps) => ({
  ...formValueSelector(ownProps.formName)(state, ownProps.namePrefix),
});

const BehovForTilretteleggingPanel = connect(mapStateToProps)(injectIntl(BehovForTilretteleggingPanelImpl));

BehovForTilretteleggingPanel.initialValues = {
  [tilretteleggingForArbeidsgiverFieldArrayName]: [{}],
};

export default BehovForTilretteleggingPanel;
