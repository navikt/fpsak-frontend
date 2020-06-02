import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';

import urlMann from '@fpsak-frontend/assets/images/mann.svg';
import urlKvinne from '@fpsak-frontend/assets/images/kvinne.svg';
import { Image } from '@fpsak-frontend/shared-components';
import { FagsakPerson } from '@fpsak-frontend/types';

import styles from './personInfo.less';

interface OwnProps {
  person: FagsakPerson;
}

/**
 * PersonInfo
 *
 * Presentasjonskomponent. Definerer visning av personen relatert til fagsak. (Søker)
 *
 * Eksempel:
 * ```html
 * <PersonInfo person={navn:"Ola" alder:{40} personnummer:"12345678910" erKvinne:false
 * erDod:false diskresjonskode:"6" dodsdato:"1990.03.03"} medPanel />
 * ```
 */
const PersonInfo: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  person,
  intl,
}) => {
  const {
    erKvinne, navn, personnummer,
  } = person;
  return (
    <div>
      <Image
        className={styles.icon}
        src={erKvinne ? urlKvinne : urlMann}
        alt={intl.formatMessage({ id: 'Person.ImageText' })}
        tooltip={intl.formatMessage({ id: erKvinne ? 'Person.Woman' : 'Person.Man' })}
      />
      <div className={styles.infoPlaceholder}>
        <div>
          <Undertittel>
            {`${navn} `}
          </Undertittel>
          <Undertekst>
            {personnummer}
          </Undertekst>
        </div>
      </div>
    </div>
  );
};

export default injectIntl(PersonInfo);
