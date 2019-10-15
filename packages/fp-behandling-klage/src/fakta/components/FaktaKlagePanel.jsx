import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { PersonIndex } from '@fpsak-frontend/person-info';

import { getFagsakPerson } from 'behandlingKlage/src/duckBehandlingKlage';

import styles from './faktaKlagePanel.less';

/**
 * FaktaKlagePanel
 *
 * Presentasjonskomponent. Har ansvar for visningen av de ulike faktapanelene. Dette gjøres
 * ved å gå gjennom aksjonspunktene og en gjør så en mapping mellom aksjonspunktene og panelene.
 */
export const FaktaKlagePanel = ({
  fagsakPerson,
}) => (
  <div className={styles.personContainer}>
    <PersonIndex medPanel person={fagsakPerson} />
  </div>
);

FaktaKlagePanel.propTypes = {
  fagsakPerson: PropTypes.shape().isRequired,
};

const mapStateToProps = (state) => ({
  fagsakPerson: getFagsakPerson(state),
});

export default connect(mapStateToProps)(FaktaKlagePanel);
