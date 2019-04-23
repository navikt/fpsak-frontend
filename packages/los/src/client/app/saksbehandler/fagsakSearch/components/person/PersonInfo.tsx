
import React from 'react';

import { Undertittel, Undertekst } from 'nav-frontend-typografi';

import Image from 'sharedComponents/Image';
import urlMann from 'images/mann.svg';
import urlKvinne from 'images/kvinne.svg';

import { Person } from '../../personTsType';
import personPropType from '../../personPropType';
import AlderVisning from './Aldervisning';
import MerkePanel from './Merkepanel';

import styles from './personInfo.less';

interface TsProps {
  person: Person;
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
const PersonInfo = ({
  person,
}: TsProps) => {
  const {
    erKvinne, dodsdato, diskresjonskode, alder, navn, personnummer,
  } = person;
  return (
    <div>
      <Image
        className={styles.icon}
        src={erKvinne ? urlKvinne : urlMann}
        altCode="Person.ImageText"
        titleCode={erKvinne ? 'Person.Woman' : 'Person.Man'}
      />
      <div className={styles.infoPlaceholder}>
        <div>
          <Undertittel>
            {navn}
            {' '}
            <AlderVisning erDod={!!dodsdato} alder={alder} dodsdato={dodsdato} />
          </Undertittel>
          <Undertekst>
            {personnummer}
          </Undertekst>
        </div>
        <div>
          <MerkePanel erDod={!!dodsdato} diskresjonskode={diskresjonskode} />
        </div>
      </div>
    </div>
  );
};

PersonInfo.propTypes = {
  person: personPropType.isRequired,
};

export default PersonInfo;
