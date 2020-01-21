import { expect } from 'chai';

import faktaPanelDefinisjoner from './faktaFpPanelDefinisjoner';

describe('<faktaFpPanelDefinisjoner>', () => {
  it('skal sjekka at alle paneler har nødvendige keys', () => {
    faktaPanelDefinisjoner.forEach((panel) => {
      expect(panel).include.keys('urlCode', 'textCode', 'aksjonspunkterCodes', 'endpoints', 'renderComponent', 'showComponent', 'getData');
    });
  });
});
