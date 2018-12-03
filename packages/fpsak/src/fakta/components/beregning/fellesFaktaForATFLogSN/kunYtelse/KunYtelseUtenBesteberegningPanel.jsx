import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import { FieldArray } from 'redux-form';
import BorderBox from 'sharedComponents/BorderBox';
import { Column, Row } from 'nav-frontend-grid';
import BrukersAndelFieldArray from './BrukersAndelFieldArray';


/**
 * KunYtelseUtenBesteberegningPanel
 *
 * Presentasjonskomponent. Behandling av aksjonspunktet for fastsetting av bg for
 *  kun ytelse uten vurdering av besteberegning.
 */

const KunYtelseUtenBesteberegningPanel = ({
  readOnly,
  formName,
  brukersAndelFieldArrayName,
}) => (
  <BorderBox>
    <Row>
      <Column xs="9">
        <Element>
          <FormattedMessage id="KunYtelsePanel.Overskrift" />
        </Element>
      </Column>
    </Row>
    <FieldArray
      name={brukersAndelFieldArrayName}
      component={BrukersAndelFieldArray}
      readOnly={readOnly}
      formName={formName}
    />
  </BorderBox>
);

KunYtelseUtenBesteberegningPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  formName: PropTypes.string.isRequired,
  brukersAndelFieldArrayName: PropTypes.string.isRequired,
};

export default KunYtelseUtenBesteberegningPanel;
