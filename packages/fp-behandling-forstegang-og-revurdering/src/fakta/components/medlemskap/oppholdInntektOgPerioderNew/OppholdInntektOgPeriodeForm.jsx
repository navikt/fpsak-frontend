import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import {
  BorderBox, FlexColumn, FlexContainer, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';

import {
  behandlingFormForstegangOgRevurdering,
  behandlingFormValueSelector,
} from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import { getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import OppholdINorgeOgAdresserFaktaPanel from './OppholdINorgeOgAdresserFaktaPanel';
import InntektOgYtelserFaktaPanel from './InntektOgYtelserFaktaPanel';
import PerioderMedMedlemskapFaktaPanel from './PerioderMedMedlemskapFaktaPanel';
import StatusForBorgerFaktaPanel from './StatusForBorgerFaktaPanel';
import FortsattMedlemskapFaktaPanel from './FortsattMedlemskapFaktaPanel';

const {
  AVKLAR_OPPHOLDSRETT, AVKLAR_LOVLIG_OPPHOLD,
} = aksjonspunktCodes;

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some((ap) => ap === aksjonspunktCode);


export const OppholdInntektOgPeriodeForm = ({
  valgtPeriode,
  readOnly,
  initialValues,
  submittable,
  periodeResetCallback,
  ...formProps
}) => (
  <BorderBox>
    <OppholdINorgeOgAdresserFaktaPanel readOnly={readOnly} id={valgtPeriode.id} />
    <VerticalSpacer twentyPx />
    <InntektOgYtelserFaktaPanel id={valgtPeriode.id} />
    <PerioderMedMedlemskapFaktaPanel readOnly={readOnly} id={valgtPeriode.id} />
    { (hasAksjonspunkt(AVKLAR_OPPHOLDSRETT, valgtPeriode.aksjonspunkter) || hasAksjonspunkt(AVKLAR_LOVLIG_OPPHOLD, valgtPeriode.aksjonspunkter))
    && <StatusForBorgerFaktaPanel readOnly={readOnly} id={valgtPeriode.id} />}
    <VerticalSpacer twentyPx />
    { valgtPeriode.aksjonspunkter && valgtPeriode.aksjonspunkter.length > 0
    && (
      <FaktaBegrunnelseTextField
        id={valgtPeriode.id}
        isDirty={formProps.dirty}
        isReadOnly={readOnly}
        isSubmittable={submittable}
        hasBegrunnelse={!!initialValues.begrunnelse}
      />
    )}

    <VerticalSpacer twentyPx />
    <FlexContainer fluid>
      <FlexRow>
        <FlexColumn>
          <Hovedknapp
            mini
            htmlType="button"
            onClick={formProps.handleSubmit}
            disabled={formProps.pristine}
          >
            <FormattedMessage id="OppholdInntektOgPeriode.Oppdater" />
          </Hovedknapp>
        </FlexColumn>
        <FlexColumn>
          <Knapp
            htmlType="button"
            mini
            onClick={periodeResetCallback}
          >
            <FormattedMessage id="OppholdInntektOgPeriode.Avbryt" />
          </Knapp>
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  </BorderBox>
);

OppholdInntektOgPeriodeForm.propTypes = {
  selectedId: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
  updateOppholdInntektPeriode: PropTypes.func.isRequired,
  submittable: PropTypes.bool.isRequired,
  valgtPeriode: PropTypes.shape().isRequired,
  initialValues: PropTypes.shape().isRequired,
  periodeResetCallback: PropTypes.func.isRequired,
};

OppholdInntektOgPeriodeForm.defaultProps = {
  selectedId: undefined,
};

const transformValues = (values) => ({
  begrunnelse: values.begrunnelse,
  ...values,
});

const buildInitialValues = createSelector([
  (state, ownProps) => ownProps.valgtPeriode,
  (state, ownProps) => ownProps.aksjonspunkter,
  (state) => behandlingFormValueSelector('OppholdInntektOgPerioderForm')(state, 'soknad'),
  (state) => behandlingFormValueSelector('OppholdInntektOgPerioderForm')(state, 'person'),
  (state) => behandlingFormValueSelector('OppholdInntektOgPerioderForm')(state, 'inntekter'),
  (state) => behandlingFormValueSelector('OppholdInntektOgPerioderForm')(state, 'medlemskapPerioder'),
  (state) => behandlingFormValueSelector('OppholdInntektOgPerioderForm')(state, 'gjeldendeFom'),
  getAlleKodeverk,
],
(valgtPeriode, alleAksjonspunkter, soknad, person, inntekter, medlemskapPerioder, gjeldendeFom, alleKodeverk) => {
  const aksjonspunkter = alleAksjonspunkter
    .filter((ap) => valgtPeriode.aksjonspunkter.includes(ap.definisjon.kode) || ap.definisjon.kode === aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP)
    .filter((ap) => ap.definisjon.kode !== aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN);
  let oppholdValues = {};
  let confirmValues = {};
  if (hasAksjonspunkt(AVKLAR_OPPHOLDSRETT, valgtPeriode.aksjonspunkter) || hasAksjonspunkt(AVKLAR_LOVLIG_OPPHOLD, valgtPeriode.aksjonspunkter)) {
    oppholdValues = StatusForBorgerFaktaPanel.buildInitialValues(valgtPeriode, aksjonspunkter);
  }
  if (valgtPeriode.aksjonspunkter.length > 0) {
    confirmValues = FaktaBegrunnelseTextField.buildInitialValues([valgtPeriode]);
  }
  const kodeverkFn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return {
    ...valgtPeriode,
    ...InntektOgYtelserFaktaPanel.buildInitialValues(person, inntekter),
    ...OppholdINorgeOgAdresserFaktaPanel.buildInitialValues(soknad, valgtPeriode, aksjonspunkter),
    ...PerioderMedMedlemskapFaktaPanel.buildInitialValues(valgtPeriode, medlemskapPerioder, soknad, aksjonspunkter, kodeverkFn),
    ...FortsattMedlemskapFaktaPanel.buildInitialValues(gjeldendeFom),
    ...oppholdValues,
    ...confirmValues,
  };
});

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = (values) => initialOwnProps.updateOppholdInntektPeriode(transformValues(values));
  return (state, ownProps) => {
    const { valgtPeriode, submittable } = ownProps;
    const formName = `OppholdInntektOgPeriodeForm-${valgtPeriode.id}`;
    return {
      initialValues: buildInitialValues(state, ownProps),
      form: formName,
      submittable,
      onSubmit,
    };
  };
};

export default connect(mapStateToPropsFactory)(injectIntl(behandlingFormForstegangOgRevurdering({
  enableReinitialize: true,
})(OppholdInntektOgPeriodeForm)));
