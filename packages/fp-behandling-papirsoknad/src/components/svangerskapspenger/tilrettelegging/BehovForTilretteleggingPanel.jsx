import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { formValueSelector, FieldArray } from 'redux-form';

import { DatepickerField, RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { Fieldset } from 'nav-frontend-skjema';
import { BorderBox, ArrowBox } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';

import SelvstendigNaringsdrivendeEllerFrilansFieldArray from './SelvstendigNaringsdrivendeEllerFrilansFieldArray';

const selvstendigNaringsdrivendeFieldArrayName = 'tilretteleggingSelvstendigNaringsdrivende';
const frilansFieldArrayName = 'tilretteleggingFrilans';

/*
 * BehovForTilretteleggingPanel
 *
 * Form som brukes for registrere om det er behov for tilrettelegging.
 */
const BehovForTilretteleggingPanelImpl = ({
  readOnly,
  sokForSelvstendigNaringsdrivende,
  sokForFrilans,
  intl,
}) => (
  <BorderBox>
    <Fieldset legend={intl.formatMessage({ id: 'BehovForTilretteleggingPanel.BehovForTilrettelegging' })}>
      <DatepickerField
        name="tilretteleggingFraDato"
        label={{ id: 'BehovForTilretteleggingPanel.TilretteleggingFra' }}
        validate={[required]}
        readOnly={readOnly}
      />
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
          <FieldArray
            name={selvstendigNaringsdrivendeFieldArrayName}
            component={SelvstendigNaringsdrivendeEllerFrilansFieldArray}
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
          <FieldArray
            name={frilansFieldArrayName}
            component={SelvstendigNaringsdrivendeEllerFrilansFieldArray}
            readOnly={readOnly}
          />
        </ArrowBox>
      )}
    </Fieldset>
  </BorderBox>
);

BehovForTilretteleggingPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  sokForSelvstendigNaringsdrivende: PropTypes.bool.isRequired,
  sokForFrilans: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  sokForSelvstendigNaringsdrivende: formValueSelector(ownProps.formName)(state, 'sokForSelvstendigNaringsdrivende'),
  sokForFrilans: formValueSelector(ownProps.formName)(state, 'sokForFrilans'),
});

const BehovForTilretteleggingPanel = connect(mapStateToProps)(injectIntl(BehovForTilretteleggingPanelImpl));

BehovForTilretteleggingPanel.initialValues = {
  [selvstendigNaringsdrivendeFieldArrayName]: [{}],
  [frilansFieldArrayName]: [{}],
};

export default BehovForTilretteleggingPanel;
