import React from 'react';

import { CustomLanguageProvider } from '@fpsak-frontend/fp-felles';

import messages from '../../../public/sprak/nb_NO';

const withIntlMessages = (story) => (
  <CustomLanguageProvider messages={messages}>
    { story() }
  </CustomLanguageProvider>
);

export default withIntlMessages;
