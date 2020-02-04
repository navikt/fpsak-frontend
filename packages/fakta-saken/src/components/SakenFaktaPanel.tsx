import React, { FunctionComponent } from 'react';

import { Aksjonspunkt } from '@fpsak-frontend/types';

import UtlandPanel from './utland/UtlandPanel';

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  aksjonspunkter: Aksjonspunkt[];
  submitCallback: (data: {}) => void;
  readOnly: boolean;
}

const YtelserFaktaPanel: FunctionComponent<OwnProps> = ({
  behandlingId,
  behandlingVersjon,
  aksjonspunkter,
  submitCallback,
  readOnly,
}) => (
  <>
    <UtlandPanel
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      readOnly={readOnly}
    />
  </>
);

export default YtelserFaktaPanel;
