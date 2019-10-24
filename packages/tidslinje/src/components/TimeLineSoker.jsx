import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'nav-frontend-grid';

import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import { Image } from '@fpsak-frontend/shared-components';
import urlMann from '@fpsak-frontend/assets/images/mann.svg';
import urlUkjent from '@fpsak-frontend/assets/images/ukjent.svg';
import urlKvinne from '@fpsak-frontend/assets/images/kvinne.svg';
import { useIntl } from 'react-intl';
import styles from './timeLineSoker.less';

/**
 * TimeLineSoker
 *
 * Presentationskomponent. Viser korrekt ikon for soker/medsoker
 */

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

const TimeLineSoker = ({
  hovedsokerKjonnKode,
  medsokerKjonnKode,
}) => {
  const intl = useIntl();
  return (
    <div className={styles.timelineSokerContatiner}>
      <Row>
        <Image
          className={styles.iconHovedsoker}
          src={getKjønn(hovedsokerKjonnKode).src}
          alt={intl.formatMessage({ id: 'Person.ImageText' })}
          title={intl.formatMessage({ id: getKjønn(hovedsokerKjonnKode).title })}
        />
      </Row>
      <Row>
        <Image
          className={styles.iconMedsoker}
          src={getKjønn(medsokerKjonnKode).src}
          alt={intl.formatMessage({ id: 'Person.ImageText' })}
          title={intl.formatMessage({ id: getKjønn(medsokerKjonnKode).title })}
        />
      </Row>
    </div>

  );
};

TimeLineSoker.propTypes = {
  hovedsokerKjonnKode: PropTypes.string.isRequired,
  medsokerKjonnKode: PropTypes.string.isRequired,
};

export default TimeLineSoker;