import React from 'react';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import DatepickerField from 'form/fields/DatepickerField';
import ArrowBox from 'sharedComponents/ArrowBox';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import { RadioGroupField, RadioOption } from 'form/Fields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { required, hasValidDate } from 'utils/validation/validators';
import PropTypes from 'prop-types';

/**
 * VirksomhetNyIArbeidslivetPanel
 *
 * Presentasjonskomponent.
 */
const VirksomhetNyIArbeidslivetPanel = ({
  erNyIArbeidslivet,
  readOnly,
}) => (
  <ElementWrapper>
    <Undertekst><FormattedMessage id="Registrering.VirksomhetNyIArbeidslivetPanel.ErNyIArbeidslivet" /></Undertekst>
    <VerticalSpacer space={1} />
    <RadioGroupField name="erNyIArbeidslivet" readOnly={readOnly}>
      <RadioOption label={<FormattedMessage id="Registrering.VirksomhetNyIArbeidslivetPanel.Yes" />} value />
      <RadioOption label={<FormattedMessage id="Registrering.VirksomhetNyIArbeidslivetPanel.No" />} value={false} />
    </RadioGroupField>
    {erNyIArbeidslivet
    && (
    <ElementWrapper>
      <Row>
        <Column xs="5">
          <ArrowBox>
            <DatepickerField
              name="oppstartsdato"
              readOnly={readOnly}
              validate={[required, hasValidDate]}
              label={<FormattedMessage id="Registrering.VirksomhetNyIArbeidslivetPanel.OppgiOppstartsdato" />}
            />
          </ArrowBox>
        </Column>
      </Row>
      <VerticalSpacer space={3} />
    </ElementWrapper>
    )
    }
  </ElementWrapper>

);

VirksomhetNyIArbeidslivetPanel.propTypes = {
  erNyIArbeidslivet: PropTypes.bool,
  readOnly: PropTypes.bool,
};


VirksomhetNyIArbeidslivetPanel.defaultProps = {
  readOnly: true,
  erNyIArbeidslivet: false,
};

const mapStateToProps = (state, ownProps) => ({
  erNyIArbeidslivet: formValueSelector(ownProps.form)(state, 'erNyIArbeidslivet'),
});

export default connect(mapStateToProps)(VirksomhetNyIArbeidslivetPanel);
