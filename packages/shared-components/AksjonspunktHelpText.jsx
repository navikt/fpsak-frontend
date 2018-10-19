import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { FlexContainer, FlexColumn, FlexRow } from 'sharedComponents/flexGrid';

import Image from 'sharedComponents/Image';
import advarselIkonUrl from 'images/advarsel.svg';
import { isObject } from 'utils/objectUtils';

import styles from './aksjonspunktHelpText.less';

/**
 * AksjonspunktHelpText
 *
 * Presentasjonskomponent. Viser hjelpetekster som forteller NAV-ansatt hva som må gjøres for
 * å avklare en eller flere aksjonspunkter.
 *
 * Eksempel:
 * ```html
 * <AksjonspunktHelpText children={['tekst1', 'tekst2']} isAksjonspunktOpen={false} />
 * ```
 */
const AksjonspunktHelpText = ({
  children,
  isAksjonspunktOpen,
  marginBottom,
}) => {
  if (!isAksjonspunktOpen) {
    return (
      <div>
        {children.map(child => (
          <Normaltekst key={isObject(child) ? child.key : child} className={styles.wordwrap}>
            <strong>
              <FormattedMessage id="HelpText.Aksjonspunkt.BehandletAksjonspunkt" />
:
            </strong>
            {' '}
            {child}
          </Normaltekst>
        ))}
      </div>
    );
  }

  const elementStyle = children.length === 1 ? styles.oneElement : styles.severalElements;
  return (
    <div className={marginBottom ? styles.container : ''}>
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <Image className={styles.image} altCode="HelpText.Aksjonspunkt" src={advarselIkonUrl} />
          </FlexColumn>
          <FlexColumn>
            <div className={styles.divider} />
          </FlexColumn>
          <FlexColumn className={styles.aksjonspunktText}>
            {children.map(child => (
              <div key={isObject(child) ? child.key : child} className={elementStyle}>
                <Element className={styles.wordwrap}>{child}</Element>
              </div>
            ))}
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </div>
  );
};

AksjonspunktHelpText.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string.isRequired),
    PropTypes.arrayOf(PropTypes.element.isRequired),
  ]).isRequired,
  isAksjonspunktOpen: PropTypes.bool.isRequired,
  marginBottom: PropTypes.bool,
};

AksjonspunktHelpText.defaultProps = {
  marginBottom: false,
};

export default AksjonspunktHelpText;
