import React, { ReactNode, FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel2.svg';
import { isObject } from '@fpsak-frontend/utils';

import { FlexColumn, FlexContainer, FlexRow } from './flexGrid';
import Image from './Image';

import styles from './aksjonspunktHelpTextHTML.less';

interface OwnProps {
  children: string[] | ReactNode | ReactNode[];
}

/**
 * AksjonspunktHelpTextHTML
 *
 * Presentasjonskomponent. Viser hjelpetekster som forteller NAV-ansatt hva som må gjøres for
 * å avklare en eller flere aksjonspunkter.
 */
const AksjonspunktHelpTextHTML: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  children,
  intl,
}) => {
  if (!children || (Array.isArray(children) && children.length === 0)) {
    return null;
  }
  const elementStyle = Array.isArray(children) && children.length > 1 ? styles.severalElements : styles.oneElement;
  return (
    <div className={styles.container}>
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <Image className={styles.image} alt={intl.formatMessage({ id: 'HelpText.Aksjonspunkt' })} src={advarselIkonUrl} />
          </FlexColumn>

          <FlexColumn className={styles.aksjonspunktText}>
            {React.Children.map(children, (child) => (
              // @ts-ignore (Denne komponenten skal fjernast)
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

export default injectIntl(AksjonspunktHelpTextHTML);
