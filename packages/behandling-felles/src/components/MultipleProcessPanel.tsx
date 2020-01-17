import React, { FunctionComponent, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';

import { FadingPanel, VerticalSpacer, AksjonspunktHelpTextHTML } from '@fpsak-frontend/shared-components';

import Kodeverk from '../types/kodeverkTsType';
import Behandling from '../types/behandlingTsType';
import DataFetcherBehandlingDataV2 from '../DataFetcherBehandlingDataV2';

import styles from './multipleProcessPanel.less';

interface OwnProps {
  behandling: Behandling;
  alleKodeverk: {[key: string]: Kodeverk[]};
  prosessStegData: any;
  submitCallback: () => void;
  harApentFaktaAksjonspunkt: boolean;
}

const MultipleProcessPanel: FunctionComponent<OwnProps> = ({
  behandling,
  alleKodeverk,
  prosessStegData,
  submitCallback,
  harApentFaktaAksjonspunkt,
}) => {
  const filteredPanels = prosessStegData.filter((stegData) => stegData.renderComponent);
  const panels = filteredPanels.map((stegData) => (
    <DataFetcherBehandlingDataV2
      key={stegData.code}
      behandlingVersion={behandling.versjon}
      endpoints={stegData.endpoints}
      render={(dataProps) => stegData.renderComponent({
        ...dataProps,
        behandling,
        alleKodeverk,
        submitCallback,
        ...stegData.komponentData,
      })}
    />
  ));

  if (panels.length === 1) {
    return (
      <FadingPanel>
        {panels[0]}
      </FadingPanel>
    );
  }

  const aksjonspunktTekstKoder = useMemo(() => filteredPanels
    .filter((p) => p.isAksjonspunktOpen)
    .reduce((acc, p) => [...acc, p.aksjonspunktHelpTextCodes], []),
  [filteredPanels]);

  return (
    <FadingPanel>
      {(harApentFaktaAksjonspunkt || aksjonspunktTekstKoder.length > 0) && (
        <>
          <AksjonspunktHelpTextHTML>
            {harApentFaktaAksjonspunkt
              ? [<FormattedMessage id="MultipleProcessPanel.AvventerAvklaringAv" />]
              : aksjonspunktTekstKoder.map((kode) => <FormattedMessage key={kode} id={kode} />)}
          </AksjonspunktHelpTextHTML>
          <VerticalSpacer thirtyTwoPx />
        </>
      )}
      <Row className="">
        <Column xs="6">
          {panels.filter((_p, index) => index < 2)
            .map((p, index) => (
              <div className={index === 0 ? styles.panelLeftTop : styles.panelLeftBottom}>
                {p}
              </div>
            ))}
        </Column>
        <Column xs="6">
          {panels.filter((_p, index) => index > 1)
            .map((p, index) => (
              <div className={index === 0 ? styles.panelRightTop : styles.panelRightBottom}>
                {p}
              </div>
            ))}
        </Column>
      </Row>
    </FadingPanel>
  );
};

export default MultipleProcessPanel;
