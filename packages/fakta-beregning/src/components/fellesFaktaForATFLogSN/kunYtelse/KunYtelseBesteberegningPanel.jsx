import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';
import { Element } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import { LINK_TIL_BESTE_BEREGNING_REGNEARK } from '@fpsak-frontend/fp-felles';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import { ArrowBox } from '@fpsak-frontend/shared-components';
// TODO (SAFIR) PFP-6021 Ta i bruk InntektFieldArray i staden for BrukersAndelFieldArray
import BrukersAndelFieldArray from './BrukersAndelFieldArray';
import { getFormValuesForBeregning } from '../../BeregningFormUtils';

import styles from './kunYtelseBesteberegningPanel.less';

export const besteberegningField = 'besteberegningField';

/**
 * KunYtelseBesteberegningPanel
 *
 * Presentasjonskomponent. Behandling av aksjonspunktet for fastsetting av bg for kun ytelse
 *  med vurdering av besteberegning.
 */
const KunYtelseBesteberegningImpl = ({
  readOnly,
  isAksjonspunktClosed,
  erBesteberegning,
  brukersAndelFieldArrayName,
  skalViseInntektstabell,
}) => (
  <div>
    <RadioGroupField
      name={besteberegningField}
      readOnly={readOnly}
      isEdited={isAksjonspunktClosed}
      label={<FormattedMessage id="KunYtelsePanel.HarBesteberegning" />}
    >
      <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Ja" />} value />
      <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Nei" />} value={false} />
    </RadioGroupField>
    {erBesteberegning !== undefined && erBesteberegning !== null
    && (
      <ArrowBox alignOffset={erBesteberegning ? 0 : 60}>
        <Row>
          <Column xs="9">
            <Element>
              <FormattedMessage id="KunYtelsePanel.OverskriftBesteberegning" />
            </Element>
          </Column>
          {erBesteberegning
          && (
            <Column xs="3">
              <a
                className={styles.navetLink}
                href={LINK_TIL_BESTE_BEREGNING_REGNEARK}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FormattedMessage id="BeregningInfoPanel.FastsettBBFodendeKvinne.RegnarkNavet" />
              </a>
            </Column>
          )}
        </Row>
        {skalViseInntektstabell
        && (
        <Row>
          <Column xs="12">
            <FieldArray
              name={brukersAndelFieldArrayName}
              component={BrukersAndelFieldArray}
              readOnly={readOnly}
            />
          </Column>
        </Row>
        )}
      </ArrowBox>
    )}
  </div>
);

KunYtelseBesteberegningImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  brukersAndelFieldArrayName: PropTypes.string.isRequired,
  erBesteberegning: PropTypes.bool,
  skalViseInntektstabell: PropTypes.bool,
};

KunYtelseBesteberegningImpl.defaultProps = {
  erBesteberegning: undefined,
  skalViseInntektstabell: true,
};

KunYtelseBesteberegningImpl.buildInitialValues = (kunYtelse) => ({ [besteberegningField]: kunYtelse.erBesteberegning });

KunYtelseBesteberegningImpl.validate = (values) => {
  const errors = {};
  errors[besteberegningField] = required(values[besteberegningField]);
  return errors;
};

KunYtelseBesteberegningImpl.transformValues = (values) => (values[besteberegningField]);

const mapStateToProps = (state, ownProps) => ({
  erBesteberegning: getFormValuesForBeregning(state, ownProps)[besteberegningField],
});

export default connect(mapStateToProps)(KunYtelseBesteberegningImpl);
