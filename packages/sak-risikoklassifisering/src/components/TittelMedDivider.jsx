import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import {
  FlexColumn, FlexContainer, FlexRow, Image,
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
}) => {
  const intl = useIntl();
  return (
    <FlexContainer>
      <FlexRow>
        <FlexColumn>
          <Image
            src={imageSrc}
            alt={intl.formatMessage({ id: 'Risikopanel.Tittel' })}
            title={intl.formatMessage({ id: 'Risikopanel.Tittel' })}
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
};
TittelMedDivider.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  tittel: PropTypes.string.isRequired,
};

export default TittelMedDivider;
