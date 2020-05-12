import React from 'react';
import { useIntl } from 'react-intl';
import { Row } from 'nav-frontend-grid';

import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import { Image } from '@fpsak-frontend/shared-components';
import urlMann from '@fpsak-frontend/assets/images/mann.svg';
import urlUkjent from '@fpsak-frontend/assets/images/ukjent.svg';
import urlKvinne from '@fpsak-frontend/assets/images/kvinne.svg';
import Kjønnkode from '@fpsak-frontend/types/src/Kjønnkode';

import styles from './timeLineSoker.less';

interface TimeLineSokerProps {
  soker1KjonnKode: Kjønnkode;
  soker2KjonnKode: Kjønnkode;
}

const getKjønn = (kode) => {
  switch (kode) {
    case navBrukerKjonn.KVINNE:
      return { src: urlKvinne, title: 'Person.Woman' };
    case navBrukerKjonn.MANN:
      return { src: urlMann, title: 'Person.Man' };
    case navBrukerKjonn.UDEFINERT:
      return { src: urlUkjent, title: 'Person.Unknown' };
    default:
      return { src: urlUkjent, title: 'Person.Unknown' };
  }
};

/**
 * TimeLineSoker
 *
 * Presentationskomponent. Viser korrekt ikon for soker/medsoker
 */
const TimeLineSoker: React.FunctionComponent<TimeLineSokerProps> = ({
  soker1KjonnKode,
  soker2KjonnKode,
}) => {
  const intl = useIntl();
  return (
    <div className={styles.timelineSokerContatiner}>
      <Row>
        <Image
          className={styles.iconHovedsoker}
          src={getKjønn(soker1KjonnKode).src}
          alt={intl.formatMessage({ id: 'Person.ImageText' })}
          tooltip={intl.formatMessage({ id: getKjønn(soker1KjonnKode).title })}
        />
      </Row>
      <Row>
        <Image
          className={styles.iconMedsoker}
          src={getKjønn(soker2KjonnKode).src}
          alt={intl.formatMessage({ id: 'Person.ImageText' })}
          tooltip={intl.formatMessage({ id: getKjønn(soker2KjonnKode).title })}
        />
      </Row>
    </div>

  );
};

export default TimeLineSoker;
