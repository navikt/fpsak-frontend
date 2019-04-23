
import React, { Component } from 'react';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import NyeOgFerdigstilteOppgaverForIdagPanel from './nyeOgFerdigstilteOppgaverForIdag/NyeOgFerdigstilteOppgaverForIdagPanel';
import NyeOgFerdigstilteOppgaverForSisteSyvPanel from './nyeOgFerdigstilteOppgaverForSisteSyv/NyeOgFerdigstilteOppgaverForSisteSyvPanel';

interface StateTsProps {
  width: number;
  height: number;
}

/**
 * SaksbehandlerNokkeltallPanel.
 */
class SaksbehandlerNokkeltallPanel extends Component<{}, StateTsProps> {
  constructor(props: {}) {
    super(props);

    this.state = {
      width: 0,
      height: 200,
    };
  }

  componentDidMount = () => {
    this.oppdaterGrafStorrelse();
    window.addEventListener('resize', this.oppdaterGrafStorrelse);
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.oppdaterGrafStorrelse);
  }

  oppdaterGrafStorrelse = () => {
    if (this.node) {
      const rect = this.node.getBoundingClientRect();
      this.setState({ width: rect.width });
    }
  }

  node: any

  render = () => {
    const {
      width, height,
    } = this.state;

    return (
      <div ref={(node) => { this.node = node; }}>
        <NyeOgFerdigstilteOppgaverForIdagPanel
          width={width}
          height={height}
        />
        <VerticalSpacer sixteenPx />
        <NyeOgFerdigstilteOppgaverForSisteSyvPanel
          width={width}
          height={height}
        />
      </div>
    );
  }
}

export default SaksbehandlerNokkeltallPanel;
