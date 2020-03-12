import React from 'react';
import PropTypes from 'prop-types';
import {
  createIntl, createIntlCache, RawIntlProvider, FormattedMessage,
} from 'react-intl';
import {
  EtikettAdvarsel, EtikettFokus, EtikettInfo, EtikettSuksess,
} from 'nav-frontend-etiketter';

import diskresjonskodeType from '@fpsak-frontend/kodeverk/src/diskresjonskodeType';

import styles from './merkepanel.less';
import messages from '../../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);


/**
 * MerkePanel
 *
 * Presentasjonskomponent. Definerer visning av personens merkinger. (Søker)
 *
 * Eksempel:
 * ```html
 *  <MerkePanel erDod={false} diskresjonskode="SPSF" erVerge erNAVANsatt />
 * ```
 */
const MerkePanel = ({
  erDod,
  erDodFodt,
  erNAVAnsatt,
  erVerge,
  diskresjonskode,
}) => {
  const { formatMessage } = intl;

  return (
    <RawIntlProvider value={intl}>
      <div className={styles.merkePanel}>
        {erDod && (
        <EtikettInfo className={styles.dodMerke} title={formatMessage({ id: 'MerkePanel.DodTittel' })}>
          <FormattedMessage id="MerkePanel.Dod" />
        </EtikettInfo>
        )}
        {erDodFodt && (
        <EtikettInfo className={styles.dodMerke} title={formatMessage({ id: 'MerkePanel.DodTittel' })}>
          <FormattedMessage id="MerkePanel.DodFodt" />
        </EtikettInfo>
        )}
        {diskresjonskode === diskresjonskodeType.KODE6 && !erDod && (
        <EtikettAdvarsel className={styles.merkeDiskresjonskoder} title={formatMessage({ id: 'MerkePanel.Diskresjon6Tittel' })}>
          <FormattedMessage id="MerkePanel.Diskresjon6" />
        </EtikettAdvarsel>
        )}
        {diskresjonskode === diskresjonskodeType.KODE7 && !erDod && (
        <EtikettFokus className={styles.merkeDiskresjonskoder} title={formatMessage({ id: 'MerkePanel.Diskresjon7Tittel' })}>
          <FormattedMessage id="MerkePanel.Diskresjon7" />
        </EtikettFokus>
        )}
        {erNAVAnsatt && !erDod && (
        <EtikettSuksess className={styles.navMerke} title={formatMessage({ id: 'MerkePanel.EgenAnsattTittel' })}>
          <FormattedMessage id="MerkePanel.EgenAnsatt" />
        </EtikettSuksess>
        )}
        {erVerge && !erDod && (
        <EtikettFokus className={styles.vergeMerke} title={formatMessage({ id: 'MerkePanel.VergeTittel' })}>
          <span className={styles.vergeIcon} />
          <FormattedMessage id="MerkePanel.Verge" />
        </EtikettFokus>
        )}
      </div>
    </RawIntlProvider>
  );
};

MerkePanel.propTypes = {
  erDod: PropTypes.bool,
  erDodFodt: PropTypes.bool,
  erNAVAnsatt: PropTypes.bool,
  erVerge: PropTypes.bool,
  diskresjonskode: PropTypes.string,
};

MerkePanel.defaultProps = {
  diskresjonskode: '',
  erNAVAnsatt: false,
  erDod: false,
  erDodFodt: false,
  erVerge: false,
};

export default MerkePanel;
