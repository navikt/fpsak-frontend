import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { decodeHtmlEntity } from '@fpsak-frontend/utils';

import styles from './tilleggsopplysningerFaktaForm.less';

/**
 * TilleggsopplysningerFaktaForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av tilleggsopplysninger i søknad.
 */
const TilleggsopplysningerFaktaForm = ({
  readOnly,
  submitting,
  tilleggsopplysninger,
}) => (
  <>
    <Normaltekst className={styles.explanationReadOnly}>{decodeHtmlEntity(tilleggsopplysninger)}</Normaltekst>
    {!readOnly && (
      <>
        <VerticalSpacer twentyPx />
        <Hovedknapp mini spinner={submitting} disabled={submitting}>
          <FormattedMessage id="TilleggsopplysningerFaktaForm.Confirmed" />
        </Hovedknapp>
      </>
    )}
  </>
);

TilleggsopplysningerFaktaForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  tilleggsopplysninger: PropTypes.string.isRequired,
};

export default TilleggsopplysningerFaktaForm;
