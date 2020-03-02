import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';

import urlMann from '@fpsak-frontend/assets/images/mann.svg';
import urlKvinne from '@fpsak-frontend/assets/images/kvinne.svg';
import { Image } from '@fpsak-frontend/shared-components';

import AlderVisning from './Aldervisning';
import MerkePanel from './Merkepanel';

import styles from './personInfo.less';

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
  medPanel,
  intl,
}) => {
  const {
    erKvinne, dodsdato, diskresjonskode, erDod, alder, navn, personnummer,
  } = person;
  const content = (
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
            <AlderVisning erDod={erDod} alder={alder} dodsdato={dodsdato} />
          </Undertittel>
          <Undertekst>
            {personnummer}
          </Undertekst>
        </div>
        <div>
          <MerkePanel erDod={erDod} diskresjonskode={diskresjonskode} />
        </div>
      </div>
    </div>
  );
  return medPanel ? <Panel>{content}</Panel> : content;
};

PersonInfo.propTypes = {
  intl: PropTypes.shape().isRequired,
  person: PropTypes.shape().isRequired,
  medPanel: PropTypes.bool.isRequired,
};

export default injectIntl(PersonInfo);
