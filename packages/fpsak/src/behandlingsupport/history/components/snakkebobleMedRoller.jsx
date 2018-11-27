import React from 'react';
import { PropTypes as PT } from 'prop-types';
import { Panel } from 'nav-frontend-paneler';
import { Undertekst } from 'nav-frontend-typografi';
import classNames from 'classnames/bind';

import navBrukerKjonn from 'kodeverk/navBrukerKjonn';

import styles from './snakkebobleMedRoller.less';

const cx = classNames.bind(styles);

const snakkebobleCls = rolle => cx('snakkeboble', {
  'snakkeboble--hoyre': rolle !== 'SOKER' && rolle !== 'ARBEIDSGIVER',
  'snakkeboble--venstre': rolle === 'SOKER' || rolle === 'ARBEIDSGIVER',
});

const formatDate = date => (`${date.substring(8, 10)}.${date.substring(5, 7)}.${date.substring(0, 4)} - ${date.substring(11, 16)}`);

const snakkeboblePilCls = rolle => cx('snakkeboble__snakkebole-pil', {
  'snakkeboble__snakkebole-pil--hoyre--saksbehandler': rolle === 'SBH',
  'snakkeboble__snakkebole-pil--hoyre--beslutter': rolle === 'BESL',
  'snakkeboble__snakkebole-pil--hoyre--losningen': rolle === 'VL',
  'snakkeboble__snakkebole-pil--venstre--bruker': rolle === 'SOKER',
  'snakkeboble__snakkebole-pil--venstre--ekstern': rolle === 'ARBEIDSGIVER',
});

const snakkebobleIkonCls = (rolle, kjoennKode) => cx('snakkeboble__ikon', {
  'snakkeboble__ikon--saksbehandler': rolle === 'SBH',
  'snakkeboble__ikon--brukerMann': rolle === 'SOKER' && kjoennKode === navBrukerKjonn.MANN,
  'snakkeboble__ikon--brukerKvinne': rolle === 'SOKER' && kjoennKode === navBrukerKjonn.KVINNE,
  'snakkeboble__ikon--beslutter': rolle === 'BESL',
  'snakkeboble__ikon--losningen': rolle === 'VL',
  'snakkeboble__ikon--ekstern': rolle === 'ARBEIDSGIVER',
});

const snakkeboblePanelCls = rolle => cx('snakkeboble__panel snakkeboble-panel', {
  'snakkeboble__snakkebole-panel--saksbehandler': rolle === 'SBH',
  'snakkeboble__snakkebole-panel--beslutter': rolle === 'BESL',
  'snakkeboble__snakkebole-panel--losningen': rolle === 'VL',
  'snakkeboble__snakkebole-panel--bruker': rolle === 'SOKER',
  'snakkeboble__snakkebole-panel--ekstern': rolle === 'ARBEIDSGIVER',
});
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
    <i className={snakkebobleIkonCls(rolle, kjoennKode)} title={rolleNavn} />
    <div className={styles['snakkeboble__snakkeboble-pil-container']}>
      <i className={snakkeboblePilCls(rolle)} />
    </div>
    <Panel className={snakkeboblePanelCls(rolle)}>
      <Undertekst className={styles['snakkeboble-panel__dato']}>
        {formatDate(dato)}
        {' '}
        {'//'}
        {' '}
        {rolleNavn}
        {' '}
        {opprettetAv}
        {' '}
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
