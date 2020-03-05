import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { CheckboxField } from '@fpsak-frontend/form';

const isOverridden = (aksjonspunktCodes, aksjonspunktCode) => aksjonspunktCodes.some((code) => code === aksjonspunktCode);

const findLabel = (aksjonspunktCodes, aksjonspunktCode, isBeregningOverstyrer) => {
  const overridden = isOverridden(aksjonspunktCodes, aksjonspunktCode);
  if (isBeregningOverstyrer) {
    return overridden ? 'OverstyrVurderingVelger.OverstyrtBeregning' : 'OverstyrVurderingVelger.OverstyrBeregning';
  }
  return overridden ? 'OverstyrVurderingVelger.OverstyrtAutomatiskVurdering' : 'OverstyrVurderingVelger.OverstyrAutomatiskVurdering';
};

const isHidden = (kanOverstyre, aksjonspunktCodes, aksjonspunktCode) => !isOverridden(aksjonspunktCodes, aksjonspunktCode) && !kanOverstyre;

const isDisabled = (kanOverstyre, aksjonspunktCodes, aksjonspunktCode, isBehandlingReadOnly) => !kanOverstyre
  || isBehandlingReadOnly
  || aksjonspunktCodes.some((code) => code === aksjonspunktCode);

/*
 * OverstyrVurderingVelger
 *
 * Container-komponent. Viser avkryssingsboks for overstyring.
 */
export class OverstyrVurderingVelger extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    const { resetValues, toggleOverstyring: togglePunktOverstyring } = this.props;
    resetValues();
    togglePunktOverstyring();
  }

  render() {
    const {
      kanOverstyreAccess, aksjonspunktCodes, aksjonspunktCode, intl, isBeregningOverstyrer, overrideReadOnly,
    } = this.props;

    if (isHidden(kanOverstyreAccess.isEnabled, aksjonspunktCodes, aksjonspunktCode)) {
      return null;
    }

    return (
      <CheckboxField
        name="isOverstyrt"
        label={intl.formatMessage({ id: findLabel(aksjonspunktCodes, aksjonspunktCode, isBeregningOverstyrer) })}
        disabled={isDisabled(kanOverstyreAccess.isEnabled, aksjonspunktCodes, aksjonspunktCode, overrideReadOnly)}
        onChange={this.onChange}
      />
    );
  }
}

OverstyrVurderingVelger.propTypes = {
  intl: PropTypes.shape().isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
  resetValues: PropTypes.func.isRequired,
  aksjonspunktCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  kanOverstyreAccess: PropTypes.shape({
    isEnabled: PropTypes.bool.isRequired,
  }).isRequired,
  isBeregningOverstyrer: PropTypes.bool,
  toggleOverstyring: PropTypes.func.isRequired,
  overrideReadOnly: PropTypes.bool.isRequired,
};

OverstyrVurderingVelger.defaultProps = {
  isBeregningOverstyrer: false,
};

export default injectIntl(OverstyrVurderingVelger);
