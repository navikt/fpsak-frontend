import React, { useMemo } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import HeaderWithErrorPanel from '@fpsak-frontend/sak-dekorator';
import { RETTSKILDE_URL, SYSTEMRUTINE_URL } from '@fpsak-frontend/fp-felles';
import rettskildeneIkonUrl from '@fpsak-frontend/assets/images/rettskildene.svg';
import systemrutineIkonUrl from '@fpsak-frontend/assets/images/rutine.svg';
import { decodeHtmlEntity } from '@fpsak-frontend/utils';

const lagFeilmeldinger = (intl, errorMessages, queryStrings) => {
  const resolvedErrorMessages = [];
  if (queryStrings.errorcode) {
    resolvedErrorMessages.push({ message: intl.formatMessage({ id: queryStrings.errorcode }) });
  }
  if (queryStrings.errormessage) {
    resolvedErrorMessages.push({ message: queryStrings.errormessage });
  }
  errorMessages.forEach((message) => {
    let msg = { message: (message.code ? intl.formatMessage({ id: message.code }, message.params) : message.text) };
    if (message.params && message.params.errorDetails) {
      msg = {
        ...msg,
        additionalInfo: JSON.parse(decodeHtmlEntity(message.params.errorDetails)),
      };
    }
    resolvedErrorMessages.push(msg);
  });
  return resolvedErrorMessages;
};

const Dekorator = ({
  intl,
  errorMessages,
  navAnsattName,
  queryStrings,
  setSiteHeight,
  removeErrorMessage: removeErrorMsg,
  showDetailedErrorMessages, hideErrorMessages,
}) => {
  const resolvedErrorMessages = useMemo(() => lagFeilmeldinger(intl, errorMessages, queryStrings), [errorMessages, queryStrings]);

  const iconLinks = useMemo(() => [{
    url: RETTSKILDE_URL,
    icon: rettskildeneIkonUrl,
    text: intl.formatMessage({ id: 'Header.Rettskilde' }),
  }, {
    url: SYSTEMRUTINE_URL,
    icon: systemrutineIkonUrl,
    text: intl.formatMessage({ id: 'Header.Systemrutine' }),
  }], []);

  return (
    <HeaderWithErrorPanel
      systemTittel={intl.formatMessage({ id: 'Header.Foreldrepenger' })}
      iconLinks={iconLinks}
      queryStrings={queryStrings}
      navAnsattName={navAnsattName}
      removeErrorMessage={removeErrorMsg}
      showDetailedErrorMessages={showDetailedErrorMessages}
      errorMessages={hideErrorMessages ? [] : resolvedErrorMessages}
      setSiteHeight={setSiteHeight}
    />
  );
};

Dekorator.propTypes = {
  intl: PropTypes.shape().isRequired,
  queryStrings: PropTypes.shape().isRequired,
  navAnsattName: PropTypes.string.isRequired,
  removeErrorMessage: PropTypes.func.isRequired,
  showDetailedErrorMessages: PropTypes.bool,
  hideErrorMessages: PropTypes.bool,
  errorMessages: PropTypes.arrayOf(PropTypes.shape()),
  setSiteHeight: PropTypes.func.isRequired,
};

Dekorator.defaultProps = {
  hideErrorMessages: false,
  showDetailedErrorMessages: false,
  errorMessages: [],
};

export default injectIntl(Dekorator);
