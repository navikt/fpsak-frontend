import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  createIntl, createIntlCache, IntlProvider, RawIntlProvider,
} from 'react-intl';

const NO_CODE = 'nb-NO';

const StateContext = createContext();

const CustomLanguageProvider = ({
  messages,
  children,
}) => {
  const oldMessages = useContext(StateContext);
  if (oldMessages) {
    const newMessages = { ...oldMessages, ...messages };
    const intl = createIntl({
      locale: NO_CODE,
      messages: newMessages,
    }, createIntlCache());
    // TODO (TOR) kanskje createIntlCache() bør ligga utanfor komponent?

    return (
      <RawIntlProvider value={intl}>
        <StateContext.Provider value={newMessages}>
          {children}
        </StateContext.Provider>
      </RawIntlProvider>
    );
  }

  return (
    <IntlProvider locale={NO_CODE} messages={messages}>
      <StateContext.Provider value={messages}>
        {children}
      </StateContext.Provider>
    </IntlProvider>
  );
};

CustomLanguageProvider.propTypes = {
  messages: PropTypes.shape().isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default CustomLanguageProvider;
