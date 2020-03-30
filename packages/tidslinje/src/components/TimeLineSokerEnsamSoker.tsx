import React, { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';
import { Row } from 'nav-frontend-grid';

import Kjønnkode from '@fpsak-frontend/types/src/Kjønnkode';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import { Image } from '@fpsak-frontend/shared-components';
import urlMann from '@fpsak-frontend/assets/images/mann.svg';
import urlKvinne from '@fpsak-frontend/assets/images/kvinne.svg';

import styles from './timeLineSokerEnsamSoker.less';

const isKvinne = (kode) => kode === navBrukerKjonn.KVINNE;

/**
 * TimeLineSoker
 *
 * Presentationskomponent. Viser korrekt ikon for soker/medsoker
 */
const TimeLineSokerEnsamSoker: FunctionComponent<{ hovedsokerKjonnKode: Kjønnkode }> = ({
  hovedsokerKjonnKode,
}) => {
  const intl = useIntl();
  return (
    <div className={styles.timelineSokerContatinerEnsamSoker}>
      <Row>
        <Image
          className={styles.iconMedsoker}
          src={isKvinne(hovedsokerKjonnKode) ? urlKvinne : urlMann}
          alt={intl.formatMessage({ id: 'Person.ImageText' })}
          tooltip={intl.formatMessage({ id: isKvinne(hovedsokerKjonnKode) ? 'Person.Woman' : 'Person.Man' })}
        />
      </Row>
    </div>
  );
};

export default TimeLineSokerEnsamSoker;
