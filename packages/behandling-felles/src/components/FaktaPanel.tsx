import React, { FunctionComponent, ReactNode } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import SideMenu from '@navikt/nap-side-menu';

import {
  FlexColumn, FlexContainer, FlexRow,
} from '@fpsak-frontend/shared-components';
import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel_ny.svg';

import FaktaPanelFaktaPanelMenyRadMeny from '../types/faktaPanelMenyRadTsType';

import styles from './faktaPanel.less';

interface OwnProps {
  paneler: FaktaPanelFaktaPanelMenyRadMeny[];
  onClick?: (index: number) => void;
  children: ReactNode;
}

const FaktaPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  paneler,
  onClick,
  children,
}) => (
  <div className={styles.container}>
    <FlexContainer fullHeight>
      <FlexRow>
        <FlexColumn className={styles.sideMenu}>
          <SideMenu
            heading={intl.formatMessage({ id: 'FaktaPanel.FaktaOm' })}
            links={paneler.map((panel) => ({
              label: panel.tekst,
              active: panel.erAktiv,
              iconSrc: panel.harAksjonspunkt ? advarselIkonUrl : undefined,
              iconAltText: panel.harAksjonspunkt ? intl.formatMessage({ id: 'HelpText.Aksjonspunkt' }) : undefined,
            }))}
            onClick={onClick}
          />
        </FlexColumn>
        <FlexColumn className={styles.content}>
          {children}
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  </div>
);

export default injectIntl(FaktaPanel);
