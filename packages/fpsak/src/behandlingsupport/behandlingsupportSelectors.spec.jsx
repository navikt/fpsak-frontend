import { expect } from 'chai';

import kommunikasjonsretning from 'kodeverk/kommunikasjonsretning';
import { getAccessibleSupportPanels, getEnabledSupportPanels, getFilteredReceivedDocuments } from './behandlingsupportSelectors';

describe('behandlingsupportSelectors', () => {
  describe('getAccessibleSupportPanels', () => {
    it('skal kunne aksessere alle support-paneler', () => {
      const returnIsRelevant = true;
      const approvalIsRelevant = true;
      const rettigheter = {
        sendMeldingAccess: {
          employeeHasAccess: true,
        },
        godkjenningsFaneAccess: {
          employeeHasAccess: true,
        },
        fraBeslutterFaneAccess: {
          employeeHasAccess: true,
        },
      };

      const accessiblePanels = getAccessibleSupportPanels.resultFunc(returnIsRelevant, approvalIsRelevant, rettigheter);

      expect(accessiblePanels).is.eql([
        'godkjenning',
        'frabeslutter',
        'historikk',
        'sendmelding',
        'dokumenter',
      ]);
    });

    it('skal kunne aksessere kun supportpanelene som alltid vises; historikk og dokumenter', () => {
      const returnIsRelevant = false;
      const approvalIsRelevant = false;
      const rettigheter = {
        sendMeldingAccess: {
          employeeHasAccess: false,
        },
        godkjenningsFaneAccess: {
          employeeHasAccess: false,
        },
        fraBeslutterFaneAccess: {
          employeeHasAccess: false,
        },
      };

      const accessiblePanels = getAccessibleSupportPanels.resultFunc(returnIsRelevant, approvalIsRelevant, rettigheter);

      expect(accessiblePanels).is.eql([
        'historikk',
        'dokumenter',
      ]);
    });
  });

  describe('getEnabledSupportPanels', () => {
    it('skal vise alle support-panelene som trykkbare', () => {
      const accessibleSupportPanels = [
        'godkjenning',
        'frabeslutter',
        'historikk',
        'sendmelding',
        'dokumenter',
      ];
      const sendMessageIsRelevant = true;
      const rettigheter = {
        sendMeldingAccess: {
          isEnabled: true,
        },
        godkjenningsFaneAccess: {
          isEnabled: true,
        },
        fraBeslutterFaneAccess: {
          isEnabled: true,
        },
      };

      const enabledPanels = getEnabledSupportPanels.resultFunc(accessibleSupportPanels, sendMessageIsRelevant, rettigheter);

      expect(enabledPanels).is.eql(accessibleSupportPanels);
    });

    it('skal kun vise historikk og dokument-panelene som trykkbare', () => {
      const accessibleSupportPanels = [
        'godkjenning',
        'frabeslutter',
        'historikk',
        'sendmelding',
        'dokumenter',
      ];
      const sendMessageIsRelevant = false;
      const rettigheter = {
        sendMeldingAccess: {
          isEnabled: false,
        },
        godkjenningsFaneAccess: {
          isEnabled: false,
        },
        fraBeslutterFaneAccess: {
          isEnabled: false,
        },
      };

      const enabledPanels = getEnabledSupportPanels.resultFunc(accessibleSupportPanels, sendMessageIsRelevant, rettigheter);

      expect(enabledPanels).is.eql([
        'historikk',
        'dokumenter',
      ]);
    });
  });

  describe('getFilteredReceivedDocuments', () => {
    it('skal filtrere ut duplikate dokumenter', () => {
      const documents = [{
        dokumentId: 1,
        kommunikasjonsretning: kommunikasjonsretning.INN,
      }, {
        dokumentId: 2,
        kommunikasjonsretning: kommunikasjonsretning.UT,
      }, {
        dokumentId: 2,
        kommunikasjonsretning: kommunikasjonsretning.UT,
      }];

      const filteredDocuments = getFilteredReceivedDocuments.resultFunc(documents);

      expect(filteredDocuments).is.eql([{
        dokumentId: 1,
        kommunikasjonsretning: kommunikasjonsretning.INN,
      }, {
        dokumentId: 2,
        kommunikasjonsretning: kommunikasjonsretning.UT,
      }]);
    });
  });
});
