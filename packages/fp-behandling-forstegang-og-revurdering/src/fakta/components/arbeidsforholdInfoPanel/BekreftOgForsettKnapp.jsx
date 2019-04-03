import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ElementWrapper from '@fpsak-frontend/shared-components/src/ElementWrapper';
import VerticalSpacer from '@fpsak-frontend/shared-components/src/VerticalSpacer';
import { Hovedknapp } from 'nav-frontend-knapper';
import { connect } from 'react-redux';
import PersonArbeidsforholdPanel from './personArbeidsforholdPanel/PersonArbeidsforholdPanel';

/**
 * BekreftOgForsettKnapp:
 * Ansvarlig for å rendre bekreft og fortsett knappen, samt disable den hvis nødvendig
 */
export const BekreftOgForsettKnappImpl = ({
  readOnly,
  isBekreftButtonReadOnly,
  isSubmitting,
}) => (
  <ElementWrapper>
    <VerticalSpacer twentyPx />
    <Hovedknapp
      mini
      spinner={isSubmitting}
      disabled={readOnly || isBekreftButtonReadOnly || isSubmitting}
    >
      <FormattedMessage id="FullPersonInfo.Confirm" />
    </Hovedknapp>
  </ElementWrapper>
);

BekreftOgForsettKnappImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isBekreftButtonReadOnly: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isBekreftButtonReadOnly: PersonArbeidsforholdPanel.isReadOnly(state),
});

const BekreftOgForsettKnapp = connect(mapStateToProps)(BekreftOgForsettKnappImpl);
export default BekreftOgForsettKnapp;
