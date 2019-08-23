import React from 'react';
import { FormattedMessage } from 'react-intl';

import ikkeOppfyltUrl from '@fpsak-frontend/assets/images/ikke_oppfylt.svg';
import oppfyltUrl from '@fpsak-frontend/assets/images/oppfylt.svg';
import uavklartUrl from '@fpsak-frontend/assets/images/uavklart.svg';
import { VerticalSpacer, Image } from '@fpsak-frontend/shared-components';

import styles from './foreldelseTidslinjeHjelpetekster.less';

const oppfyltImage = () => (oppfyltUrl);
const ikkeOppfyltImage = () => (ikkeOppfyltUrl);
const uavklartImage = () => (uavklartUrl);

const ForeldelseTidslinjeHjelpetekster = () => (
  <>
    <Image
      className={styles.timeLineButton}
      imageSrcFunction={oppfyltImage}
      altCode="Timeline.OppfyltPeriode"
    />
    <FormattedMessage id="Timeline.OppfyltPeriode" />
    <VerticalSpacer eightPx />
    <Image
      className={styles.timeLineButton}
      imageSrcFunction={ikkeOppfyltImage}
      altCode="Timeline.IkkeOppfyltPeriode"
    />
    <FormattedMessage id="Timeline.IkkeOppfyltPeriode" />
    <VerticalSpacer eightPx />
    <Image
      className={styles.timeLineButton}
      imageSrcFunction={uavklartImage}
      altCode="Timeline.IkkeAvklartPeriode"
    />
    <FormattedMessage id="Timeline.IkkeAvklartPeriode" />
  </>
);

export default ForeldelseTidslinjeHjelpetekster;
