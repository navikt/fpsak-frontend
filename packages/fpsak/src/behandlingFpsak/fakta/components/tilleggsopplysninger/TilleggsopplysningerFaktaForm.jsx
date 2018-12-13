import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import { behandlingFormValueSelector } from 'behandlingFpsak/behandlingForm';
import { ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { decodeHtmlEntity } from '@fpsak-frontend/utils';

import styles from './tilleggsopplysningerFaktaForm.less';

/**
 * TilleggsopplysningerFaktaForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av tilleggsopplysninger i søknad.
 */
const TilleggsopplysningerFaktaFormImpl = ({
  readOnly,
  submitting,
  tilleggsopplysninger,
}) => (
  <ElementWrapper>
    <Normaltekst className={styles.explanationReadOnly}>{decodeHtmlEntity(tilleggsopplysninger)}</Normaltekst>
    {!readOnly
    && (
    <ElementWrapper>
      <VerticalSpacer twentyPx />
      <Hovedknapp mini spinner={submitting} disabled={submitting}>
        <FormattedMessage id="TilleggsopplysningerFaktaForm.Confirmed" />
      </Hovedknapp>
    </ElementWrapper>
    )
    }
  </ElementWrapper>
);

TilleggsopplysningerFaktaFormImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  tilleggsopplysninger: PropTypes.string,
};

TilleggsopplysningerFaktaFormImpl.defaultProps = {
  tilleggsopplysninger: '',
};

const mapStateToProps = state => ({
  tilleggsopplysninger: behandlingFormValueSelector('TilleggsopplysningerInfoPanel')(state, 'tilleggsopplysninger'),
});

const TilleggsopplysningerFaktaForm = connect(mapStateToProps)(TilleggsopplysningerFaktaFormImpl);

TilleggsopplysningerFaktaForm.buildInitialValues = soknad => ({
  tilleggsopplysninger: soknad.tilleggsopplysninger,
  aksjonspunktCode: aksjonspunktCodes.TILLEGGSOPPLYSNINGER,
});

TilleggsopplysningerFaktaForm.transformValues = values => ({
  tilleggsopplysninger: values.tilleggsopplysninger,
  kode: aksjonspunktCodes.TILLEGGSOPPLYSNINGER,
});

export default TilleggsopplysningerFaktaForm;