import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import { getFagsaker } from 'fagsakSearch/fagsakSearchSelectors';
import { getSelectedFagsak } from 'fagsak/fagsakSelectors';
import PersonInfo from './components/PersonInfo';

/**
 * Container component. Viser grunnleggende personinformasjon. Dette panelet blir
 * vist som del av søkeresultatet, når fagsaken ikke har behandling eller ved papirsøknad
 */
const PersonIndex = ({
  person,
  medPanel,
}) => (person
  ? <PersonInfo person={person} medPanel={medPanel} />
  : null);

PersonIndex.propTypes = {
  person: PropTypes.shape(),
  medPanel: PropTypes.bool,
};

PersonIndex.defaultProps = {
  person: undefined,
  medPanel: false,
};

export const getPersonFromFagsak = createSelector([getFagsaker, getSelectedFagsak], (fagsaker, selectedFagsak) => {
  const fagsak = selectedFagsak || fagsaker[0];
  return fagsak ? fagsak.person : undefined;
});

const mapStateToProps = state => ({
  person: getPersonFromFagsak(state),
});

export default connect(mapStateToProps)(PersonIndex);
