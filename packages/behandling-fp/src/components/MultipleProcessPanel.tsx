import React, { FunctionComponent, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import AlertStripe from 'nav-frontend-alertstriper';
import { Column, Row } from 'nav-frontend-grid';

import { finnAksjonspunktHjelpetekstKode } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Kodeverk, DataFetcherBehandlingDataV2, Behandling } from '@fpsak-frontend/behandling-felles';
import { FadingPanel, VerticalSpacer } from '@fpsak-frontend/shared-components';

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

  const aksjonspunktKode = useMemo(() => {
    const panelMedApentAksjonspunkt = filteredPanels.find((p) => p.isAksjonspunktOpen);
    return panelMedApentAksjonspunkt && panelMedApentAksjonspunkt.aksjonspunkter[0]
      ? finnAksjonspunktHjelpetekstKode(panelMedApentAksjonspunkt.aksjonspunkter[0].definisjon.kode) : undefined;
  }, [filteredPanels]);

  return (
    <FadingPanel>
      {(harApentFaktaAksjonspunkt || aksjonspunktKode) && (
        <>
          <AlertStripe type="advarsel">
            <FormattedMessage id={harApentFaktaAksjonspunkt ? 'MultipleProcessPanel.AvventerAvklaringAv' : aksjonspunktKode} />
          </AlertStripe>
          <VerticalSpacer thirtyTwoPx />
        </>
      )}
      <Row className="">
        <Column xs="6">
          {panels.filter((_p, index) => index < 2)
            .reduce((acc, x) => (acc === null ? <>{x}</> : (
              <>
                {acc}
                <VerticalSpacer thirtyTwoPx />
                {x}
              </>
            )), null)}
        </Column>
        <Column xs="6">
          {panels.filter((_p, index) => index > 1)
            .reduce((acc, x) => (acc === null ? <>{x}</> : (
              <>
                {acc}
                <VerticalSpacer thirtyTwoPx />
                {x}
              </>
            )), null)}
        </Column>
      </Row>
    </FadingPanel>
  );
};

export default MultipleProcessPanel;
