import { expect } from 'chai';

import { getAccessibleSupportPanels, getEnabledSupportPanels } from './behandlingsupportSelectors';

describe('behandlingsupportSelectors', () => {
  describe('getAccessibleSupportPanels', () => {
    it('skal kunne aksessere alle support-paneler', () => {
      const returnIsRelevant = true;
      const approvalIsRelevant = true;
      const rettigheter = {
        sendMeldingAccess: {
          isEnabled: true,
          employeeHasAccess: true,
        },
        godkjenningsFaneAccess: {
          isEnabled: true,
          employeeHasAccess: true,
        },
        fraBeslutterFaneAccess: {
          isEnabled: true,
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
          isEnabled: false,
          employeeHasAccess: false,
        },
        godkjenningsFaneAccess: {
          isEnabled: false,
          employeeHasAccess: false,
        },
        fraBeslutterFaneAccess: {
          isEnabled: false,
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
          employeeHasAccess: true,
        },
        godkjenningsFaneAccess: {
          isEnabled: true,
          employeeHasAccess: true,
        },
        fraBeslutterFaneAccess: {
          isEnabled: true,
          employeeHasAccess: true,
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
          employeeHasAccess: false,
        },
        godkjenningsFaneAccess: {
          isEnabled: false,
          employeeHasAccess: false,
        },
        fraBeslutterFaneAccess: {
          isEnabled: false,
          employeeHasAccess: false,
        },
      };

      const enabledPanels = getEnabledSupportPanels.resultFunc(accessibleSupportPanels, sendMessageIsRelevant, rettigheter);

      expect(enabledPanels).is.eql([
        'historikk',
        'dokumenter',
      ]);
    });
  });
});
