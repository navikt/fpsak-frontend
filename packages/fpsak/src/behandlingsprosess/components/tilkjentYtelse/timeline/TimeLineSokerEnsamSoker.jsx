import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'nav-frontend-grid';

import navBrukerKjonn from 'kodeverk/navBrukerKjonn';
import Image from 'sharedComponents/Image';
import urlMann from 'images/mann.svg';

import urlKvinne from 'images/kvinne.svg';
import styles from './timeLineSokerEnsamSoker.less';

/**
 * TimeLineSoker
 *
 * Presentationskomponent. Viser korrekt ikon for soker/medsoker
 */

const isKvinne = kode => kode === navBrukerKjonn.KVINNE;

const TimeLineSokerEnsamSoker = ({
  hovedsokerKjonnKode,
}) => (
  <div className={styles.timelineSokerContatinerEnsamSoker}>
    <Row>
      <Image
        className={styles.iconMedsoker}
        src={isKvinne(hovedsokerKjonnKode) ? urlKvinne : urlMann}
        altCode="Person.ImageText"
        titleCode={isKvinne(hovedsokerKjonnKode) ? 'Person.Woman' : 'Person.Man'}
      />
    </Row>
  </div>

);

TimeLineSokerEnsamSoker.propTypes = {
  hovedsokerKjonnKode: PropTypes.string.isRequired,
};

export default TimeLineSokerEnsamSoker;
