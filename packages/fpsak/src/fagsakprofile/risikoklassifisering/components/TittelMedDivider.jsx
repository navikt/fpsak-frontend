import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Normaltekst } from 'nav-frontend-typografi';
import {
  FlexContainer, FlexRow, FlexColumn, Image,
} from '@fpsak-frontend/shared-components';

import styles from './tittelMedDivider.less';

/**
 * TittelMedDivider
 *
 * Presentasjonskomponent. Viser et ikon og en tittel skilt med en vertikal grå linje.
 */
const TittelMedDivider = ({
  imageSrc,
  tittel,
}) => (
  <FlexContainer>
    <FlexRow>
      <FlexColumn>
        <Image
          src={imageSrc}
          titleCode="Risikopanel.Tittel"
          altCode="Risikopanel.Tittel"
        />
      </FlexColumn>
      <FlexColumn>
        <div className={styles.divider} />
      </FlexColumn>
      <FlexColumn>
        <div className={styles.tekst}>
          <Normaltekst>
            <FormattedMessage id={tittel} />
          </Normaltekst>
        </div>
      </FlexColumn>
    </FlexRow>
  </FlexContainer>
);
TittelMedDivider.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  tittel: PropTypes.string.isRequired,
};

export default TittelMedDivider;
