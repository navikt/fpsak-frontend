import React, { useMemo, FunctionComponent } from 'react';
import moment from 'moment';
import { injectIntl, FormattedMessage, WrappedComponentProps } from 'react-intl';
import {
  EtikettInfo, EtikettAdvarsel, EtikettFokus,
} from 'nav-frontend-etiketter';

import diskresjonskodeType from '@fpsak-frontend/kodeverk/src/diskresjonskodeType';
import { Personopplysninger } from '@fpsak-frontend/types';
import { dateFormat } from '@fpsak-frontend/utils';
import { Tooltip } from '@fpsak-frontend/shared-components';

import styles from './visittkortLabels.less';

interface OwnProps {
  personopplysninger: Personopplysninger;
  harTilbakekrevingVerge: boolean;
}

const VisittkortLabels: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  personopplysninger,
  harTilbakekrevingVerge,
}) => {
  const erSokerUnder18 = useMemo(() => personopplysninger && moment().diff(personopplysninger.fodselsdato, 'years') < 18, [personopplysninger]);
  const harVerge = (personopplysninger ? (personopplysninger.harVerge && !personopplysninger.dodsdato)
    : harTilbakekrevingVerge);
  return (
    <>
      {personopplysninger && personopplysninger.dodsdato && (
        <Tooltip content={intl.formatMessage({ id: 'VisittkortLabels.DodTittel' })} alignBottom>
          <EtikettInfo className={styles.etikett}>
            <FormattedMessage id="VisittkortLabels.Dod" values={{ dato: dateFormat(personopplysninger.dodsdato) }} />
          </EtikettInfo>
        </Tooltip>
      )}
      {personopplysninger && personopplysninger.diskresjonskode === diskresjonskodeType.KODE6 && !personopplysninger.dodsdato && (
        <Tooltip content={intl.formatMessage({ id: 'VisittkortLabels.Diskresjon6Tittel' })} alignBottom>
          <EtikettAdvarsel className={styles.etikett}>
            <FormattedMessage id="VisittkortLabels.Diskresjon6" />
          </EtikettAdvarsel>
        </Tooltip>
      )}
      {personopplysninger && personopplysninger.diskresjonskode === diskresjonskodeType.KODE7 && !personopplysninger.dodsdato && (
        <Tooltip content={intl.formatMessage({ id: 'VisittkortLabels.Diskresjon7Tittel' })} alignBottom>
          <EtikettFokus className={styles.etikett}>
            <FormattedMessage id="VisittkortLabels.Diskresjon7" />
          </EtikettFokus>
        </Tooltip>
      )}
      {harVerge && (
        <Tooltip content={intl.formatMessage({ id: 'VisittkortLabels.VergeTittel' })} alignBottom>
          <EtikettInfo className={styles.etikett}>
            <FormattedMessage id="VisittkortLabels.Verge" />
          </EtikettInfo>
        </Tooltip>
      )}
      {personopplysninger && erSokerUnder18 && (
        <Tooltip content={intl.formatMessage({ id: 'VisittkortLabels.Under18Tittel' })} alignBottom>
          <EtikettInfo className={styles.etikett}>
            <FormattedMessage id="VisittkortLabels.Under18" />
          </EtikettInfo>
        </Tooltip>
      )}
    </>
  );
};

export default injectIntl(VisittkortLabels);
