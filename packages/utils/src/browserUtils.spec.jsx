import { expect } from 'chai';

import { isEdge, isIE11 } from './browserUtils';

describe('browserUtils', () => {
  describe('isIE11', () => {
    it('Skal returnere false hvis useragent ikke er IE11', () => {
      expect(isIE11()).is.false;
    });

    it('Skal returnere true hvis useragent er IE11', () => {
      Object.defineProperty(window, 'MSInputMethodContext', {
        get() {
          return true;
        },
      });

      Object.defineProperty(document, 'documentMode', {
        get() {
          return true;
        },
      });
      expect(isIE11()).is.true;
    });
  });

  describe('isEdge', () => {
    it('Skal returnere false hvis useragent ikke er Edge', () => {
      expect(isEdge()).is.false;
    });

    it('Skal returnere true hvis useragent er Edge', () => {
      Object.defineProperty(navigator, 'userAgent', {
        get() {
          return '/Edge/';
        },
      });
      expect(isEdge()).is.true;
    });
  });
});
