import React from 'react';
import PropTypes from 'prop-types';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import {
  BorderBox, VerticalSpacer, FlexColumn, FlexContainer, FlexRow,
} from '@fpsak-frontend/shared-components';

import { behandlingForm, behandlingFormValueSelector } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import { getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duck';
import OppholdINorgeOgAdresserFaktaPanel from './OppholdINorgeOgAdresserFaktaPanel';
import InntektOgYtelserFaktaPanel from './InntektOgYtelserFaktaPanel';
import PerioderMedMedlemskapFaktaPanel from './PerioderMedMedlemskapFaktaPanel';
import StatusForBorgerFaktaPanel from './StatusForBorgerFaktaPanel';
import FortsattMedlemskapFaktaPanel from './FortsattMedlemskapFaktaPanel';

const {
  AVKLAR_OPPHOLDSRETT, AVKLAR_LOVLIG_OPPHOLD,
} = aksjonspunktCodes;

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap === aksjonspunktCode);

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
    && <StatusForBorgerFaktaPanel readOnly={readOnly} id={valgtPeriode.id} />
    }
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

const transformValues = values => ({
  begrunnelse: values.begrunnelse,
  ...values,
});

const buildInitialValues = (periode, soknad, person, inntekter, medlemskapPerioder, gjeldendeFom, alleAksjonspunkter, alleKodeverk) => {
  const aksjonspunkter = alleAksjonspunkter
    .filter(ap => periode.aksjonspunkter.includes(ap.definisjon.kode) || ap.definisjon.kode === aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP)
    .filter(ap => ap.definisjon.kode !== aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN);
  let oppholdValues = {};
  let confirmValues = {};
  if (hasAksjonspunkt(AVKLAR_OPPHOLDSRETT, periode.aksjonspunkter) || hasAksjonspunkt(AVKLAR_LOVLIG_OPPHOLD, periode.aksjonspunkter)) {
    oppholdValues = StatusForBorgerFaktaPanel.buildInitialValues(periode, aksjonspunkter);
  }
  if (periode.aksjonspunkter.length > 0) {
    confirmValues = FaktaBegrunnelseTextField.buildInitialValues([periode]);
  }

  return {
    ...periode,
    ...InntektOgYtelserFaktaPanel.buildInitialValues(person, inntekter),
    ...OppholdINorgeOgAdresserFaktaPanel.buildInitialValues(soknad, periode, aksjonspunkter),
    ...PerioderMedMedlemskapFaktaPanel.buildInitialValues(periode, medlemskapPerioder, soknad, aksjonspunkter, getKodeverknavnFn(alleKodeverk, kodeverkTyper)),
    ...FortsattMedlemskapFaktaPanel.buildInitialValues(gjeldendeFom),
    ...oppholdValues,
    ...confirmValues,
  };
};

const mapStateToProps = (state, ownProps) => {
  const { valgtPeriode } = ownProps;
  const formName = `OppholdInntektOgPeriodeForm-${valgtPeriode.id}`;
  const medlemskapPerioder = behandlingFormValueSelector('OppholdInntektOgPerioderForm')(state, 'medlemskapPerioder');
  const soknad = behandlingFormValueSelector('OppholdInntektOgPerioderForm')(state, 'soknad');
  const person = behandlingFormValueSelector('OppholdInntektOgPerioderForm')(state, 'person');
  const inntekter = behandlingFormValueSelector('OppholdInntektOgPerioderForm')(state, 'inntekter');
  const gjeldendeFom = behandlingFormValueSelector('OppholdInntektOgPerioderForm')(state, 'gjeldendeFom');
  const alleKodeverk = getAlleKodeverk(state);
  return {
    initialValues: {
      ...buildInitialValues(valgtPeriode, soknad, person, inntekter, medlemskapPerioder, gjeldendeFom, ownProps.aksjonspunkter, alleKodeverk),
    },
    submittable: ownProps.submittable,
    form: formName,
    onSubmit: values => ownProps.updateOppholdInntektPeriode(transformValues(values)),
  };
};

export default connect(mapStateToProps)(injectIntl(behandlingForm({
  enableReinitialize: true,
})(OppholdInntektOgPeriodeForm)));
