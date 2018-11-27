import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Undertekst, Element } from 'nav-frontend-typografi';
import { injectIntl, intlShape } from 'react-intl';

import Image from 'sharedComponents/Image';
import vilkarUtfallType from 'kodeverk/vilkarUtfallType';
import { getBehandlingHenlagt } from 'behandling/behandlingSelectors';
import findBehandlingsprosessIcon from 'behandlingsprosess/statusIconHelper';
import { getBehandlingspunkterStatus, getBehandlingspunkterTitleCodes, getAksjonspunkterOpenStatus } from 'behandlingsprosess/behandlingsprosessSelectors';

import styles from './behandlingspunktIcon.less';

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
}) => {
  const isIkkeVurdert = status === vilkarUtfallType.IKKE_VURDERT && !hasOpenAksjonspunkt;
  const title = intl.formatMessage({ id: titleCode });

  return (
    <span className={styles.wrapperVilkar} key={title}>
      <div className={styles.posi}>
        <Image
          className={isIkkeVurdert ? styles.behandlingspunktGray : styles.behandlingspunkt}
          alt={title}
          tabIndex={isIkkeVurdert ? '-1' : '0'}
          imageSrcFunction={findBehandlingsprosessIcon(behandlingspunkt, status, isSelectedBehandlingspunkt, isSelectedBehandlingHenlagt, hasOpenAksjonspunkt)}
          onKeyDown={getCallback(isIkkeVurdert, behandlingspunkt, selectBehandlingspunktCallback)}
          onMouseDown={getCallback(isIkkeVurdert, behandlingspunkt, selectBehandlingspunktCallback)}
          tooltip={{ header: <Element>{title}</Element> }}
        />
        <span className={styles.lowerText}><Undertekst className={styles.vilkarText}>{title}</Undertekst></span>
      </div>
    </span>
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
};

const mapStateToProps = (state, initialProps) => ({
  isSelectedBehandlingHenlagt: getBehandlingHenlagt(state),
  status: getBehandlingspunkterStatus(state)[initialProps.behandlingspunkt],
  titleCode: getBehandlingspunkterTitleCodes(state)[initialProps.behandlingspunkt],
  hasOpenAksjonspunkt: getAksjonspunkterOpenStatus(state)[initialProps.behandlingspunkt],
});

export default injectIntl(connect(mapStateToProps)(BehandlingspunktIcon));
