import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel.svg';
import { isObject } from '@fpsak-frontend/utils';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
  FlexColumn, FlexContainer, FlexRow, Image,
} from '@fpsak-frontend/shared-components';

import styles from './aksjonspunktHelpText_V2.less';

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
const AksjonspunktHelpTextV2 = ({
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
              :
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

AksjonspunktHelpTextV2.propTypes = {
  intl: PropTypes.shape().isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string.isRequired),
    PropTypes.arrayOf(PropTypes.element.isRequired),
  ]).isRequired,
  isAksjonspunktOpen: PropTypes.bool.isRequired,
  marginBottom: PropTypes.bool,
};

AksjonspunktHelpTextV2.defaultProps = {
  marginBottom: false,
};

export default injectIntl(AksjonspunktHelpTextV2);
