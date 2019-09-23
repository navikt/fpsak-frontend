import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';

const OverstyrBekreftKnappPanel = ({
  submitting,
  pristine,
  overrideReadOnly,
}) => {
  if (overrideReadOnly) {
    return null;
  }
  return (
    <Row>
      <Column xs="12">
        <VerticalSpacer twentyPx />
        <Hovedknapp
          mini
          spinner={submitting}
          disabled={submitting || pristine}
        >
          <FormattedMessage id="OverstyrBekreftKnappPanel.ConfirmInformation" />
        </Hovedknapp>
      </Column>
    </Row>
  );
};

OverstyrBekreftKnappPanel.propTypes = {
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  overrideReadOnly: PropTypes.bool.isRequired,
};

export default OverstyrBekreftKnappPanel;
