import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import UtfyllendePersoninfoPanel from './components/UtfyllendePersoninfoPanel';
import GrunnleggendePersoninfoPanel from './components/GrunnleggendePersoninfoPanel';
import personFagsakPersonPropType from './propTypes/personFagsakPersonPropType';
import personPersonopplysningerPropType from './propTypes/personPersonopplysningerPropType';
import personBehandlingPropType from './propTypes/personBehandlingPropType';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const PersonFaktaIndex = ({
  behandling,
  personopplysninger,
  fagsakPerson,
  alleKodeverk,
}) => (
  <RawIntlProvider value={intl}>
    {personopplysninger && (
      <UtfyllendePersoninfoPanel
        sprakkode={behandling.sprakkode}
        personopplysninger={personopplysninger}
        alleKodeverk={alleKodeverk}
      />
    )}
    {!personopplysninger && (
      <GrunnleggendePersoninfoPanel
        person={fagsakPerson}
      />
    )}
  </RawIntlProvider>
);

PersonFaktaIndex.propTypes = {
  behandling: personBehandlingPropType.isRequired,
  personopplysninger: personPersonopplysningerPropType,
  fagsakPerson: personFagsakPersonPropType,
  alleKodeverk: PropTypes.shape().isRequired,
};

PersonFaktaIndex.defaultProps = {
  personopplysninger: undefined,
  fagsakPerson: undefined,
};

export default PersonFaktaIndex;
