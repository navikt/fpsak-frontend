import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'nav-frontend-grid';

import navBrukerKjonn from 'kodeverk/navBrukerKjonn';
import Image from 'sharedComponents/Image';
import urlMann from 'images/mann.svg';

import urlKvinne from 'images/kvinne.svg';
import styles from './timeLineSoker.less';

/**
 * TimeLineSoker
 *
 * Presentationskomponent. Viser korrekt ikon for soker/medsoker
 */

const isKvinne = kode => kode === navBrukerKjonn.KVINNE;

const TimeLineSoker = ({
  hovedsokerKjonnKode,
  medsokerKjonnKode,
}) => (
  <div className={styles.timelineSokerContatiner}>
    <Row>
      <Image
        className={styles.iconHovedsoker}
        src={isKvinne(hovedsokerKjonnKode) ? urlKvinne : urlMann}
        altCode="Person.ImageText"
        titleCode={isKvinne(hovedsokerKjonnKode) ? 'Person.Woman' : 'Person.Man'}
      />
    </Row>
    <Row>
      <Image
        className={styles.iconMedsoker}
        src={isKvinne(medsokerKjonnKode) ? urlKvinne : urlMann}
        altCode="Person.ImageText"
        titleCode={isKvinne(medsokerKjonnKode) ? 'Person.Woman' : 'Person.Man'}
      />
    </Row>
  </div>

);

TimeLineSoker.propTypes = {
  hovedsokerKjonnKode: PropTypes.string.isRequired,
  medsokerKjonnKode: PropTypes.string.isRequired,
};

export default TimeLineSoker;
