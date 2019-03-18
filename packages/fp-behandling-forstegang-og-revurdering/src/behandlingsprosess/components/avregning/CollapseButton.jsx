import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import styles from './collapseButton.less';

const buttonText = showDetails => (showDetails ? 'Avregning.headerText.VisFærreDetaljer' : 'Avregning.headerText.VisFlereDetaljer');

const CollapseButton = ({ toggleDetails, showDetails, mottakerIndex }) => (
  <button type="button" className={styles.invisibleButton} onClick={() => toggleDetails(mottakerIndex)}>
    <FormattedMessage id={buttonText(showDetails)} />
    {showDetails ? <OppChevron /> : <NedChevron />}
  </button>
);

CollapseButton.propTypes = {
  toggleDetails: PropTypes.func.isRequired,
  showDetails: PropTypes.bool.isRequired,
  mottakerIndex: PropTypes.number.isRequired,
};

export default CollapseButton;
