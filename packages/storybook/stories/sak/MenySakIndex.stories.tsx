import React, { useState } from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import Modal from 'nav-frontend-modal';

import MenySakIndex, { MenyData } from '@fpsak-frontend/sak-meny';

export default {
  title: 'sak/sak-meny',
  component: MenySakIndex,
  decorators: [withKnobs],
};

export const visMenyMedToHandlinger = () => {
  const [isOpen, setOpen] = useState(true);
  return (
    <MenySakIndex
      data={[
        new MenyData(true, 'Sett behandling på vent')
          .medModal(() => (
            <Modal
              isOpen={isOpen}
              closeButton
              contentLabel="Sett behandling på vent"
              onRequestClose={() => setOpen(false)}
              shouldCloseOnOverlayClick={false}
            >
              Sett behandling på vent
            </Modal>
          )),
        new MenyData(true, 'Lag ny behandling')
          .medModal(() => (
            <Modal
              isOpen={isOpen}
              closeButton
              contentLabel="Sett behandling på vent"
              onRequestClose={() => setOpen(false)}
              shouldCloseOnOverlayClick={false}
            >
              Lag ny behandling
            </Modal>
          )),
      ]}
    />
  );
};
