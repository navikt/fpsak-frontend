import { expect } from 'chai';

import { ErrorTypes } from 'app/ErrorTypes';
import { getSearchFagsakerAccessDenied } from './fagsakSearchSelectors';

describe('fagsakSearchSelectors', () => {
  describe('getSearchFagsakerAccessDenied', () => {
    it('skal hente response-data når feilen er at en mangler tilgang', () => {
      const error = {
        response: {
          data: {
            type: ErrorTypes.MANGLER_TILGANG_FEIL,
          },
        },
      };

      const res = getSearchFagsakerAccessDenied.resultFunc(error);

      expect(res).is.eql(error.response.data);
    });

    it('skal ikke hente response-data når feilen er noe annet enn mangler tilgang', () => {
      const error = {
        response: {
          data: {
            type: ErrorTypes.TOMT_RESULTAT_FEIL,
          },
        },
      };

      const res = getSearchFagsakerAccessDenied.resultFunc(error);

      expect(res).is.undefined;
    });
  });
});
