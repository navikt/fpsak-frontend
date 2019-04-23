
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';

import sakslistePropType from 'saksbehandler/behandlingskoer/sakslistePropType';
import { Saksliste } from 'saksbehandler/behandlingskoer/sakslisteTsType';
import { Oppgave } from 'saksbehandler/oppgaveTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import SakslisteVelgerForm from './SakslisteVelgerForm';
import OppgaverTabell from './OppgaverTabell';

import styles from './sakslistePanel.less';

type TsProps = Readonly<{
  sakslister: Saksliste[];
  fetchSakslisteOppgaver: (sakslisteId: number) => void;
  reserverOppgave: (oppgaveId: Oppgave) => void;
  opphevOppgaveReservasjon: (oppgaveId: number, begrunnelse: string) => Promise<string>;
  forlengOppgaveReservasjon: (oppgaveId: number) => Promise<string>;
  flyttReservasjon: (oppgaveId: number, brukerident: string, begrunnelse: string) => Promise<string>;
}>

/**
 * SakslistePanel
 */
const SakslistePanel = ({
  reserverOppgave,
  opphevOppgaveReservasjon,
  forlengOppgaveReservasjon,
  sakslister,
  fetchSakslisteOppgaver,
  flyttReservasjon,
}: TsProps) => (
  <>
    <Undertittel><FormattedMessage id="SakslistePanel.StartBehandling" /></Undertittel>
    <div className={styles.container}>
      <SakslisteVelgerForm
        sakslister={sakslister}
        fetchSakslisteOppgaver={fetchSakslisteOppgaver}
      />
      <VerticalSpacer twentyPx />
      <OppgaverTabell
        reserverOppgave={reserverOppgave}
        opphevOppgaveReservasjon={opphevOppgaveReservasjon}
        forlengOppgaveReservasjon={forlengOppgaveReservasjon}
        flyttReservasjon={flyttReservasjon}
      />
    </div>
  </>
);

SakslistePanel.propTypes = {
  sakslister: PropTypes.arrayOf(sakslistePropType),
  fetchSakslisteOppgaver: PropTypes.func.isRequired,
  reserverOppgave: PropTypes.func.isRequired,
  opphevOppgaveReservasjon: PropTypes.func.isRequired,
  forlengOppgaveReservasjon: PropTypes.func.isRequired,
  flyttReservasjon: PropTypes.func.isRequired,
};

export default SakslistePanel;
