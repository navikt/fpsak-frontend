import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { OkAvbrytModal, DateLabel, ArrowBox } from '@fpsak-frontend/shared-components';

const intl = createIntl({
  locale: 'nb-NO',
  messages: {
    'OkAvbrytModal.Ok': 'Ok',
    'OkAvbrytModal.Avbryt': 'Avbryt',
    'Test.Test': 'Dette er ein test',
  },
}, createIntlCache());

storiesOf('OkAvbrytModal', module)
  .add('vis modal', () => (
    <RawIntlProvider value={intl}>
      <OkAvbrytModal
        intl={intlMock}
        textCode="Test.Test"
        showModal
        submit={action('button-click')}
        cancel={action('button-click')}
      />
    </RawIntlProvider>
  ));

storiesOf('DateLabel', module)
  .add('vis formatert dato', () => (
    <RawIntlProvider value={intl}>
      <DateLabel
        dateString="2017-10-02"
      />
    </RawIntlProvider>
  ));

storiesOf('ArrowBox', module)
  .add('med pil på toppen', () => (
    <div style={{ width: '200px', marginTop: '20px' }}>
      <ArrowBox>Dette er en tekst</ArrowBox>
    </div>
  ));
