import React, { FunctionComponent } from 'react';
import moment from 'moment';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { Normaltekst } from 'nav-frontend-typografi';

import { FamilieHendelseSamling } from '@fpsak-frontend/types';
import {
  FlexColumn, FlexContainer, FlexRow, Image,
} from '@fpsak-frontend/shared-components';

import { dateFormat, DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import barnevognImage from '@fpsak-frontend/assets/images/barnevogn.svg';

import styles from './visittkortBarnInfoPanel.less';

const finnFodselsdatoTekstkode = (antallBarn) => {
  if (antallBarn === 1) {
    return 'VisittkortBarnInfoPanel.Fodt';
  }
  return antallBarn === 2 ? 'VisittkortBarnInfoPanel.Tvillinger' : 'VisittkortBarnInfoPanel.Flerlinger';
};

const finnAlderTekstProps = (avklartBarn) => {
  const forsteFodselsdato = moment.min(avklartBarn.map((barn) => moment(barn.fodselsdato)));

  const ar = moment().diff(forsteFodselsdato, 'years');
  const maneder = moment().diff(forsteFodselsdato, 'months');
  const dager = moment().diff(forsteFodselsdato, 'days');

  let tekstkode;
  if (ar > 0) {
    tekstkode = 'VisittkortBarnInfoPanel.Ar.Fodt';
  } else if (maneder > 0) {
    if (maneder === 1) { tekstkode = 'VisittkortBarnInfoPanel.Maned.Fodt'; }
    if (maneder > 1) { tekstkode = 'VisittkortBarnInfoPanel.Maneder.Fodt'; }
  } else if (dager > 0) {
    if (dager === 1) { tekstkode = 'VisittkortBarnInfoPanel.Dag.Fodt'; }
    if (dager > 1) { tekstkode = 'VisittkortBarnInfoPanel.Dager.Fodt'; }
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

const VisittkortBarnInfoPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  familieHendelse,
}) => {
  const { oppgitt, gjeldende } = familieHendelse;
  const aBarn = oppgitt.avklartBarn ? oppgitt.avklartBarn : [];
  const avklartBarn = gjeldende.avklartBarn ? gjeldende.avklartBarn : aBarn;
  const termindato = gjeldende.termindato ? gjeldende.termindato : oppgitt.termindato;
  const visDodfodtEtikett = avklartBarn.length > 0 && avklartBarn.every((barn) => barn.dodsdato);
  const visFodselsdato = avklartBarn.some((barn) => barn.fodselsdato);
  const forsteFodselsdato = moment.min(avklartBarn.map((barn) => moment(barn.fodselsdato)));

  return (
    <div className={styles.container}>
      <FlexContainer>
        <FlexRow>
          <FlexColumn className={styles.image}>
            <Image src={barnevognImage} />
          </FlexColumn>
          <FlexColumn className={styles.text}>
            <Normaltekst>
              {visFodselsdato && (
                <>
                  <FormattedMessage id={finnFodselsdatoTekstkode(avklartBarn.length)} values={{ dato: forsteFodselsdato.format(DDMMYYYY_DATE_FORMAT) }} />
                  <FormattedMessage {...finnAlderTekstProps(avklartBarn)} />
                </>
              )}
              {!visFodselsdato && termindato && <FormattedMessage id="VisittkortBarnInfoPanel.Termin" values={{ dato: dateFormat(termindato) }} />}
            </Normaltekst>
          </FlexColumn>
          {visDodfodtEtikett && (
            <FlexColumn>
              <EtikettInfo className={styles.etikett} title={intl.formatMessage({ id: 'VisittkortBarnInfoPanel.DodTittel' })}>
                <FormattedMessage id="VisittkortBarnInfoPanel.Dod" />
              </EtikettInfo>
            </FlexColumn>
          )}
        </FlexRow>
      </FlexContainer>
    </div>
  );
};

export default injectIntl(VisittkortBarnInfoPanel);
