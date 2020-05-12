import React, { FunctionComponent, useCallback } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { KodeverkMedNavn } from '@fpsak-frontend/types';

import SettBehandlingPaVentModal from './components/SettBehandlingPaVentModal';

import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

export const skalViseIMeny = (behandlingId, erPaVent, erKoet, settBehandlingPaVentAccess) => !!behandlingId
  && !erPaVent && !erKoet && settBehandlingPaVentAccess.employeeHasAccess && settBehandlingPaVentAccess.isEnabled;

export const getMenytekst = () => intl.formatMessage({ id: 'MenySettPaVentIndex.BehandlingOnHold' });

interface OwnProps {
  behandlingId?: number;
  behandlingVersjon?: number;
  settBehandlingPaVent: (params: {
    behandlingVersjon: number;
    behandlingId: number;
    frist: string;
    ventearsak: string;
  }) => void;
  ventearsaker: KodeverkMedNavn[];
  lukkModal: () => void;
}

const MenySettPaVentIndex: FunctionComponent<OwnProps> = ({
  behandlingId,
  behandlingVersjon,
  settBehandlingPaVent,
  ventearsaker,
  lukkModal,
}) => {
  const submit = useCallback((formValues) => {
    const values = {
      behandlingVersjon,
      behandlingId,
      frist: formValues.frist,
      ventearsak: formValues.ventearsak,
    };
    settBehandlingPaVent(values);

    lukkModal();
  }, [behandlingId, behandlingVersjon]);

  return (
    <RawIntlProvider value={intl}>
      <SettBehandlingPaVentModal
        showModal
        onSubmit={submit}
        cancelEvent={lukkModal}
        ventearsaker={ventearsaker}
      />
    </RawIntlProvider>
  );
};

export default MenySettPaVentIndex;
