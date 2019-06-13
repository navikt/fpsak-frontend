import React, { Component } from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import { AksjonspunktHelpText, VerticalSpacer, ElementWrapper } from '@fpsak-frontend/shared-components';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { behandlingForm } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
import { FaktaBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
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
import { erOverstyringAvBeregningsgrunnlagSelector } from './BgFordelingUtils';

const {
  VURDER_FAKTA_FOR_ATFL_SN,
  AVKLAR_AKTIVITETER,
  OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
  OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
} = aksjonspunktCodes;

const findAksjonspunktMedBegrunnelse = (aksjonspunkter) => {
  if (aksjonspunkter.some(ap => ap.definisjon.kode === OVERSTYRING_AV_BEREGNINGSGRUNNLAG)) {
    return aksjonspunkter
    .find(ap => ap.definisjon.kode === OVERSTYRING_AV_BEREGNINGSGRUNNLAG && ap.begrunnelse !== null);
  }
  return aksjonspunkter
  .find(ap => ap.definisjon.kode === VURDER_FAKTA_FOR_ATFL_SN && ap.begrunnelse !== null);
};

export const BEGRUNNELSE_FAKTA_TILFELLER_NAME = 'begrunnelseFaktaTilfeller';

export const harIkkeEndringerIAvklarMedFlereAksjonspunkter = (verdiForAvklarAktivitetErEndret, aksjonspunkter) => {
  if ((hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter) || hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSGRUNNLAG, aksjonspunkter))) {
    return !verdiForAvklarAktivitetErEndret;
  }
  return true;
};

const hasOpenAksjonspunkt = (kode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === kode && isAksjonspunktOpen(ap.status.kode));

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
        erOverstyrt,
        ...formProps
      },
      state: {
        submitEnabled,
      },
    } = this;
    return (
      <ElementWrapper>
        {!(hasOpenAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter) || hasOpenAksjonspunkt(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aksjonspunkter)) && (
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
          {(hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter) || erOverstyrt) && (
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
        )}
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
  erOverstyrt: PropTypes.bool.isRequired,
  kanOverstyre: PropTypes.bool.isRequired,
  ...formPropTypes,
};


export const transformValuesVurderFaktaBeregning = createSelector(
  [getAksjonspunkter, transformValuesFaktaForATFLOgSN, erOverstyringAvBeregningsgrunnlagSelector],
  (aksjonspunkter, transformFaktaATFL, erOverstyrt) => (values) => {
    if (hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter) || erOverstyrt) {
      const faktaBeregningValues = values;
      const beg = faktaBeregningValues[BEGRUNNELSE_FAKTA_TILFELLER_NAME];
      return [{
        kode: erOverstyrt ? OVERSTYRING_AV_BEREGNINGSGRUNNLAG : VURDER_FAKTA_FOR_ATFL_SN,
        begrunnelse: beg === undefined ? null : beg,
        ...transformFaktaATFL(faktaBeregningValues, erOverstyrt),
      }];
    }
    return {};
  },
);


export const buildInitialValuesVurderFaktaBeregning = createSelector(
  [getAksjonspunkter, getBuildInitialValuesFaktaForATFLOgSN],
  (aksjonspunkter, buildInitialValuesTilfeller) => ({
      ...FaktaBegrunnelseTextField.buildInitialValues(findAksjonspunktMedBegrunnelse(aksjonspunkter), BEGRUNNELSE_FAKTA_TILFELLER_NAME),
      ...buildInitialValuesTilfeller(),
    }),
);


export const getValidationVurderFaktaBeregning = createSelector(
  [getAksjonspunkter, getValidationFaktaForATFLOgSN],
  (aksjonspunkter, validationForVurderFakta) => (values) => {
    if (hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter) && values) {
      return {
        ...validationForVurderFakta(values),
      };
    }
    return null;
  },
);

const mapStateToProps = (state, initialProps) => {
  const alleAp = getAksjonspunkter(state);
  const relevantAp = alleAp.filter(ap => ap.definisjon.kode === VURDER_FAKTA_FOR_ATFL_SN || ap.definisjon.kode === OVERSTYRING_AV_BEREGNINGSGRUNNLAG);
  const isAksjonspunktClosed = relevantAp.length === 0 ? false : relevantAp.some(ap => !isAksjonspunktOpen(ap.status.kode));
  const initialValues = buildInitialValuesVurderFaktaBeregning(state);
  const hasBegrunnelse = initialValues
  && !!initialValues[BEGRUNNELSE_FAKTA_TILFELLER_NAME];
  return {
    isAksjonspunktClosed,
    hasBegrunnelse,
    initialValues,
    aksjonspunkter: alleAp,
    beregningsgrunnlag: getBeregningsgrunnlag(state),
    erOverstyrt: erOverstyringAvBeregningsgrunnlagSelector(state),
    helpText: getHelpTextsFaktaForATFLOgSN(state),
    validate: getValidationVurderFaktaBeregning(state),
    verdiForAvklarAktivitetErEndret: erAvklartAktivitetEndret(state),
    onSubmit: values => initialProps.submitCallback(transformValuesVurderFaktaBeregning(state)(values)),
  };
};

export default connect(mapStateToProps)(behandlingForm({
  form: formNameVurderFaktaBeregning,
})(VurderFaktaBeregningPanelImpl));
