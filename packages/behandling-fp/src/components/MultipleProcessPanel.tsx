import React, { FunctionComponent } from 'react';

import { Kodeverk, DataFetcherBehandlingDataV2, Behandling } from '@fpsak-frontend/behandling-felles';

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
  const panels = prosessStegData.map((stegData) => (
    <div>
      {stegData.renderComponent && (
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
      )}
    </div>
  ));

  return panels;
};

export default MultipleProcessPanel;
