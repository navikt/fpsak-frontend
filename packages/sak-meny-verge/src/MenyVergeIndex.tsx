import React, { FunctionComponent, useCallback } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { OkAvbrytModal } from '@fpsak-frontend/shared-components';

import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

export const getMenytekst = (erOpprettVerge: boolean) => intl.formatMessage({
  id: erOpprettVerge ? 'MenyVergeIndex.OpprettVerge' : 'MenyVergeIndex.FjernVerge',
});

interface OwnProps {
  fjernVerge?: () => void;
  opprettVerge?: () => void;
  lukkModal: () => void;
}

const MenyVergeIndex: FunctionComponent<OwnProps> = ({
  fjernVerge,
  opprettVerge,
  lukkModal,
}) => {
  const submit = useCallback(() => {
    lukkModal();
    const operasjon = opprettVerge || fjernVerge;
    return operasjon();
  }, [opprettVerge, fjernVerge]);

  return (
    <RawIntlProvider value={intl}>
      <OkAvbrytModal
        textCode={opprettVerge ? 'MenyVergeIndex.OpprettVergeSporsmal' : 'MenyVergeIndex.FjernVergeSporsmal'}
        showModal
        submit={submit}
        cancel={lukkModal}
      />
    </RawIntlProvider>
  );
};

export default MenyVergeIndex;
