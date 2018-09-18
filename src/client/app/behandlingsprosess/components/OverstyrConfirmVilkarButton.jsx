import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Column } from 'nav-frontend-grid';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';

import { isSelectedBehandlingspunktOverrideReadOnly } from 'behandlingsprosess/behandlingsprosessSelectors';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

const OverstyrConfirmVilkarButtonImpl = ({
  submitting,
  pristine,
  isReadOnly,
}) => {
  if (isReadOnly) {
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
          <FormattedMessage id="OverstyrConfirmationForm.ConfirmInformation" />
        </Hovedknapp>
      </Column>
    </Row>
  );
};

OverstyrConfirmVilkarButtonImpl.propTypes = {
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isReadOnly: isSelectedBehandlingspunktOverrideReadOnly(state),
});

const OverstyrConfirmVilkarButton = connect(mapStateToProps)(OverstyrConfirmVilkarButtonImpl);

export default OverstyrConfirmVilkarButton;
