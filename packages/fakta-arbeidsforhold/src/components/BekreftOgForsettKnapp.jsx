import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Hovedknapp } from 'nav-frontend-knapper';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import PersonArbeidsforholdPanel from './PersonArbeidsforholdPanel';

/**
 * BekreftOgForsettKnapp:
 * Ansvarlig for å rendre bekreft og fortsett knappen, samt disable den hvis nødvendig
 */
export const BekreftOgForsettKnapp = ({
  readOnly,
  isBekreftButtonReadOnly,
  isSubmitting,
}) => (
  <>
    <VerticalSpacer twentyPx />
    <Hovedknapp
      mini
      spinner={isSubmitting}
      disabled={readOnly || isBekreftButtonReadOnly || isSubmitting}
    >
      <FormattedMessage id="FullPersonInfo.Confirm" />
    </Hovedknapp>
  </>
);

BekreftOgForsettKnapp.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isBekreftButtonReadOnly: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  isBekreftButtonReadOnly: PersonArbeidsforholdPanel.isReadOnly(state, ownProps.behandlingId, ownProps.behandlingVersjon),
});

export default connect(mapStateToProps)(BekreftOgForsettKnapp);
