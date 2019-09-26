import React from 'react';

import { ArrowBox } from '@fpsak-frontend/shared-components';

export default {
  title: 'sharedComponents/ArrowBox',
  component: ArrowBox,
};

export const medPilPåToppen = () => (
  <div style={{ width: '200px', marginTop: '20px' }}>
    <ArrowBox>Dette er en tekst</ArrowBox>
  </div>
);
