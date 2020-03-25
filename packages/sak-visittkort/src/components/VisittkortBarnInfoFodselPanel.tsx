import React, { FunctionComponent } from 'react';
import moment from 'moment';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { Normaltekst } from 'nav-frontend-typografi';

import { FamilieHendelseSamling } from '@fpsak-frontend/types';
import { FlexColumn } from '@fpsak-frontend/shared-components';
import { dateFormat, DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';

import styles from './visittkortBarnInfoFodselPanel.less';

const finnFodselsdatoTekstkode = (antallBarn) => {
  if (antallBarn === 1) {
    return 'VisittkortBarnInfoFodselPanel.Fodt';
  }
  return antallBarn === 2 ? 'VisittkortBarnInfoFodselPanel.Tvillinger' : 'VisittkortBarnInfoFodselPanel.Flerlinger';
};

const finnAlderTekstProps = (avklartBarn) => {
  const forsteFodselsdato = moment.min(avklartBarn.map((barn) => moment(barn.fodselsdato)));

  const ar = moment().diff(forsteFodselsdato, 'years');
  const maneder = moment().diff(forsteFodselsdato, 'months');
  const dager = moment().diff(forsteFodselsdato, 'days');

  let tekstkode;
  if (ar > 0) {
    tekstkode = 'VisittkortBarnInfoFodselPanel.Ar.Fodt';
  } else if (maneder > 0) {
    tekstkode = 'VisittkortBarnInfoFodselPanel.Maned.Fodt';
  } else if (dager >= 0) {
    if (dager === 1) { tekstkode = 'VisittkortBarnInfoFodselPanel.Dag.Fodt'; }
    if (dager === 0 || dager > 1) { tekstkode = 'VisittkortBarnInfoFodselPanel.Dager.Fodt'; }
  }

  return {
    id: tekstkode,
    values: {
      value: ar || maneder || dager,
    },
  };
};

interface OwnProps {
  familieHendelse: FamilieHendelseSamling;
}

const VisittkortBarnInfoFodselPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  familieHendelse,
}) => {
  const { oppgitt, gjeldende } = familieHendelse;

  const avklartBarn = gjeldende.avklartBarn ? gjeldende.avklartBarn : oppgitt.avklartBarn;

  const termindato = gjeldende.termindato ? gjeldende.termindato : oppgitt.termindato;

  const visDodfodtEtikett = avklartBarn.length > 0 && avklartBarn.every((barn) => barn.dodsdato);
  const visFodselsdato = avklartBarn.some((barn) => barn.fodselsdato);

  const forsteFodselsdato = moment.min(avklartBarn.map((barn) => moment(barn.fodselsdato)));

  return (
    <>
      <FlexColumn className={styles.text}>
        <Normaltekst>
          {visFodselsdato && (
            <>
              <FormattedMessage id={finnFodselsdatoTekstkode(avklartBarn.length)} values={{ dato: forsteFodselsdato.format(DDMMYYYY_DATE_FORMAT) }} />
              <FormattedMessage {...finnAlderTekstProps(avklartBarn)} />
            </>
          )}
          {!visFodselsdato && termindato && <FormattedMessage id="VisittkortBarnInfoFodselPanel.Termin" values={{ dato: dateFormat(termindato) }} />}
        </Normaltekst>
      </FlexColumn>
      {visDodfodtEtikett && (
        <FlexColumn>
          <EtikettInfo className={styles.etikett} title={intl.formatMessage({ id: 'VisittkortBarnInfoFodselPanel.DodTittel' })}>
            <FormattedMessage id="VisittkortBarnInfoFodselPanel.Dod" />
          </EtikettInfo>
        </FlexColumn>
      )}
    </>
  );
};

export default injectIntl(VisittkortBarnInfoFodselPanel);
