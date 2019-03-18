import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Undertekst } from 'nav-frontend-typografi';
import { injectIntl, intlShape } from 'react-intl';
import classnames from 'classnames/bind';
import { Image } from '@fpsak-frontend/shared-components';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

import styles from './behandlingspunktIcon.less';

const classNames = classnames.bind(styles);

const getCallback = (
  isIkkeVurdert, behandlingspunkt, selectBehandlingspunktCallback,
) => () => (isIkkeVurdert ? undefined : selectBehandlingspunktCallback(behandlingspunkt));

/*
 * BehandlingspunktIcon
 *
 * Presentasjonskomponent.
 */
export const BehandlingspunktIcon = ({
  intl,
  behandlingspunkt,
  isSelectedBehandlingspunkt,
  isSelectedBehandlingHenlagt,
  titleCode,
  status,
  hasOpenAksjonspunkt,
  selectBehandlingspunktCallback,
  findBehandlingsprosessIcon,
}) => {
  const isIkkeVurdert = status === vilkarUtfallType.IKKE_VURDERT && !hasOpenAksjonspunkt;
  const title = intl.formatMessage({ id: titleCode });

  return (
    <div className={classNames('behandlingspunkt', { active: isSelectedBehandlingspunkt })} key={title}>
      <Image
        className={isIkkeVurdert ? styles.behandlingspunktIkonDisabled : styles.behandlingspunktIkon}
        alt={title}
        tabIndex={isIkkeVurdert ? '-1' : '0'}
        imageSrcFunction={findBehandlingsprosessIcon(behandlingspunkt, status, isSelectedBehandlingspunkt, isSelectedBehandlingHenlagt, hasOpenAksjonspunkt)}
        onKeyDown={getCallback(isIkkeVurdert, behandlingspunkt, selectBehandlingspunktCallback)}
        onMouseDown={getCallback(isIkkeVurdert, behandlingspunkt, selectBehandlingspunktCallback)}
      />
      <Undertekst className={styles.label}>{title}</Undertekst>
    </div>
  );
};

BehandlingspunktIcon.propTypes = {
  intl: intlShape.isRequired,
  behandlingspunkt: PropTypes.string.isRequired,
  isSelectedBehandlingspunkt: PropTypes.bool.isRequired,
  isSelectedBehandlingHenlagt: PropTypes.bool.isRequired,
  titleCode: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  hasOpenAksjonspunkt: PropTypes.bool.isRequired,
  selectBehandlingspunktCallback: PropTypes.func.isRequired,
  findBehandlingsprosessIcon: PropTypes.func.isRequired,
};

const mapStateToProps = (state, initialProps) => ({
  status: initialProps.getBehandlingspunkterStatus(state)[initialProps.behandlingspunkt],
  titleCode: initialProps.getBehandlingspunkterTitleCodes(state)[initialProps.behandlingspunkt],
  hasOpenAksjonspunkt: initialProps.getAksjonspunkterOpenStatus(state)[initialProps.behandlingspunkt],
});

export default injectIntl(connect(mapStateToProps)(BehandlingspunktIcon));
