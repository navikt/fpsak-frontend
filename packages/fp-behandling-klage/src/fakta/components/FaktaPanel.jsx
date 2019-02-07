import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { PersonIndex } from '@fpsak-frontend/fp-felles';
import { getFagsakPerson } from 'behandlingKlage/src/duck';

import styles from './faktaPanel.less';

/**
 * FaktaPanel
 *
 * Presentasjonskomponent. Har ansvar for visningen av de ulike faktapanelene. Dette gjøres
 * ved å gå gjennom aksjonspunktene og en gjør så en mapping mellom aksjonspunktene og panelene.
 */
export const FaktaPanel = ({
  fagsakPerson,
}) => (
  <>
    <div className={styles.personContainer}>
      <PersonIndex medPanel person={fagsakPerson} />
    </div>
  </>
);

FaktaPanel.propTypes = {
  fagsakPerson: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  fagsakPerson: getFagsakPerson(state),
});

export default connect(mapStateToProps)(FaktaPanel);
