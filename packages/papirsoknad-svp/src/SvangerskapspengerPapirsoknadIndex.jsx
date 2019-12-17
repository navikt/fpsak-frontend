import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { SoknadData } from '@fpsak-frontend/papirsoknad-felles';

import SvangerskapspengerForm from './components/SvangerskapspengerForm';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const SvangerskapspengerPapirsoknadIndex = ({
  onSubmitUfullstendigsoknad,
  onSubmit,
  readOnly,
  soknadData,
  alleKodeverk,
  fagsakPerson,
}) => (
  <RawIntlProvider value={intl}>
    <SvangerskapspengerForm
      onSubmitUfullstendigsoknad={onSubmitUfullstendigsoknad}
      onSubmit={onSubmit}
      readOnly={readOnly}
      soknadData={soknadData}
      alleKodeverk={alleKodeverk}
      fagsakPerson={fagsakPerson}
    />
  </RawIntlProvider>
);

SvangerskapspengerPapirsoknadIndex.propTypes = {
  onSubmitUfullstendigsoknad: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  soknadData: PropTypes.instanceOf(SoknadData).isRequired,
  alleKodeverk: PropTypes.shape({}).isRequired,
  fagsakPerson: PropTypes.shape({}).isRequired,
};

export default SvangerskapspengerPapirsoknadIndex;
