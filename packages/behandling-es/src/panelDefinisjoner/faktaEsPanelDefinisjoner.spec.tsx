import { expect } from 'chai';

import faktaPanelDefinisjoner from './faktaEsPanelDefinisjoner';

describe('<faktaEsPanelDefinisjoner>', () => {
  it('skal sjekka at alle paneler har nødvendige keys', () => {
    faktaPanelDefinisjoner.forEach((panel) => {
      expect(panel).include.keys('urlCode', 'textCode', 'aksjonspunkterCodes', 'endpoints', 'renderComponent', 'showComponent', 'getData');
    });
  });
});
