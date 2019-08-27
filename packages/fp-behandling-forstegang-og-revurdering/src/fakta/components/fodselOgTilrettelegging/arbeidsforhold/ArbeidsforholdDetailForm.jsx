import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Knapp } from 'nav-frontend-knapper';

import { omit, required, hasValidDate } from '@fpsak-frontend/utils';
import { DatepickerField } from '@fpsak-frontend/form';
import {
  FlexContainer, FlexColumn, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';

import {
  behandlingFormForstegangOgRevurdering, behandlingFormValueSelector,
} from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
import TilretteleggingFaktaPanel from './tilrettelegging/TilretteleggingFaktaPanel';

export const ARBEIDSFORHOLD_DETAIL_FORM_NAME = 'selectedFodselOgTilretteleggingForm';

/**
 * ArbeidsforholdDetailForm
 *
 * Svangerskapspenger
 * Vise info pr arbforhold fra søknad og kunne endre feltene.
 */
export const ArbeidsforholdDetailForm = ({
  cancelArbeidsforholdCallback,
  readOnly,
  warning,
  submittable,
  jordmorTilretteleggingFraDato,
  tilretteleggingDatoer,
  ...formProps
}) => {
  const [valgtTilrettelegging, settValgtTilrettelegging] = useState();
  return (
    <FlexContainer>
      <FlexRow>
        <FlexColumn>
          <DatepickerField
            name="jordmorTilretteleggingFra"
            label={{ id: 'ArbeidsforholdInnhold.Jordmor.TilretteleggingFra' }}
            validate={[required, hasValidDate]}
            readOnly={readOnly}
          />
        </FlexColumn>
      </FlexRow>
      <FlexRow>
        <FlexColumn>
          <TilretteleggingFaktaPanel
            settValgtTilrettelegging={settValgtTilrettelegging}
            parentFormName={ARBEIDSFORHOLD_DETAIL_FORM_NAME}
            readOnly={readOnly}
            submittable={submittable}
            jordmorTilretteleggingFraDato={jordmorTilretteleggingFraDato}
          />
          <VerticalSpacer sixteenPx />
        </FlexColumn>
      </FlexRow>
      {(!readOnly && (!valgtTilrettelegging || tilretteleggingDatoer.length === 0)) && (
        <FlexRow>
          <FlexColumn>
            <FaktaSubmitButton
              formName={ARBEIDSFORHOLD_DETAIL_FORM_NAME}
              isSubmittable={submittable && Object.keys(warning).length === 0}
              isReadOnly={readOnly}
              hasOpenAksjonspunkter={false}
              onClick={formProps.handleSubmit}
              buttonTextId="ArbeidsforholdFaktaPanel.Oppdater"
            />
          </FlexColumn>
          <FlexColumn>
            <Knapp
              htmlType="button"
              mini
              onClick={cancelArbeidsforholdCallback}
            >
              <FormattedMessage id="ArbeidsforholdFaktaPanel.Avbryt" />
            </Knapp>
          </FlexColumn>
        </FlexRow>
      )}
    </FlexContainer>
  );
};

ArbeidsforholdDetailForm.propTypes = {
  cancelArbeidsforholdCallback: PropTypes.func.isRequired,
  updateArbeidsforholdCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  warning: PropTypes.shape(),
  submittable: PropTypes.bool.isRequired,
  jordmorTilretteleggingFraDato: PropTypes.string.isRequired,
  tilretteleggingDatoer: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

ArbeidsforholdDetailForm.defaultProps = {
  warning: {},
};

const validateWarning = (values) => {
  const {
    redusertArbeidDato, kanGjennomforesDato, kanIkkeGjennomforesDato, redusertArbeid, kanGjennomfores, kanIkkeGjennomfores,
  } = values;
  let warnings = {};

  if ((redusertArbeid && kanGjennomfores && redusertArbeidDato && redusertArbeidDato === kanGjennomforesDato)
  || (kanIkkeGjennomfores && kanGjennomfores && kanIkkeGjennomforesDato && kanIkkeGjennomforesDato === kanGjennomforesDato)
  || (kanIkkeGjennomfores && redusertArbeid && redusertArbeidDato && kanIkkeGjennomforesDato === redusertArbeidDato)) {
    warnings = {
      _warning: {
        permisjonsWarning: <FormattedMessage id="ArbeidsforholdInnhold.TilretteleggingWarning" />,
      },
    };
  }
  return warnings;
};

const validateErrors = (values) => {
  const errors = {};
  if (values.tilretteleggingDatoer && values.tilretteleggingDatoer.some((td) => moment(td.fom).isBefore(values.jordmorTilretteleggingFra))) {
    errors.jordmorTilretteleggingFra = [{ id: 'TilretteleggingDetailForm.SenereEnnTilrettelegging' }];
  }
  return errors;
};

const transformValues = (values, selectedArbeidsforhold) => {
  const { ...transformvalue } = selectedArbeidsforhold;
  transformvalue.tilretteleggingBehovFom = values.jordmorTilretteleggingFra;
  transformvalue.helTilretteleggingFom = values.kanGjennomfores ? values.kanGjennomforesDato : null;
  transformvalue.slutteArbeidFom = values.kanIkkeGjennomfores ? values.kanIkkeGjennomforesDato : null;
  transformvalue.delvisTilretteleggingFom = values.redusertArbeid ? values.redusertArbeidDato : null;
  transformvalue.stillingsprosent = values.redusertArbeid ? values.redusertArbeidStillingsprosent : null;
  transformvalue.begrunnelse = values.begrunnelse;
  transformvalue.tilretteleggingDatoer = values.tilretteleggingDatoer.map((t) => omit(t, 'id'));
  return transformvalue;
};

export const buildInitialValues = (values) => ({
  jordmorTilretteleggingFra: values.tilretteleggingBehovFom,
  begrunnelse: values.begrunnelse,
  kanGjennomfores: !!values.helTilretteleggingFom,
  kanGjennomforesDato: values.helTilretteleggingFom,
  kanIkkeGjennomfores: !!values.slutteArbeidFom,
  kanIkkeGjennomforesDato: values.slutteArbeidFom,
  redusertArbeid: !!values.delvisTilretteleggingFom,
  redusertArbeidDato: values.delvisTilretteleggingFom,
  redusertArbeidStillingsprosent: values.stillingsprosent,
  tilretteleggingDatoer: values.tilretteleggingDatoer.map((t, index) => ({
    ...t,
    id: index,
  })),
});

const EMPTY_ARRAY = [];

const mapStateToPropsFactory = (initialState, ownProps) => {
  const { selectedArbeidsforhold } = ownProps;
  const onSubmit = (values) => ownProps.updateArbeidsforholdCallback(transformValues(values, selectedArbeidsforhold));
  const warn = (values) => validateWarning(values);
  const validate = (values) => validateErrors(values);
  return (state) => ({
    initialValues: buildInitialValues(selectedArbeidsforhold),
    jordmorTilretteleggingFraDato: behandlingFormValueSelector(ARBEIDSFORHOLD_DETAIL_FORM_NAME)(state, 'jordmorTilretteleggingFra'),
    tilretteleggingDatoer: behandlingFormValueSelector(ARBEIDSFORHOLD_DETAIL_FORM_NAME)(state, 'tilretteleggingDatoer') || EMPTY_ARRAY,
    warn,
    validate,
    onSubmit,
  });
};

export default connect(mapStateToPropsFactory)(behandlingFormForstegangOgRevurdering({
  form: ARBEIDSFORHOLD_DETAIL_FORM_NAME,
  enableReinitialize: true,
})(ArbeidsforholdDetailForm));
