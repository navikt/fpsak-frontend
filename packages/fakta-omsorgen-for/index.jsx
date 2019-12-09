import React from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import omsorgenForSkisse from '@fpsak-frontend/assets/images/omsorgenfor.png';

const OmsorgenForFaktaIndex = () => (
  <Ekspanderbartpanel tittel="Fakta om alder og omsorg" style={{ marginTop: '8px' }}>
    <img src={omsorgenForSkisse} alt="Skisse" style={{ maxWidth: '850px' }} />
  </Ekspanderbartpanel>
);

export default OmsorgenForFaktaIndex;
