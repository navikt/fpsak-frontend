
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { Undertittel, Element } from 'nav-frontend-typografi';

import { ISO_DATE_FORMAT } from 'utils/formats';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import NyeOgFerdigstilteOppgaverForIdagGraf from './NyeOgFerdigstilteOppgaverForIdagGraf';
import { getNyeOgFerdigstilteOppgaverNokkeltall } from '../../duck';
import { NyeOgFerdigstilteOppgaver } from '../nyeOgFerdigstilteOppgaverTsType';
import nyeOgFerdigstilteOppgaverPropType from '../nyeOgFerdigstilteOppgaverPropType';

interface TsProps {
  width: number;
  height: number;
  nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[];
}

/**
 * NyeOgFerdigstilteOppgaverForIdagPanel.
 */
export const NyeOgFerdigstilteOppgaverForIdagPanel = ({
  width,
  height,
  nyeOgFerdigstilteOppgaver,
}: TsProps) => (
  <div>
    <Undertittel>
      <FormattedMessage id="NyeOgFerdigstilteOppgaverForIdagPanel.NyeOgFerdigstilte" />
    </Undertittel>
    <VerticalSpacer eightPx />
    <Element>
      <FormattedMessage id="NyeOgFerdigstilteOppgaverForIdagPanel.IDag" />
    </Element>
    <NyeOgFerdigstilteOppgaverForIdagGraf
      width={width}
      height={height}
      nyeOgFerdigstilteOppgaver={nyeOgFerdigstilteOppgaver}
    />
  </div>
);

NyeOgFerdigstilteOppgaverForIdagPanel.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  nyeOgFerdigstilteOppgaver: PropTypes.arrayOf(nyeOgFerdigstilteOppgaverPropType).isRequired,
};

export const getNyeOgFerdigstilteForIDag = createSelector([getNyeOgFerdigstilteOppgaverNokkeltall], (nyeOgFerdigstilte = []) => {
  const iDag = moment();
  return nyeOgFerdigstilte.filter(oppgave => iDag.isSame(moment(oppgave.dato, ISO_DATE_FORMAT), 'day'));
});

const mapStateToProps = state => ({
  nyeOgFerdigstilteOppgaver: getNyeOgFerdigstilteForIDag(state),
});

export default connect(mapStateToProps)(NyeOgFerdigstilteOppgaverForIdagPanel);
