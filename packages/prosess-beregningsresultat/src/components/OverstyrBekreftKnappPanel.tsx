import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';

interface OwnProps {
  overrideReadOnly: boolean;
  submitting: boolean;
  pristine: boolean;
}

const OverstyrBekreftKnappPanel: FunctionComponent<OwnProps> = ({
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

export default OverstyrBekreftKnappPanel;
