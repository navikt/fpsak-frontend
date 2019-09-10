import { Header } from '@fpsak-frontend/dekorator';
import { injectIntl } from 'react-intl';
import React from 'react';
import { RETTSKILDE_URL, SYSTEMRUTINE_URL } from '@fpsak-frontend/fp-felles';
import rettskildeneIkonUrl from '@fpsak-frontend/assets/images/rettskildene.svg';
import systemrutineIkonUrl from '@fpsak-frontend/assets/images/rutine.svg';
import PropTypes from 'prop-types';


const Dekorator = ({
  intl, navAnsattName, queryStrings, removeErrorMessage: removeErrorMsg, showDetailedErrorMessages,
}) => {
  const iconLinks = [
    {
      url: RETTSKILDE_URL,
      icon: rettskildeneIkonUrl,
      text: intl.formatMessage({ id: 'Header.Rettskilde' }),
    },
    {
      url: SYSTEMRUTINE_URL,
      icon: systemrutineIkonUrl,
      text: intl.formatMessage({ id: 'Header.Systemrutine' }),
    },
  ];
  return (
    <Header
      systemTittel={intl.formatMessage({ id: 'Header.Foreldrepenger' })}
      iconLinks={iconLinks}
      queryStrings={queryStrings}
      navAnsattName={navAnsattName}
      removeErrorMessage={removeErrorMsg}
      showDetailedErrorMessages={showDetailedErrorMessages}
    />
  );
};

Dekorator.propTypes = {
  intl: PropTypes.shape().isRequired,
  queryStrings: PropTypes.shape().isRequired,
  navAnsattName: PropTypes.string.isRequired,
  removeErrorMessage: PropTypes.func.isRequired,
  showDetailedErrorMessages: PropTypes.bool.isRequired,
};

export default injectIntl(Dekorator);
