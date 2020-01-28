import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';

const OverstyrBekreftKnappPanel = ({
  submitting,
  pristine,
  overrideReadOnly,
}) => {
  if (overrideReadOnly) {
    return null;
  }
  return (
    <Hovedknapp
      mini
      spinner={submitting}
      disabled={submitting || pristine}
    >
      <FormattedMessage id="OverstyrBekreftKnappPanel.ConfirmInformation" />
    </Hovedknapp>
  );
};

OverstyrBekreftKnappPanel.propTypes = {
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  overrideReadOnly: PropTypes.bool.isRequired,
};

export default OverstyrBekreftKnappPanel;
