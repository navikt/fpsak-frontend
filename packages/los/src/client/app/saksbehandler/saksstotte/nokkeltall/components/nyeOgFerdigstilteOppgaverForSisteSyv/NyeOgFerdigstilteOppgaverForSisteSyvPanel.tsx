
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';

import { ISO_DATE_FORMAT } from 'utils/formats';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import NyeOgFerdigstilteOppgaverForSisteSyvGraf from './NyeOgFerdigstilteOppgaverForSisteSyvGraf';
import { getNyeOgFerdigstilteOppgaverNokkeltall } from '../../duck';
import { NyeOgFerdigstilteOppgaver } from '../nyeOgFerdigstilteOppgaverTsType';
import nyeOgFerdigstilteOppgaverPropType from '../nyeOgFerdigstilteOppgaverPropType';

interface TsProps {
  width: number;
  height: number;
  nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[];
}

/**
 * NyeOgFerdigstilteOppgaverForSisteSyvPanel.
 */
export const NyeOgFerdigstilteOppgaverForSisteSyvPanel = ({
  width,
  height,
  nyeOgFerdigstilteOppgaver,
}: TsProps) => (
  <div>
    <VerticalSpacer eightPx />
    <Element>
      <FormattedMessage id="NyeOgFerdigstilteOppgaverForSisteSyvPanel.SisteSyv" />
    </Element>
    <NyeOgFerdigstilteOppgaverForSisteSyvGraf
      width={width}
      height={height}
      nyeOgFerdigstilteOppgaver={nyeOgFerdigstilteOppgaver}
    />
  </div>
);

NyeOgFerdigstilteOppgaverForSisteSyvPanel.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  nyeOgFerdigstilteOppgaver: PropTypes.arrayOf(nyeOgFerdigstilteOppgaverPropType).isRequired,
};

export const getNyeOgFerdigstilteForSisteSyvDager = createSelector([getNyeOgFerdigstilteOppgaverNokkeltall], (nyeOgFerdigstilte = []) => {
  const iDag = moment().startOf('day');
  return nyeOgFerdigstilte.filter(oppgave => iDag.isAfter(moment(oppgave.dato, ISO_DATE_FORMAT)));
});

const mapStateToProps = state => ({
  nyeOgFerdigstilteOppgaver: getNyeOgFerdigstilteForSisteSyvDager(state),
});

export default connect(mapStateToProps)(NyeOgFerdigstilteOppgaverForSisteSyvPanel);
