import React from 'react';
import { FormattedMessage } from 'react-intl';

import ikkeOppfyltUrl from '@fpsak-frontend/assets/images/ikke_oppfylt.svg';
import oppfyltUrl from '@fpsak-frontend/assets/images/oppfylt.svg';
import uavklartUrl from '@fpsak-frontend/assets/images/uavklart.svg';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';

import styles from './tilbakekrevingTidslinjeHjelpetekster.less';

const oppfyltImage = () => (oppfyltUrl);
const ikkeOppfyltImage = () => (ikkeOppfyltUrl);
const uavklartImage = () => (uavklartUrl);

const TilbakekrevingTidslinjeHjelpetekster = () => (
  <>
    <Image
      className={styles.timeLineButton}
      imageSrcFunction={oppfyltImage}
      altCode="Timeline.OppfyltPeriode"
    />
    <FormattedMessage id="Timeline.BelopTilbakereves" />
    <VerticalSpacer eightPx />
    <Image
      className={styles.timeLineButton}
      imageSrcFunction={ikkeOppfyltImage}
      altCode="Timeline.IkkeOppfyltPeriode"
    />
    <FormattedMessage id="Timeline.IngenTilbakekreving" />
    <VerticalSpacer eightPx />
    <Image
      className={styles.timeLineButton}
      imageSrcFunction={uavklartImage}
      altCode="Timeline.IkkeAvklartPeriode"
    />
    <FormattedMessage id="Timeline.IkkeAvklartPeriode" />
  </>
);

export default TilbakekrevingTidslinjeHjelpetekster;
