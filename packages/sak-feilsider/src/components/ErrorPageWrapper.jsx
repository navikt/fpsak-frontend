import React from 'react';
import PropTypes from 'prop-types';
import {
  createIntl, createIntlCache, FormattedHTMLMessage, RawIntlProvider,
} from 'react-intl';

import { Innholdstittel } from 'nav-frontend-typografi';
import { pageContainer } from './errorPageWrapper.less';
import messages from '../../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

/**
 * FeilsideContainer
 *
 * Presentasjonskomponent. Denne komponenten vises når den NAV-ansatte prøver å aksessere en url som ikke finnes.
 * Det blir presentert en generell feilmelding og en lenke som tar NAV-ansatt tilbake til hovedsiden.
 */
const ErrorPageWrapper = ({ children, titleCode }) => (
  <RawIntlProvider value={intl}>
    <div className={pageContainer}>
      <Innholdstittel>
        <FormattedHTMLMessage id={titleCode} />
      </Innholdstittel>
      <br />
      {children}
    </div>
  </RawIntlProvider>
);

ErrorPageWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  titleCode: PropTypes.string,
};

ErrorPageWrapper.defaultProps = {
  titleCode: 'GenericErrorPage.Header',
};

export default ErrorPageWrapper;
