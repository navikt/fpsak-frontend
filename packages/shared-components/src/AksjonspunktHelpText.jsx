import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel.svg';
import { isObject } from '@fpsak-frontend/utils';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { FlexColumn, FlexContainer, FlexRow } from './flexGrid';
import Image from './Image';

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
  intl,
  isAksjonspunktOpen,
  marginBottom,
}) => {
  if (!isAksjonspunktOpen) {
    return (
      <>
        {children.map((child) => (
          <Normaltekst key={isObject(child) ? child.key : child} className={styles.wordwrap}>
            <strong>
              <FormattedMessage id="HelpText.Aksjonspunkt.BehandletAksjonspunkt" />
            </strong>
            {child}
          </Normaltekst>
        ))}
      </>
    );
  }
  const elementStyle = children.length === 1 ? styles.oneElement : styles.severalElements;
  return (
    <div className={marginBottom ? styles.container : ''}>
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <Image className={styles.image} alt={intl.formatMessage({ id: 'HelpText.Aksjonspunkt' })} src={advarselIkonUrl} />
          </FlexColumn>
          <FlexColumn>
            <div className={styles.divider} />
          </FlexColumn>
          <FlexColumn className={styles.aksjonspunktText}>
            {children.map((child) => (
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
  intl: PropTypes.shape().isRequired,
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

export default injectIntl(AksjonspunktHelpText);
