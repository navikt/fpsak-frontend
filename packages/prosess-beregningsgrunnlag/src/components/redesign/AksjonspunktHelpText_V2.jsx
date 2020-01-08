import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel2.svg';
import { Normaltekst } from 'nav-frontend-typografi';
import {
  FlexColumn, FlexContainer, FlexRow, Image,
} from '@fpsak-frontend/shared-components';
import { isObject } from '@fpsak-frontend/utils';
import styles from './aksjonspunktHelpText_V2.less';

const AksjonspunktHelpTextV2 = ({
  children,
  intl,
}) => {
  if (!children || children.length === 0) {
    return null;
  }
  const elementStyle = children.length === 1 ? styles.oneElement : styles.severalElements;
  return (
    <div className={styles.container}>
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <Image className={styles.image} alt={intl.formatMessage({ id: 'HelpText.Aksjonspunkt' })} src={advarselIkonUrl} />
          </FlexColumn>

          <FlexColumn className={styles.aksjonspunktText}>
            {children.map((child) => (
              <div key={isObject(child) ? child.key : child} className={elementStyle}>
                <Normaltekst className={styles.wordwrap}>{child}</Normaltekst>
              </div>
            ))}
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </div>
  );
};

AksjonspunktHelpTextV2.propTypes = {
  intl: PropTypes.shape().isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string.isRequired),
    PropTypes.arrayOf(PropTypes.element.isRequired),
  ]).isRequired,
};

export default injectIntl(AksjonspunktHelpTextV2);
