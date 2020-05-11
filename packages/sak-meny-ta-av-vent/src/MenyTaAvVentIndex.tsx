import React, { FunctionComponent, useCallback } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { OkAvbrytModal } from '@fpsak-frontend/shared-components';

import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

export const skalViseIMeny = (behandlingId, erPaVent, erKoet, gjenopptaBehandlingAccess) => {
  if (!behandlingId || erKoet || !gjenopptaBehandlingAccess.employeeHasAccess) {
    return false;
  }
  return erPaVent;
};

export const getMenytekst = () => intl.formatMessage({ id: 'MenyTaAvVentIndex.ResumeBehandling' });

interface OwnProps {
  behandlingId?: number;
  behandlingVersjon?: number;
  taBehandlingAvVent: (params: {
    behandlingId: number;
    behandlingVersjon: number;
  }) => void;
  lukkModal: () => void;
}

const MenyTaAvVentIndex: FunctionComponent<OwnProps> = ({
  behandlingId,
  behandlingVersjon,
  taBehandlingAvVent,
  lukkModal,
}) => {
  const submit = useCallback(() => {
    taBehandlingAvVent({
      behandlingId,
      behandlingVersjon,
    });

    lukkModal();
  }, [behandlingId, behandlingVersjon]);

  return (
    <RawIntlProvider value={intl}>
      <OkAvbrytModal
        textCode="MenyTaAvVentIndex.TaAvVent"
        showModal
        submit={submit}
        cancel={lukkModal}
      />
    </RawIntlProvider>
  );
};

export default MenyTaAvVentIndex;
