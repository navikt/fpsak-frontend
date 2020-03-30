import React, { ReactNode, FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel.svg';
import { isObject } from '@fpsak-frontend/utils';

import { FlexColumn, FlexContainer, FlexRow } from './flexGrid';
import Image from './Image';

import styles from './aksjonspunktHelpText.less';

interface OwnProps {
  children: string[] | ReactNode[];
  isAksjonspunktOpen: boolean;
  marginBottom?: boolean;
}

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
const AksjonspunktHelpText: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  children,
  intl,
  isAksjonspunktOpen,
  marginBottom = false,
}) => {
  if (!isAksjonspunktOpen) {
    return (
      <>
        {React.Children.map(children, (child) => (
          // @ts-ignore (Denne komponenten skal fjernast)
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
            {React.Children.map(children, (child) => (
              // @ts-ignore (Denne komponenten skal fjernast)
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

export default injectIntl(AksjonspunktHelpText);
