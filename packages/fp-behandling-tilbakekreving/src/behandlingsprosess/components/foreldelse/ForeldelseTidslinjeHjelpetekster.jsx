import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import ikkeOppfyltUrl from '@fpsak-frontend/assets/images/ikke_oppfylt.svg';
import oppfyltUrl from '@fpsak-frontend/assets/images/oppfylt.svg';
import uavklartUrl from '@fpsak-frontend/assets/images/uavklart.svg';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';

import PropTypes from 'prop-types';
import styles from './foreldelseTidslinjeHjelpetekster.less';

const ForeldelseTidslinjeHjelpetekster = ({ intl }) => (
  <>
    <Image
      className={styles.timeLineButton}
      src={oppfyltUrl}
      alt={intl.formatMessage({ id: 'Timeline.OppfyltPeriode' })}
    />
    <FormattedMessage id="Timeline.OppfyltPeriode" />
    <VerticalSpacer eightPx />
    <Image
      className={styles.timeLineButton}
      src={ikkeOppfyltUrl}
      alt={intl.formatMessage({ id: 'Timeline.IkkeOppfyltPeriode' })}
    />
    <FormattedMessage id="Timeline.IkkeOppfyltPeriode" />
    <VerticalSpacer eightPx />
    <Image
      className={styles.timeLineButton}
      src={uavklartUrl}
      alt={intl.formatMessage({ id: 'Timeline.IkkeAvklartPeriode' })}
    />
    <FormattedMessage id="Timeline.IkkeAvklartPeriode" />
  </>
);
ForeldelseTidslinjeHjelpetekster.propTypes = {
  intl: PropTypes.shape().isRequired,
};
export default injectIntl(ForeldelseTidslinjeHjelpetekster);
