
import React from 'react';
import PropTypes from 'prop-types';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import oppgavePropType from '../../oppgavePropType';
import { Oppgave } from '../../oppgaveTsType';
import SistBehandledeSaker from './SistBehandledeSaker';
import SaksbehandlerNokkeltallIndex from '../nokkeltall/SaksbehandlerNokkeltallIndex';

interface TsProps {
  fpsakUrl: string;
  sistBehandledeSaker: Oppgave[];
  valgtSakslisteId?: number;
}

/**
 * SaksstottePaneler
 */
const SaksstottePaneler = ({
  fpsakUrl,
  sistBehandledeSaker,
  valgtSakslisteId,
}: TsProps) => (
  <>
    <SistBehandledeSaker fpsakUrl={fpsakUrl} sistBehandledeSaker={sistBehandledeSaker} />
    <VerticalSpacer twentyPx />
    {valgtSakslisteId
      && <SaksbehandlerNokkeltallIndex valgtSakslisteId={valgtSakslisteId} />
    }
  </>
);

SaksstottePaneler.propTypes = {
  fpsakUrl: PropTypes.string.isRequired,
  sistBehandledeSaker: PropTypes.arrayOf(oppgavePropType).isRequired,
  valgtSakslisteId: PropTypes.number,
};

SaksstottePaneler.defaultProps = {
  valgtSakslisteId: undefined,
};

export default SaksstottePaneler;
