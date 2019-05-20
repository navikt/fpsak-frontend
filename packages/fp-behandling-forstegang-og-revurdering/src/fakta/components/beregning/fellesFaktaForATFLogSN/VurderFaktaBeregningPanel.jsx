import React, { Component } from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import { AksjonspunktHelpText, VerticalSpacer, ElementWrapper } from '@fpsak-frontend/shared-components';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { behandlingForm } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
import { FaktaBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  getAksjonspunkter,
  getBeregningsgrunnlag,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import FaktaForATFLOgSNPanel, {
  transformValuesFaktaForATFLOgSN,
  getBuildInitialValuesFaktaForATFLOgSN, getValidationFaktaForATFLOgSN,
  getHelpTextsFaktaForATFLOgSN,
} from './FaktaForATFLOgSNPanel';
import { erAvklartAktivitetEndret } from '../avklareAktiviteter/AvklareAktiviteterPanel';
import { formNameVurderFaktaBeregning } from '../BeregningFormUtils';

const {
  VURDER_FAKTA_FOR_ATFL_SN,
  AVKLAR_AKTIVITETER,
  OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
} = aksjonspunktCodes;

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

const findAksjonspunktMedBegrunnelse = aksjonspunkter => aksjonspunkter
  .filter(ap => ap.definisjon.kode === VURDER_FAKTA_FOR_ATFL_SN && ap.begrunnelse !== null)[0];

export const BEGRUNNELSE_FAKTA_TILFELLER_NAME = 'begrunnelseFaktaTilfeller';

export const harIkkeEndringerIAvklarMedFlereAksjonspunkter = (verdiForAvklarAktivitetErEndret, aksjonspunkter) => {
  if (hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter) && (hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)
  || hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aksjonspunkter))) {
    return !verdiForAvklarAktivitetErEndret;
  }
  return true;
};

/**
 * VurderFaktaBeregningPanel
 *
 * Container komponent.. Inneholder begrunnelsefelt og komponent som innholder panelene for fakta om beregning tilfeller
 */
export class VurderFaktaBeregningPanelImpl extends Component {
  constructor() {
    super();
    this.state = {
      submitEnabled: false,
    };
  }

  componentDidMount() {
    const { submitEnabled } = this.state;
    if (!submitEnabled) {
      this.setState({
        submitEnabled: true,
      });
    }
  }

  render() {
    const {
      props: {
        verdiForAvklarAktivitetErEndret,
        readOnly,
        isAksjonspunktClosed,
        submittable,
        hasBegrunnelse,
        helpText,
        aksjonspunkter,
        ...formProps
      },
      state: {
        submitEnabled,
      },
    } = this;
    return (
      <ElementWrapper>
        <form onSubmit={formProps.handleSubmit}>
          {hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter) && (
            <AksjonspunktHelpText isAksjonspunktOpen={!isAksjonspunktClosed}>{helpText}</AksjonspunktHelpText>
            )
            }
          <VerticalSpacer twentyPx />
          <FaktaForATFLOgSNPanel
            readOnly={readOnly}
            isAksjonspunktClosed={isAksjonspunktClosed}
          />
          <VerticalSpacer twentyPx />
          {hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter) && (
            <React.Fragment>
              <FaktaBegrunnelseTextField
                name={BEGRUNNELSE_FAKTA_TILFELLER_NAME}
                isDirty={formProps.dirty}
                isSubmittable={submittable}
                isReadOnly={readOnly}
                hasBegrunnelse={hasBegrunnelse}
              />
              <VerticalSpacer twentyPx />
              <FaktaSubmitButton
                formName={formProps.form}
                isSubmittable={submittable && submitEnabled && harIkkeEndringerIAvklarMedFlereAksjonspunkter(verdiForAvklarAktivitetErEndret, aksjonspunkter)}
                isReadOnly={readOnly}
                hasOpenAksjonspunkter={!isAksjonspunktClosed}
              />
            </React.Fragment>
            )
            }
        </form>
      </ElementWrapper>
);
}
}

VurderFaktaBeregningPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  hasBegrunnelse: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  helpText: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  verdiForAvklarAktivitetErEndret: PropTypes.bool.isRequired,
  ...formPropTypes,
};

// /// TRANSFORM VALUES METHODS ///////

export const transformValuesVurderFaktaBeregning = createSelector(
  [getAksjonspunkter, transformValuesFaktaForATFLOgSN],
  (aksjonspunkter, transformFaktaATFL) => (values) => {
    if (hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)) {
      const faktaBeregningValues = values;
      const beg = faktaBeregningValues[BEGRUNNELSE_FAKTA_TILFELLER_NAME];
      return [{
        kode: VURDER_FAKTA_FOR_ATFL_SN,
        begrunnelse: beg === undefined ? null : beg,
        ...transformFaktaATFL(faktaBeregningValues),
      }];
    }
    return {};
  },
);


// /// BUILD INITIAL VALUES METHODS ///////

export const buildInitialValuesVurderFaktaBeregning = createSelector(
  [getAksjonspunkter, getBuildInitialValuesFaktaForATFLOgSN],
  (aksjonspunkter, buildInitialValuesTilfeller) => ({
      ...FaktaBegrunnelseTextField.buildInitialValues(findAksjonspunktMedBegrunnelse(aksjonspunkter), BEGRUNNELSE_FAKTA_TILFELLER_NAME),
      ...buildInitialValuesTilfeller(),
    }),
);

// / VALIDATION METHODS ///

export const getValidationVurderFaktaBeregning = createSelector(
  [getAksjonspunkter, getValidationFaktaForATFLOgSN],
  (aksjonspunkter, validationForVurderFakta) => (values) => {
    if (hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)) {
      return {
        ...validationForVurderFakta(values),
      };
    }
    return null;
  },
);

// // MAP STATE TO PROPS METHODS //////

const mapStateToProps = (state, initialProps) => {
  const alleAp = getAksjonspunkter(state);
  const relevantAp = alleAp.filter(ap => ap.definisjon.kode === VURDER_FAKTA_FOR_ATFL_SN);
  const isAksjonspunktClosed = relevantAp.length === 0 ? false : !isAksjonspunktOpen(relevantAp[0].status.kode);
  const initialValues = buildInitialValuesVurderFaktaBeregning(state);
  const hasBegrunnelse = initialValues
  && !!initialValues[BEGRUNNELSE_FAKTA_TILFELLER_NAME];
  return {
    isAksjonspunktClosed,
    hasBegrunnelse,
    initialValues,
    aksjonspunkter: alleAp,
    beregningsgrunnlag: getBeregningsgrunnlag(state),
    helpText: getHelpTextsFaktaForATFLOgSN(state),
    validate: getValidationVurderFaktaBeregning(state),
    verdiForAvklarAktivitetErEndret: erAvklartAktivitetEndret(state),
    onSubmit: values => initialProps.submitCallback(transformValuesVurderFaktaBeregning(state)(values)),
  };
};

export default connect(mapStateToProps)(behandlingForm({
  form: formNameVurderFaktaBeregning,
})(VurderFaktaBeregningPanelImpl));
