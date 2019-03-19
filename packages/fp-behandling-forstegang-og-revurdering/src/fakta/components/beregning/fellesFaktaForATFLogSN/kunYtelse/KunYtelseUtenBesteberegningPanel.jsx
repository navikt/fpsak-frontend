import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import { FieldArray } from 'redux-form';
import { BorderBox } from '@fpsak-frontend/shared-components';
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
    />
  </BorderBox>
);

KunYtelseUtenBesteberegningPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  brukersAndelFieldArrayName: PropTypes.string.isRequired,
};

export default KunYtelseUtenBesteberegningPanel;
