import React, { useMemo, FunctionComponent } from 'react';
import moment from 'moment';
import { injectIntl, FormattedMessage, WrappedComponentProps } from 'react-intl';
import {
  EtikettInfo, EtikettAdvarsel, EtikettFokus,
} from 'nav-frontend-etiketter';

import diskresjonskodeType from '@fpsak-frontend/kodeverk/src/diskresjonskodeType';
import { Personopplysninger } from '@fpsak-frontend/types';
import { dateFormat } from '@fpsak-frontend/utils';

import styles from './visittkortLabels.less';

interface OwnProps {
  personopplysninger: Personopplysninger;
}

const VisittkortLabels: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  personopplysninger,
}) => {
  const erSokerUnder18 = useMemo(() => moment().diff(personopplysninger.fodselsdato, 'years') < 18, [personopplysninger]);
  return (
    <>
      {personopplysninger.dodsdato && (
        <EtikettInfo className={styles.etikett} title={intl.formatMessage({ id: 'VisittkortLabels.DodTittel' })}>
          <FormattedMessage id="VisittkortLabels.Dod" values={{ dato: dateFormat(personopplysninger.dodsdato) }} />
        </EtikettInfo>
      )}
      {personopplysninger.diskresjonskode === diskresjonskodeType.KODE6 && !personopplysninger.dodsdato && (
        <EtikettAdvarsel className={styles.etikett} title={intl.formatMessage({ id: 'VisittkortLabels.Diskresjon6Tittel' })}>
          <FormattedMessage id="VisittkortLabels.Diskresjon6" />
        </EtikettAdvarsel>
      )}
      {personopplysninger.diskresjonskode === diskresjonskodeType.KODE7 && !personopplysninger.dodsdato && (
        <EtikettFokus className={styles.etikett} title={intl.formatMessage({ id: 'VisittkortLabels.Diskresjon7Tittel' })}>
          <FormattedMessage id="VisittkortLabels.Diskresjon7" />
        </EtikettFokus>
      )}
      {personopplysninger.harVerge && !personopplysninger.dodsdato && (
        <EtikettInfo className={styles.etikett} title={intl.formatMessage({ id: 'VisittkortLabels.VergeTittel' })}>
          <FormattedMessage id="VisittkortLabels.Verge" />
        </EtikettInfo>
      )}
      {erSokerUnder18 && (
        <EtikettInfo className={styles.etikett} title={intl.formatMessage({ id: 'VisittkortLabels.Under18Tittel' })}>
          <FormattedMessage id="VisittkortLabels.Under18" />
        </EtikettInfo>
      )}
    </>
  );
};

export default injectIntl(VisittkortLabels);
