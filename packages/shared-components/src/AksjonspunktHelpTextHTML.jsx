import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel2.svg';
import { Normaltekst } from 'nav-frontend-typografi';
import { isObject } from '@fpsak-frontend/utils';
import { FlexColumn, FlexContainer, FlexRow } from './flexGrid';
import Image from './Image';
import styles from './aksjonspunktHelpTextHTML.less';

/**
 * AksjonspunktHelpTextHTML
 *
 * Presentasjonskomponent. Viser hjelpetekster som forteller NAV-ansatt hva som må gjøres for
 * å avklare en eller flere aksjonspunkter.
 */

const AksjonspunktHelpTextHTML = ({
  children,
  intl,
}) => {
  if (!children || children.length === 0) {
    return null;
  }
  const elementStyle = children.length > 1 ? styles.severalElements : styles.oneElement;
  return (
    <div className={styles.container}>
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <Image className={styles.image} alt={intl.formatMessage({ id: 'HelpText.Aksjonspunkt' })} src={advarselIkonUrl} />
          </FlexColumn>

          <FlexColumn className={styles.aksjonspunktText}>
            {React.Children.map(children, (child) => (
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

AksjonspunktHelpTextHTML.propTypes = {
  intl: PropTypes.shape().isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string.isRequired),
    PropTypes.arrayOf(PropTypes.element.isRequired),
    PropTypes.element.isRequired,
  ]).isRequired,
};

export default injectIntl(AksjonspunktHelpTextHTML);
