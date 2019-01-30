import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import { FieldArray } from 'redux-form';
import { behandlingFormValueSelector } from 'behandlingFpsak/behandlingForm';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import { Column, Row } from 'nav-frontend-grid';
import { LINK_TIL_BESTE_BEREGNING_REGNEARK } from 'data/eksterneLenker';
import BrukersAndelFieldArray from './BrukersAndelFieldArray';
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
  formName,
  isAksjonspunktClosed,
  erBesteberegning,
  brukersAndelFieldArrayName,
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
      <div className={erBesteberegning ? styles.arrowLineBesteberegning : styles.arrowLineIngenBesteberegning}>
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
          )
          }
        </Row>
        <Row>
          <Column xs="12">
            <FieldArray
              name={brukersAndelFieldArrayName}
              component={BrukersAndelFieldArray}
              readOnly={readOnly}
              formName={formName}
            />
          </Column>
        </Row>
      </div>
    )
  }
  </div>
);

KunYtelseBesteberegningImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  formName: PropTypes.string.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  brukersAndelFieldArrayName: PropTypes.string.isRequired,
  erBesteberegning: PropTypes.bool,
};

KunYtelseBesteberegningImpl.defaultProps = {
  erBesteberegning: undefined,
};

KunYtelseBesteberegningImpl.buildInitialValues = kunYtelse => ({ [besteberegningField]: kunYtelse.erBesteberegning });

KunYtelseBesteberegningImpl.validate = (values) => {
  const errors = {};
  errors[besteberegningField] = required(values[besteberegningField]);
  return errors;
};

KunYtelseBesteberegningImpl.transformValues = values => (values[besteberegningField]);

const mapStateToProps = (state, initialProps) => ({
  erBesteberegning: behandlingFormValueSelector(initialProps.formName)(state, besteberegningField),
});

export default connect(mapStateToProps)(KunYtelseBesteberegningImpl);
