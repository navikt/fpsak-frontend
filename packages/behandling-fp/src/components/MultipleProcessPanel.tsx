import React, { FunctionComponent } from 'react';

import { Kodeverk, DataFetcherBehandlingDataV2, Behandling } from '@fpsak-frontend/behandling-felles';
import { Column, Row } from 'nav-frontend-grid';

interface OwnProps {
  behandling: Behandling;
  alleKodeverk: {[key: string]: Kodeverk[]};
  prosessStegData: any;
  submitCallback: () => void;
}

const MultipleProcessPanel: FunctionComponent<OwnProps> = ({
  behandling,
  alleKodeverk,
  prosessStegData,
  submitCallback,
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
    return panels;
  }

  return (
    <Row className="">
      <Column xs="6">
        {panels.filter((_p, index) => index < 2)}
      </Column>
      <Column xs="6">
        {panels.filter((_p, index) => index > 1)}
      </Column>
    </Row>
  );
};

export default MultipleProcessPanel;
