import React from 'react';
import { PropTypes as PT } from 'prop-types';
import classNames from 'classnames/bind';
import Panel from 'nav-frontend-paneler';
import { Undertekst } from 'nav-frontend-typografi';

import navAnsattHistorikkImg from '@fpsak-frontend/assets/images/nav_ansatt_historikk.svg';
import kvinneImg from '@fpsak-frontend/assets/images/kvinne.svg';
import maskinImg from '@fpsak-frontend/assets/images/maskin.svg';
import arbeidsgiverImg from '@fpsak-frontend/assets/images/arbeidsgiver.svg';
import mannImg from '@fpsak-frontend/assets/images/mann.svg';
import beslutterImg from '@fpsak-frontend/assets/images/beslutter.svg';
import { Image } from '@fpsak-frontend/shared-components';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';

import styles from './snakkeboble.less';

const cx = classNames.bind(styles);

const snakkebobleCls = (rolle) => cx('snakkeboble', {
  'snakkeboble--hoyre': rolle !== 'SOKER' && rolle !== 'ARBEIDSGIVER',
  'snakkeboble--venstre': rolle === 'SOKER' || rolle === 'ARBEIDSGIVER',
});

const formatDate = (date) => (`${date.substring(8, 10)}.${date.substring(5, 7)}.${date.substring(0, 4)} - ${date.substring(11, 16)}`);

const snakkeboblePilCls = (rolle) => cx('snakkeboble__snakkebole-pil', {
  'snakkeboble__snakkebole-pil--hoyre--saksbehandler': rolle === 'SBH',
  'snakkeboble__snakkebole-pil--hoyre--beslutter': rolle === 'BESL',
  'snakkeboble__snakkebole-pil--hoyre--losningen': rolle === 'VL',
  'snakkeboble__snakkebole-pil--venstre--bruker': rolle === 'SOKER',
  'snakkeboble__snakkebole-pil--venstre--ekstern': rolle === 'ARBEIDSGIVER',
});

const snakkeboblePanelCls = (rolle) => cx('snakkeboble__panel snakkeboble-panel', {
  'snakkeboble__snakkebole-panel--saksbehandler': rolle === 'SBH',
  'snakkeboble__snakkebole-panel--beslutter': rolle === 'BESL',
  'snakkeboble__snakkebole-panel--losningen': rolle === 'VL',
  'snakkeboble__snakkebole-panel--bruker': rolle === 'SOKER',
  'snakkeboble__snakkebole-panel--ekstern': rolle === 'ARBEIDSGIVER',
});

const utledIkon = (rolle, kjoennKode) => {
  if (rolle === 'SBH') {
    return navAnsattHistorikkImg;
  } if (rolle === 'SOKER' && kjoennKode === navBrukerKjonn.MANN) {
    return mannImg;
  } if (rolle === 'SOKER' && kjoennKode === navBrukerKjonn.KVINNE) {
    return kvinneImg;
  } if (rolle === 'BESL') {
    return beslutterImg;
  } if (rolle === 'VL') {
    return maskinImg;
  }
  return arbeidsgiverImg;
};

const utledTooltipPlassering = (rolle) => rolle === 'SBH' || rolle === 'VL' || rolle === 'BESL';

/**
 * Snakkeboble
 *
 * En snakkeboble for dialog - detta är en variant av felles-komponenten men den avviker litt för mye från våra behov.
 */
const Snakkeboble = ({
  dato,
  rolle,
  rolleNavn,
  kjoennKode,
  opprettetAv,
  children,
}) => (
  <div className={snakkebobleCls(rolle)}>
    <Image className={styles.image} src={utledIkon(rolle, kjoennKode)} tooltip={rolleNavn} alignTooltipLeft={utledTooltipPlassering(rolle)} />
    <div className={styles['snakkeboble__snakkeboble-pil-container']}>
      <i className={snakkeboblePilCls(rolle)} />
    </div>
    <Panel className={snakkeboblePanelCls(rolle)}>
      <Undertekst className={styles['snakkeboble-panel__dato']}>
        {`${formatDate(dato)} // ${rolleNavn} ${opprettetAv || ''}`}
      </Undertekst>
      {children}
    </Panel>
  </div>

);

Snakkeboble.propTypes = {
  /**
  * Dato som historikken opprettedes
  */
  dato: PT.string.isRequired,
  /**
  * Hovedteksten i historikboblen
  */
  // tekst: PT.shape().isRequired,
  /**
  * Vilken rolle har den som lagat inslaget?
  */
  rolle: PT.string.isRequired,
  rolleNavn: PT.string,
  /**
  * Mann/Kvinne
  */
  kjoennKode: PT.string,
  /**
  * Vem opprettet historiken
  */
  opprettetAv: PT.string,
  /**
   * Historikkmalen for denne typen av innslag
   */
  children: PT.PropTypes.element.isRequired,
};

Snakkeboble.defaultProps = {
  rolleNavn: '',
  kjoennKode: '',
  opprettetAv: '',
};

export default Snakkeboble;
