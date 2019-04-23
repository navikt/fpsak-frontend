
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import diskresjonskodeType from 'kodeverk/diskresjonskodeType';

import { EtikettAdvarsel, EtikettInfo, EtikettFokus } from 'nav-frontend-etiketter';
import styles from './merkepanel.less';

interface TsProps {
  intl: any;
  erDod?: boolean;
  diskresjonskode?: string;
}

/**
 * MerkePanel
 *
 * Presentasjonskomponent. Definerer visning av personens merkinger. (Søker)
 *
 * Eksempel:
 * ```html
 *  <MerkePanel erDod={false} diskresjonskode="SPSF"  />
 * ```
 */
export const MerkePanel = ({
  intl,
  erDod,
  diskresjonskode,
}: TsProps) => {
  const { formatMessage } = intl;

  return (
    <div className={styles.merkePanel}>

      {erDod
      && (
      <EtikettInfo className={styles.dodMerke} title={formatMessage({ id: 'MerkePanel.DodTittel' })}>
        <FormattedMessage id="MerkePanel.Dod" />
      </EtikettInfo>
      )
      }

      {diskresjonskode === diskresjonskodeType.KODE6 && !erDod
      && (
      <EtikettAdvarsel className={styles.merkeDiskresjonskoder} title={formatMessage({ id: 'MerkePanel.Diskresjon6Tittel' })}>
        <FormattedMessage id="MerkePanel.Diskresjon6" />
      </EtikettAdvarsel>
      )
      }

      {diskresjonskode === diskresjonskodeType.KODE7 && !erDod
      && (
      <EtikettFokus className={styles.merkeDiskresjonskoder} title={formatMessage({ id: 'MerkePanel.Diskresjon7Tittel' })}>
        <FormattedMessage id="MerkePanel.Diskresjon7" />
      </EtikettFokus>
      )
      }
    </div>
  );
};

MerkePanel.propTypes = {
  erDod: PropTypes.bool,
  diskresjonskode: PropTypes.string,
  intl: intlShape.isRequired,
};

MerkePanel.defaultProps = {
  diskresjonskode: '',
  erDod: false,
};

export default injectIntl(MerkePanel);
