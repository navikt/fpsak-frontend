import React from 'react';
import PropTypes from 'prop-types';

import FaktaGruppe from 'behandlingFpsak/src/fakta/components/FaktaGruppe';
/**
 * ArbeidsforholdFaktaPanel
 *
 * Presentasjonskomponent.
 */
const ArbeidsforholdFaktaPanel = () => (
  <FaktaGruppe titleCode="ArbeidsforholdFaktaPanel.Faktagruppe">

    <div>Arbeidsforhold...</div>
    <div>Tabell</div>

    <div>DatepickerField</div>

    <div>  CHeckboxes </div>

    <div>Textfelt </div>

    <div>Oppdater Avbryt</div>

  </FaktaGruppe>
);

ArbeidsforholdFaktaPanel.propTypes = {
};

ArbeidsforholdFaktaPanel.defaultProps = {
};

export default ArbeidsforholdFaktaPanel;
