import React, { FunctionComponent } from 'react';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import {
  formValueSelector, getFormValues, reduxForm,
} from 'redux-form';
import { connect } from 'react-redux';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { ariaCheck, required } from '@fpsak-frontend/utils';
import { BorderBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import familieHendelseType from '@fpsak-frontend/kodeverk/src/familieHendelseType';
import { SoknadData } from '@fpsak-frontend/papirsoknad-felles';
import { KodeverkMedNavn } from '@fpsak-frontend/types';

import styles from './soknadTypePickerForm.less';

const SOKNAD_TYPE_PICKER_FORM = 'SoknadTypePickerForm';

export const soeknadsTyper = [
  familieHendelseType.ADOPSJON,
  familieHendelseType.FODSEL];

interface OwnProps {
  fagsakYtelseTyper: KodeverkMedNavn[];
  familieHendelseTyper: KodeverkMedNavn[];
  foreldreTyper: KodeverkMedNavn[];
  handleSubmit: () => undefined;
  selectedFagsakYtelseType?: string;
  ytelseErSatt: boolean;
  submitSucceeded: boolean;
}

/**
 * SoknadTypePickerForm
 *
 * Presentasjonskomponent: Toppkomponent for registrering av papirsøknad der søknadstype, tema og søker/foreldretype blir valgt.
 */
export const SoknadTypePickerForm: FunctionComponent<OwnProps> = ({
  fagsakYtelseTyper,
  familieHendelseTyper,
  foreldreTyper,
  handleSubmit,
  selectedFagsakYtelseType,
  ytelseErSatt,
  submitSucceeded,
}) => (
  <form onSubmit={handleSubmit}>
    <BorderBox className={styles.container}>
      <Undertittel>
        <FormattedMessage id="Registrering.Omsoknaden.Title" />
      </Undertittel>
      <VerticalSpacer sixteenPx />
      <Row>
        <Column xs="4">
          <Undertekst><FormattedMessage id="Registrering.Omsoknaden.soknadstype" /></Undertekst>
          <VerticalSpacer fourPx />
          <RadioGroupField name="fagsakYtelseType" validate={[required]} direction="vertical">
            { fagsakYtelseTyper.map((fyt) => <RadioOption disabled={ytelseErSatt} key={fyt.kode} label={fyt.navn} value={fyt.kode} />) }
          </RadioGroupField>
        </Column>
        <Column xs="4">
          <Undertekst><FormattedMessage id="Registrering.Omsoknaden.Tema" /></Undertekst>
          <VerticalSpacer fourPx />
          <RadioGroupField
            name="familieHendelseType"
            validate={selectedFagsakYtelseType === fagsakYtelseType.SVANGERSKAPSPENGER ? [] : [required]}
            direction="vertical"
          >
            { familieHendelseTyper.filter(({ kode }) => soeknadsTyper.includes(kode)).map((bmt) => (
              <RadioOption
                key={bmt.kode}
                label={bmt.navn}
                value={bmt.kode}
                disabled={selectedFagsakYtelseType === fagsakYtelseType.SVANGERSKAPSPENGER}
              />
            ))}
          </RadioGroupField>
        </Column>
        <Column xs="4">
          <Undertekst>
            <FormattedMessage id="Registrering.Omsoknaden.Soker" />
          </Undertekst>
          <VerticalSpacer fourPx />
          <RadioGroupField
            name="foreldreType"
            validate={[required]}
            direction="vertical"
          >
            { foreldreTyper.map((ft) => (
              <RadioOption
                key={ft.kode}
                label={ft.navn}
                value={ft.kode}
              />
            ))}
          </RadioGroupField>
        </Column>
      </Row>
      <Row>
        <Column xs="12">
          <div className={styles.right}>
            <Hovedknapp
              mini
              onClick={ariaCheck}
              disabled={submitSucceeded}
            >
              <FormattedMessage id="Registrering.Omsoknaden.VisSkjema" />
            </Hovedknapp>
          </div>
        </Column>
      </Row>
    </BorderBox>
  </form>
);

interface FormValues {
  fagsakYtelseType?: KodeverkMedNavn;
  familieHendelseType?: KodeverkMedNavn;
  foreldreType?: KodeverkMedNavn;
}

const buildInitialValues = createSelector(
  [(_state, ownProps) => ownProps.fagsakYtelseType, getFormValues(SOKNAD_TYPE_PICKER_FORM)],
  (sakstype, formValues: FormValues) => {
    const { ...selectedValues } = formValues;
    const initialFagsakYtelseType = selectedValues.fagsakYtelseType ? selectedValues.fagsakYtelseType : sakstype.kode;

    const initialValues = {
      ...selectedValues,
      fagsakYtelseType: initialFagsakYtelseType,
      familieHendelseType: null,
      foreldreType: null,
    };

    const initialFamilieHendelseType = selectedValues.familieHendelseType ? selectedValues.familieHendelseType : null;
    const initialForeldreType = selectedValues.foreldreType ? selectedValues.foreldreType : null;
    return {
      ...initialValues,
      familieHendelseType: initialFamilieHendelseType.kode === '-' ? null : initialFamilieHendelseType,
      foreldreType: initialForeldreType,
    };
  },
);

const mapStateToPropsFactory = (_initialState, initialOwnProps) => {
  const onSubmit = (values) => initialOwnProps.setSoknadData(new SoknadData(values.fagsakYtelseType, values.familieHendelseType, values.foreldreType));
  return (state, ownProps) => ({
    selectedFagsakYtelseType: formValueSelector(SOKNAD_TYPE_PICKER_FORM)(state, 'fagsakYtelseType'),
    ytelseErSatt: !!ownProps.fagsakYtelseType.kode,
    initialValues: buildInitialValues(state, ownProps),
    fagsakYtelseTyper: ownProps.alleKodeverk[kodeverkTyper.FAGSAK_YTELSE],
    familieHendelseTyper: ownProps.alleKodeverk[kodeverkTyper.FAMILIE_HENDELSE_TYPE],
    foreldreTyper: ownProps.alleKodeverk[kodeverkTyper.FORELDRE_TYPE],
    onSubmit,
  });
};

export default connect(mapStateToPropsFactory)(reduxForm({ form: SOKNAD_TYPE_PICKER_FORM, enableReinitialize: true })(SoknadTypePickerForm));
