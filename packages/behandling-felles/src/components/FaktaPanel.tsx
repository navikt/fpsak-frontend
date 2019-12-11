import React, { FunctionComponent, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import SideMenu from '@navikt/nap-side-menu';

import {
  FlexColumn, FlexContainer, FlexRow,
} from '@fpsak-frontend/shared-components';

import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel_ny.svg';

import styles from './faktaPanel.less';

interface PanelData {
  tekst: string;
  erAktiv: boolean;
  harAksjonspunkt: boolean;
}

interface OwnProps {
  paneler: PanelData[];
  velgPanel?: (index: number) => number;
  children: ReactNode;
}

const FaktaPanel: FunctionComponent<OwnProps> = ({
  paneler,
  velgPanel,
  children,
}) => {
  const intl = useIntl();
  return (
    <div className={styles.container}>
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <SideMenu
              heading={intl.formatMessage({ id: 'FaktaPanel.FaktaOm' })}
              links={paneler.map((panel) => ({
                label: panel.tekst,
                active: panel.erAktiv,
                iconSrc: panel.harAksjonspunkt ? advarselIkonUrl : undefined,
                iconAltText: panel.harAksjonspunkt ? intl.formatMessage({ id: 'HelpText.Aksjonspunkt' }) : undefined,
              }))}
              onClick={velgPanel}
            />
          </FlexColumn>
          <FlexColumn>
            <div className={styles.content}>
              {children}
            </div>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </div>
  );
};

FaktaPanel.propTypes = {
  paneler: PropTypes.arrayOf(PropTypes.shape({
    tekst: PropTypes.string.isRequired,
    erAktiv: PropTypes.bool.isRequired,
    harAksjonspunkt: PropTypes.bool.isRequired,
  }).isRequired).isRequired,
  velgPanel: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default FaktaPanel;
