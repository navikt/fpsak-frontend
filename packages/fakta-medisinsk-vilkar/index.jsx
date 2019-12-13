import React from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import medisinskVilkarSkisse from '@fpsak-frontend/assets/images/MedisinskVilkar.png';

const MedisinskVilkarFaktaIndex = () => (
  <Ekspanderbartpanel tittel="Fakta om medisinsk vilkår" style={{ marginTop: '8px' }}>
    <img src={medisinskVilkarSkisse} alt="Skisse" style={{ maxWidth: '850px' }} />
  </Ekspanderbartpanel>
);

export default MedisinskVilkarFaktaIndex;
