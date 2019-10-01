import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Image } from '@fpsak-frontend/shared-components';
import checkImage from '@fpsak-frontend/assets/images/check.svg';

import styles from './vilkarResultPanel.less';

/**
 * VilkarResultPanel
 *
 * Presentasjonskomponent. Brukes når en skal vise valgt vilkårsstatus
 */
const VilkarResultPanel = ({
  intl,
  status,
}) => (
  <div className={styles.container}>
    <Image className={styles.icon} src={checkImage} alt={intl.formatMessage({ id: 'ShowVilkarStatus.Check' })} />
    <Normaltekst className={styles.text}>
      <FormattedMessage id={status === vilkarUtfallType.OPPFYLT ? 'VilkarResultPanel.VilkarOppfylt' : 'VilkarResultPanel.VilkarIkkeOppfylt'} />
    </Normaltekst>
  </div>
);

VilkarResultPanel.propTypes = {
  status: PropTypes.string.isRequired,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(VilkarResultPanel);
