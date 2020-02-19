import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { PersonCard, EmptyPersonCard, Gender } from '@navikt/nap-person-card';

import {
  FlexColumn, FlexContainer, FlexRow,
} from '@fpsak-frontend/shared-components';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import {
  Kodeverk, Personopplysninger, FamilieHendelseSamling, Fagsak,
} from '@fpsak-frontend/types';
import relasjonsRolleType from '@fpsak-frontend/kodeverk/src/relasjonsRolleType';

import VisittkortDetaljerPopup from './VisittkortDetaljerPopup';
import VisittkortLabels from './VisittkortLabels';
import VisittkortBarnInfoPanel from './VisittkortBarnInfoPanel';

import styles from './visittkortPanel.less';

const utledKjonn = (kjonn) => {
  if (kjonn.kode === navBrukerKjonn.KVINNE) {
    return Gender.female;
  }
  return kjonn.kode === navBrukerKjonn.MANN ? Gender.male : Gender.unknown;
};

interface OwnProps {
  fagsak: Fagsak;
  personopplysninger: Personopplysninger;
  familieHendelse: FamilieHendelseSamling;
  alleKodeverk?: {[key: string]: [Kodeverk]};
  sprakkode: string;
}

const VisittkortPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  personopplysninger,
  familieHendelse,
  lenkeTilAnnenPart,
  fagsak,
  alleKodeverk,
  sprakkode,
}) => {
  if (!personopplysninger) {
    const { person } = fagsak;
    return (
      <div className={styles.container}>
        <PersonCard
          name={person.navn}
          fodselsnummer={person.personnummer}
          gender={person.erKvinne ? Gender.female : Gender.male}
        />
      </div>
    );
  }

  const erMor = fagsak.relasjonsRolleType === relasjonsRolleType.MOR;

  const soker = erMor || !personopplysninger.annenPart ? personopplysninger : personopplysninger.annenPart;
  const annenPart = !erMor && personopplysninger.annenPart ? personopplysninger : undefined;

  return (
    <div className={styles.container}>
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <PersonCard
              name={soker.navn}
              fodselsnummer={soker.fnr}
              gender={utledKjonn(soker.navBrukerKjonn)}
              url={lenkeTilAnnenPart}
              renderMenuContent={(): JSX.Element => (
                <VisittkortDetaljerPopup
                  personopplysninger={soker}
                  alleKodeverk={alleKodeverk}
                  sprakkode={sprakkode}
                />
              )}
              renderLabelContent={(): JSX.Element => <VisittkortLabels personopplysninger={soker} />}
              isActive={erMor}
            />
          </FlexColumn>
          {annenPart && annenPart.aktoerId && (
            <FlexColumn>
              <PersonCard
                name={annenPart.navn}
                fodselsnummer={annenPart.fnr}
                gender={utledKjonn(annenPart.navBrukerKjonn)}
                url={lenkeTilAnnenPart}
                renderMenuContent={(): JSX.Element => (
                  <VisittkortDetaljerPopup
                    personopplysninger={annenPart}
                    alleKodeverk={alleKodeverk}
                    sprakkode={sprakkode}
                  />
                )}
                isActive={!erMor}
              />
            </FlexColumn>
          )}
          {annenPart && !annenPart.aktoerId && (
            <FlexColumn>
              <EmptyPersonCard namePlaceholder={intl.formatMessage({ id: 'VisittkortPanel.Ukjent' })} />
            </FlexColumn>
          )}
          <FlexColumn className={styles.pushRight}>
            <VisittkortBarnInfoPanel familieHendelseGjeldende={familieHendelse.gjeldende} />
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </div>
  );
};

export default injectIntl(VisittkortPanel);
