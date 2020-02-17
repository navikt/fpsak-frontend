import React from 'react';
import PersonCard from '@navikt/nap-person-card';

import {
  FlexColumn, FlexContainer, FlexRow,
} from '@fpsak-frontend/shared-components';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';

import VisittkortDetaljerPopup from './VisittkortDetaljerPopup';

import styles from './visittkortPanel.less';

const utledErKvinne = (erKvinne) => (erKvinne ? 'female' : 'male');
const utledKjonn = (kjonn) => {
  if (kjonn.kode === navBrukerKjonn.KVINNE) {
    return 'female';
  }

  return kjonn.kode === navBrukerKjonn.MANN ? 'male' : 'unknown';
};

const getBrukerInfo = (personopplysninger, fagsakPerson = {}) => ({
  navn: personopplysninger ? personopplysninger.navn : fagsakPerson.navn,
  fodselsnummer: personopplysninger ? personopplysninger.fnr : fagsakPerson.personnummer,
  kjonn: personopplysninger ? utledKjonn(personopplysninger.navBrukerKjonn) : utledErKvinne(fagsakPerson.erKvinne),
});

const VisittkortPanel = ({
  personopplysninger,
  fagsakPerson,
  alleKodeverk,
  sprakkode,
}) => {
  const hoved = getBrukerInfo(personopplysninger, fagsakPerson);
  const annerPart = personopplysninger && personopplysninger.annenPart ? getBrukerInfo(personopplysninger.annenPart) : undefined;
  return (
    <div className={styles.container}>
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <PersonCard
              name={hoved.navn}
              fodselsnummer={hoved.fodselsnummer}
              gender={hoved.kjonn}
              url="#"
              renderMenuContent={(): JSX.Element => (personopplysninger ? <VisittkortDetaljerPopup personopplysninger={personopplysninger} alleKodeverk={alleKodeverk} sprakkode={sprakkode} /> : null)}
              isActive
            />
          </FlexColumn>
          {personopplysninger && personopplysninger.annenPart && (
          <FlexColumn>
            <PersonCard
              name={annerPart.navn}
              fodselsnummer={annerPart.fodselsnummer}
              gender={annerPart.kjonn}
              url="#"
              renderMenuContent={(): JSX.Element => (personopplysninger ? <VisittkortDetaljerPopup personopplysninger={personopplysninger.annenPart} alleKodeverk={alleKodeverk} sprakkode={sprakkode} /> : null)}
              isActive={false}
            />
          </FlexColumn>
          )}

        </FlexRow>
      </FlexContainer>
    </div>
  );
};

export default VisittkortPanel;
