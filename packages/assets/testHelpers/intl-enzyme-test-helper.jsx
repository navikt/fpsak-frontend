/**
 * https://github.com/yahoo/react-intl/wiki/Testing-with-React-Intl
 *
 * Components using the react-intl module require access to the intl context.
 * This is not available when mounting single components in Enzyme.
 * These helper functions aim to address that.
 */

import React from 'react';
import { IntlProvider, intlShape } from 'react-intl';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

// You can pass your messages to the IntlProvider. Optional: remove if unneeded.
export const messages = require('../../../../../i18n/src/main/resources/META-INF/resources/sprak/nb_NO.json');

// Create the IntlProvider to retrieve context for wrapping around.
const intlProvider = new IntlProvider({ locale: 'nb-NO', messages }, {});
const { intl } = intlProvider.getChildContext();

/**
 * When using React-Intl `injectIntl` on components, props.intl is required.
 */
function nodeWithIntlProp(node) {
    return React.cloneElement(node, { intl });
}

export function shallowWithIntl(node, { context } = {}) {
    return shallow(
        nodeWithIntlProp(node),
        {
            context: Object.assign({}, context, {intl}),
        }
    );
}

export function mountWithIntl(node, { context, childContextTypes } = {}) {
    return mount(
        nodeWithIntlProp(node),
        {
            context: Object.assign({}, context, {intl}),
            childContextTypes: Object.assign({}, { intl: intlShape }, childContextTypes)
        }
    );
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
