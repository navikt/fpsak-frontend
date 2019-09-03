/**
 * https://github.com/yahoo/react-intl/wiki/Testing-with-React-Intl
 *
 * Components using the react-intl module require access to the intl context.
 * This is not available when mounting single components in Enzyme.
 * These helper functions aim to address that.
 */

import React from 'react';
import { createIntl, createIntlCache, IntlProvider } from 'react-intl';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
// You can pass your messages to the IntlProvider. Optional: remove if unneeded.
import messages from '../../../public/sprak/nb_NO.json';

export { default as messages } from '../../../public/sprak/nb_NO.json';

// Create the IntlProvider to retrieve context for wrapping around.
const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  defaultLocale: 'nb-NO',
  messages,
}, cache);

/**
 * When using React-Intl `injectIntl` on components, props.intl is required.
 */
function nodeWithIntlProp(node) {
  return React.cloneElement(node, { intl });
}

export function shallowWithIntl(node) {
  return shallow(nodeWithIntlProp(node), {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: {
      locale: 'nb-NO',
      defaultLocale: 'nb-NO',
      messages,
    },
  });
}

export function mountWithIntl(node) {
  return mount(nodeWithIntlProp(node), {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: {
      locale: 'nb-NO',
      defaultLocale: 'nb-NO',
      messages,
    },
  });
}

/* Lagt til for a hindre warnings i tester */
export const intlMock = {
  formatDate: sinon.spy(),
  formatTime: sinon.spy(),
  formatRelative: sinon.spy(),
  formatNumber: sinon.spy(),
  formatPlural: sinon.spy(),
  formatMessage: sinon.spy(),
  formatHTMLMessage: sinon.spy(),
  now: sinon.spy(),
};
