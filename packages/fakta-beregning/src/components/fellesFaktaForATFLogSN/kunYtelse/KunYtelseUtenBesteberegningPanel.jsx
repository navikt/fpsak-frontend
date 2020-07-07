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
  alleKodeverk,
  behandlingVersjon,
  behandlingId,
  isAksjonspunktClosed,
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
      isAksjonspunktClosed={isAksjonspunktClosed}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      alleKodeverk={alleKodeverk}
    />
  </BorderBox>
);

KunYtelseUtenBesteberegningPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  brukersAndelFieldArrayName: PropTypes.string.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

export default KunYtelseUtenBesteberegningPanel;
