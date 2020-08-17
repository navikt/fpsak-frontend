const sinon = require('sinon');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const exposedProperties = ['window', 'document'];

sinon.stub(console, 'error')
  .callsFake((warning) => {
    if (warning && warning.indexOf
      && (warning.indexOf('Warning: Failed prop type:') > -1 || warning.indexOf('Warning: Each child in an array or iterator should have a unique "key" prop')
        > -1)) {
      throw new Error(warning);
    } else if (warning) {
      console.warn(warning); // NOSONAR Kun testkode
    }
  });

const dom = new JSDOM('<html><body></body></html><div id="app" />', {
  url: 'http://localhost/fpsak',
});

delete dom.window.location;
dom.window.location = { reload: () => undefined };

global.document = dom.window.document;
global.window = document.window;
global.DOMParser = dom.window.DOMParser;
Object.keys(document.defaultView)
  .forEach((property) => {
    if (typeof global[property] === 'undefined') {
      exposedProperties.push(property);
      global[property] = document.defaultView[property];
    }
  });

global.HTMLElement = dom.window.HTMLElement;
global.Date = Date;
// https://github.com/facebookincubator/create-react-app/issues/3199
global.requestAnimationFrame = (cb) => {
  setTimeout(cb, 0);
};

global.cancelAnimationFrame = (cb) => {
  setTimeout(cb, 0);
};
