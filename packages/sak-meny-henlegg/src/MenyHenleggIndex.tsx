import React, { FunctionComponent, useCallback, useState } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Kodeverk, KodeverkMedNavn } from '@fpsak-frontend/types';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import HenleggBehandlingModal from './components/HenleggBehandlingModal';
import HenlagtBehandlingModal from './components/HenlagtBehandlingModal';

import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const hasHenleggBehandlingEnabledForTilbakekreving = (behandlingType, kanHenlegge) => {
  if ((behandlingType.kode === BehandlingType.TILBAKEKREVING
    || behandlingType.kode === BehandlingType.TILBAKEKREVING_REVURDERING)
    && !kanHenlegge) {
    return false;
  }
  return true;
};

export const skalViseIMeny = (behandlingId, behandlingType, kanHenlegge, henleggBehandlingAccess) => behandlingId
  && henleggBehandlingAccess.employeeHasAccess && henleggBehandlingAccess.isEnabled
  && hasHenleggBehandlingEnabledForTilbakekreving(behandlingType, kanHenlegge);

export const getMenytekst = () => intl.formatMessage({ id: 'MenyHenleggIndex.HenleggBehandling' });

interface OwnProps {
  behandlingId?: number;
  behandlingVersjon?: number;
  henleggBehandling: (params: {
    behandlingVersjon: number;
    behandlingId: number;
    årsakKode: string;
    begrunnelse: string;
  }) => Promise<any>;
  forhandsvisHenleggBehandling: (erTilbakekreving: boolean, erHenleggelse: boolean, data: any) => void;
  ytelseType: Kodeverk;
  behandlingType: Kodeverk;
  behandlingUuid: string;
  behandlingResultatTyper: KodeverkMedNavn[];
  gaaTilSokeside: () => void;
  lukkModal: () => void;
}

const MenyHenleggIndex: FunctionComponent<OwnProps> = ({
  behandlingId,
  behandlingVersjon,
  henleggBehandling,
  forhandsvisHenleggBehandling,
  ytelseType,
  behandlingType,
  behandlingUuid,
  behandlingResultatTyper,
  gaaTilSokeside,
  lukkModal,
}) => {
  const [erHenlagt, setHenlagt] = useState(false);

  const submit = useCallback((formValues) => {
    const henleggBehandlingDto = {
      behandlingVersjon,
      behandlingId,
      årsakKode: formValues.årsakKode,
      begrunnelse: formValues.begrunnelse,
    };
    henleggBehandling(henleggBehandlingDto).then(() => {
      setHenlagt(true);
    });
  }, [behandlingId, behandlingVersjon]);

  return (
    <RawIntlProvider value={intl}>
      {!erHenlagt && (
        <HenleggBehandlingModal
          showModal
          onSubmit={submit}
          cancelEvent={lukkModal}
          previewHenleggBehandling={forhandsvisHenleggBehandling}
          behandlingId={behandlingId}
          ytelseType={ytelseType}
          behandlingType={behandlingType}
          behandlingUuid={behandlingUuid}
          behandlingResultatTyper={behandlingResultatTyper}
        />
      )}
      {erHenlagt && (
        <HenlagtBehandlingModal
          showModal
          closeEvent={gaaTilSokeside}
        />
      )}
    </RawIntlProvider>
  );
};

export default MenyHenleggIndex;
