import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { FaktaBegrunnelseTextField, FaktaSubmitButton } from '@fpsak-frontend/fakta-felles';
import { behandlingForm } from '@fpsak-frontend/form';
import fordelBeregningsgrunnlagAksjonspunkterPropType from '../../propTypes/fordelBeregningsgrunnlagAksjonspunkterPropType';
import beregningsgrunnlagPropType from '../../propTypes/beregningsgrunnlagPropType';
import TidligereUtbetalinger from './TidligereUtbetalinger';
import VurderEndringRefusjonRad, { lagNøkkel } from './VurderEndringRefusjonRad';

const FORM_NAME = 'VURDER_REFUSJON_BERGRUNN_FORM';
const BEGRUNNELSE_FIELD = 'VURDER_REFUSJON_BERGRUNN_BEGRUNNELSE';

const {
  VURDER_REFUSJON_BERGRUNN,
} = aksjonspunktCodes;

const finnAksjonspunkt = (aksjonspunkter) => (aksjonspunkter ? aksjonspunkter.find((ap) => ap.definisjon.kode === VURDER_REFUSJON_BERGRUNN) : undefined);

export const VurderEndringRefusjonFormImpl = ({
  submitEnabled,
  submittable,
  readOnly,
  behandlingId,
  behandlingVersjon,
  beregningsgrunnlag,
  aksjonspunkter,
  ...formProps
}) => {
  const { andeler } = beregningsgrunnlag.refusjonTilVurdering;
  const ap = finnAksjonspunkt(aksjonspunkter);
  const isAksjonspunktClosed = ap ? isAksjonspunktOpen(ap.status.kode) : false;
  return (
    <>
      <form onSubmit={formProps.handleSubmit}>
        <Undertittel><FormattedMessage id="BeregningInfoPanel.RefusjonBG.Tittel" /></Undertittel>
        <VerticalSpacer sixteenPx />
        <TidligereUtbetalinger beregningsgrunnlag={beregningsgrunnlag} />
        { andeler.map((andel) => (
          <VurderEndringRefusjonRad
            refusjonAndel={andel}
            readOnly={readOnly}
            key={andel.arbeidsgiverNavn}
          />
        ))}
        <>
          <VerticalSpacer twentyPx />
          <FaktaBegrunnelseTextField
            name={BEGRUNNELSE_FIELD}
            isDirty={formProps.dirty}
            isSubmittable={submittable}
            isReadOnly={readOnly}
            hasBegrunnelse={!!(ap && ap.begrunnelse)}
          />

          <VerticalSpacer twentyPx />
          <FaktaSubmitButton
            formName={formProps.form}
            isSubmittable={submittable && submitEnabled}
            isReadOnly={readOnly}
            hasOpenAksjonspunkter={!isAksjonspunktClosed}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
          />
        </>
      </form>
    </>
  );
};

export const buildInitialValues = (bg, aksjonspunkter) => {
  const { andeler } = bg.refusjonTilVurdering;
  const initialValues = {};
  andeler.forEach((andel) => {
    initialValues[lagNøkkel(andel)] = VurderEndringRefusjonRad.buildInitialValues(andel);
  });
  const refusjonAP = finnAksjonspunkt(aksjonspunkter);
  initialValues[BEGRUNNELSE_FIELD] = refusjonAP && refusjonAP.begrunnelse ? refusjonAP.begrunnelse : '';
  return initialValues;
};

export const transformValues = (values, bg) => {
  const { andeler } = bg.refusjonTilVurdering;
  const transformedAndeler = andeler.map((andel) => VurderEndringRefusjonRad.transformValues(values, andel));
  return {
    begrunnelse: values[BEGRUNNELSE_FIELD],
    kode: VURDER_REFUSJON_BERGRUNN,
    fastsatteAndeler: transformedAndeler,
  };
};

VurderEndringRefusjonFormImpl.propTypes = {
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  submitEnabled: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  beregningsgrunnlag: beregningsgrunnlagPropType,
  aksjonspunkter: PropTypes.arrayOf(fordelBeregningsgrunnlagAksjonspunkterPropType).isRequired,
  ...formPropTypes,
};

const mapStateToProps = (initialState, initialProps) => {
  const onSubmit = (values) => initialProps.submitCallback([transformValues(values, initialProps.beregningsgrunnlag)]);
  return (state, ownProps) => {
    const initialValues = buildInitialValues(ownProps.beregningsgrunnlag, ownProps.aksjonspunkter);
    return ({
      initialValues,
      onSubmit,
    });
  };
};

export default connect(mapStateToProps)(behandlingForm({
  form: FORM_NAME,
  enableReinitialize: true,
})(VurderEndringRefusjonFormImpl));
