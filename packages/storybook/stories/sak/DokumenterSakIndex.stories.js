import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs';

import DokumenterSakIndex from '@fpsak-frontend/sak-dokumenter';
import kommunikasjonsretning from '@fpsak-frontend/kodeverk/src/kommunikasjonsretning';

import withReduxProvider from '../../decorators/withRedux';

const behandlingId = 1;

const dokumenter = [{
  journalpostId: '1',
  dokumentId: '1',
  behandlinger: [behandlingId],
  tittel: 'Dette er et dokument',
  tidspunkt: '2017-08-02T00:54:25.455',
  kommunikasjonsretning: kommunikasjonsretning.INN,
  gjelderFor: 'test',
}, {
  journalpostId: '2',
  dokumentId: '2',
  behandlinger: [],
  tittel: 'Dette er et nytt dokument',
  tidspunkt: '2017-02-02T01:54:25.455',
  kommunikasjonsretning: kommunikasjonsretning.UT,
  gjelderFor: 'test',
}, {
  journalpostId: '3',
  dokumentId: '3',
  behandlinger: [],
  tittel: 'Dette er et tredje dokument',
  tidspunkt: '2017-01-02T10:54:25.455',
  kommunikasjonsretning: kommunikasjonsretning.NOTAT,
  gjelderFor: 'Dette er en lang tekst som skal kuttes',
}];

export default {
  title: 'sak/DokumenterSakIndex',
  component: DokumenterSakIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visMeldingerPanel = () => (
  <div style={{
    width: '700px', margin: '50px', padding: '20px', backgroundColor: 'white',
  }}
  >
    <DokumenterSakIndex
      documents={object('documents', dokumenter)}
      selectDocumentCallback={action('button-click')}
      behandlingId={behandlingId}
    />
  </div>
);
