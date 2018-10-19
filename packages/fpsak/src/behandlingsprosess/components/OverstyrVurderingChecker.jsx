import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl, intlShape } from 'react-intl';

import { toggleBehandlingspunktOverstyring } from 'behandlingsprosess/duck';
import { getSelectedBehandlingspunkt, getSelectedBehandlingspunktAksjonspunkter, isSelectedBehandlingspunktOverrideReadOnly }
  from 'behandlingsprosess/behandlingsprosessSelectors';
import { getRettigheter } from 'navAnsatt/duck';
import CheckboxField from 'form/fields/CheckboxField';
import aksjonspunktPropType from 'behandling/proptypes/aksjonspunktPropType';

const isOverridden = (aksjonspunkter, aksjonspunktCode) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

const findLabel = (aksjonspunkter, aksjonspunktCode, isBeregningOverstyrer) => {
  const overridden = isOverridden(aksjonspunkter, aksjonspunktCode);
  if (isBeregningOverstyrer) {
    return overridden ? 'OverstyrVurderingChecker.OverstyrtBeregning' : 'OverstyrVurderingChecker.OverstyrBeregning';
  }
  return overridden ? 'OverstyrVurderingChecker.OverstyrtAutomatiskVurdering' : 'OverstyrVurderingChecker.OverstyrAutomatiskVurdering';
};

const isHidden = (kanOverstyre, aksjonspunkter, aksjonspunktCode) => !isOverridden(aksjonspunkter, aksjonspunktCode) && !kanOverstyre;

const isDisabled = (kanOverstyre, aksjonspunkter, aksjonspunktCode, isBehandlingReadOnly) => !kanOverstyre
  || isBehandlingReadOnly
  || aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

/*
 * OverstyrVurderingChecker
 *
 * Container-komponent. Viser avkryssingsboks for overstyring.
 */
export class OverstyrVurderingChecker extends Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    const { resetValues, toggleBehandlingspunktOverstyring: toggleOverstyring, selectedBehandlingspunkt } = this.props;
    resetValues();
    toggleOverstyring(selectedBehandlingspunkt);
  }

  render() {
    const {
      kanOverstyreAccess, aksjonspunkter, aksjonspunktCode, intl, isBeregningOverstyrer, isBehandlingReadOnly,
    } = this.props;

    if (isHidden(kanOverstyreAccess.isEnabled, aksjonspunkter, aksjonspunktCode)) {
      return null;
    }

    return (
      <CheckboxField
        name="isOverstyrt"
        label={intl.formatMessage({ id: findLabel(aksjonspunkter, aksjonspunktCode, isBeregningOverstyrer) })}
        disabled={isDisabled(kanOverstyreAccess.isEnabled, aksjonspunkter, aksjonspunktCode, isBehandlingReadOnly)}
        onChange={this.onChange}
      />
    );
  }
}

OverstyrVurderingChecker.propTypes = {
  intl: intlShape.isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
  resetValues: PropTypes.func.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  selectedBehandlingspunkt: PropTypes.string.isRequired,
  kanOverstyreAccess: PropTypes.shape().isRequired,
  isBeregningOverstyrer: PropTypes.bool,
  toggleBehandlingspunktOverstyring: PropTypes.func.isRequired,
  isBehandlingReadOnly: PropTypes.bool.isRequired,
};

OverstyrVurderingChecker.defaultProps = {
  isBeregningOverstyrer: false,
};

const mapStateToProps = state => ({
  aksjonspunkter: getSelectedBehandlingspunktAksjonspunkter(state),
  selectedBehandlingspunkt: getSelectedBehandlingspunkt(state),
  isBehandlingReadOnly: isSelectedBehandlingspunktOverrideReadOnly(state),
  kanOverstyreAccess: getRettigheter(state).kanOverstyreAccess,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    toggleBehandlingspunktOverstyring,
  }, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(OverstyrVurderingChecker));
