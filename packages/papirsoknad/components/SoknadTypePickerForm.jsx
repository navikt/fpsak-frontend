import React from 'react';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import {
  reduxForm, formPropTypes, formValueSelector, getFormValues,
} from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Undertittel, Undertekst } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';

import behandlingType from 'kodeverk/behandlingType';
import { getFagsakYtelseType } from 'fagsak/fagsakSelectors';
import { getBehandlingType } from 'behandling/behandlingSelectors';
import { RadioGroupField, RadioOption } from 'form/Fields';
import { ariaCheck, required } from 'utils/validation/validators';
import BorderBox from 'sharedComponents/BorderBox';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import SoknadData from 'papirsoknad/SoknadData';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import familieHendelseType from 'kodeverk/familieHendelseType';

import { getKodeverk } from 'kodeverk/duck';
import kodeverkPropType from 'kodeverk/kodeverkPropType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';

import styles from './soknadTypePickerForm.less';

const SOKNAD_TYPE_PICKER_FORM = 'SoknadTypePickerForm';

export const soeknadsTyper = [
  familieHendelseType.ADOPSJON,
  familieHendelseType.FODSEL];

/**
 * SoknadTypePickerForm
 *
 * Presentasjonskomponent: Toppkomponent for registrering av papirsøknad der søknadstype, tema og søker/foreldretype blir valgt.
 */
export const SoknadTypePickerForm = ({
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
            { fagsakYtelseTyper.map(fyt => <RadioOption disabled={ytelseErSatt} key={fyt.kode} label={fyt.navn} value={fyt.kode} />) }
          </RadioGroupField>
        </Column>
        <Column xs="4">
          <Undertekst><FormattedMessage id="Registrering.Omsoknaden.Tema" /></Undertekst>
          <VerticalSpacer fourPx />
          <RadioGroupField
            name="familieHendelseType"
            validate={selectedFagsakYtelseType === fagsakYtelseType.ENDRING_FORELDREPENGER ? [] : [required]}
            direction="vertical"
          >
            { familieHendelseTyper.filter(({ kode }) => soeknadsTyper.includes(kode)).map(bmt => (
              <RadioOption
                key={bmt.kode}
                label={bmt.navn}
                value={bmt.kode}
                disabled={selectedFagsakYtelseType === fagsakYtelseType.ENDRING_FORELDREPENGER}
              />
            ))}
          </RadioGroupField>
        </Column>
        <Column xs="4">
          <Undertekst>
            {' '}
            <FormattedMessage id="Registrering.Omsoknaden.Soker" />
          </Undertekst>
          <VerticalSpacer fourPx />
          <RadioGroupField
            name="foreldreType"
            validate={selectedFagsakYtelseType === fagsakYtelseType.ENDRING_FORELDREPENGER ? [] : [required]}
            direction="vertical"
          >
            { foreldreTyper.map(ft => (
              <RadioOption
                key={ft.kode}
                label={ft.navn}
                value={ft.kode}
                disabled={selectedFagsakYtelseType === fagsakYtelseType.ENDRING_FORELDREPENGER}
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

SoknadTypePickerForm.propTypes = {
  ...formPropTypes,
  fagsakYtelseTyper: kodeverkPropType.isRequired,
  familieHendelseTyper: kodeverkPropType.isRequired,
  foreldreTyper: kodeverkPropType.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  selectedFagsakYtelseType: PropTypes.string,
  ytelseErSatt: PropTypes.bool.isRequired,
  soknadData: PropTypes.instanceOf(SoknadData),
  submitSucceeded: PropTypes.bool.isRequired,
};

SoknadTypePickerForm.defaultProps = {
  selectedFagsakYtelseType: null,
  soknadData: null,
};

const getSakstype = createSelector(
  [getFagsakYtelseType, getBehandlingType], (sakstype, bt) => (bt.kode === behandlingType.REVURDERING && sakstype.kode === fagsakYtelseType.FORELDREPENGER
    ? fagsakYtelseType.ENDRING_FORELDREPENGER : sakstype.kode),
);

const buildInitialValues = createSelector(
  [getSakstype, getFormValues(SOKNAD_TYPE_PICKER_FORM)],
  (sakstype, formValues) => {
    const { ...selectedValues } = formValues;
    const initialFagsakYtelseType = selectedValues.fagsakYtelseType ? selectedValues.fagsakYtelseType : sakstype;

    const initialValues = {
      ...selectedValues,
      fagsakYtelseType: initialFagsakYtelseType,
      familieHendelseType: null,
      foreldreType: null,
    };

    if (selectedValues.fagsakYtelseType === fagsakYtelseType.ENDRING_FORELDREPENGER) {
      return initialValues;
    }

    const initialFamilieHendelseType = selectedValues.familieHendelseType ? selectedValues.familieHendelseType : null;
    const initialForeldreType = selectedValues.foreldreType ? selectedValues.foreldreType : null;
    return {
      ...initialValues,
      familieHendelseType: initialFamilieHendelseType === '-' ? null : initialFamilieHendelseType,
      foreldreType: initialForeldreType,
    };
  },
);

const getSubmitFunction = setSoknadData => (values) => {
  setSoknadData(new SoknadData(values.fagsakYtelseType, values.familieHendelseType, values.foreldreType));
};

const mapStateToProps = (state, ownProps) => ({
  selectedFagsakYtelseType: formValueSelector(SOKNAD_TYPE_PICKER_FORM)(state, 'fagsakYtelseType'),
  ytelseErSatt: !!getFagsakYtelseType(state).kode,
  initialValues: buildInitialValues(state),
  fagsakYtelseTyper: getKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE)(state),
  familieHendelseTyper: getKodeverk(kodeverkTyper.FAMILIE_HENDELSE_TYPE)(state),
  foreldreTyper: getKodeverk(kodeverkTyper.FORELDRE_TYPE)(state),
  onSubmit: getSubmitFunction(ownProps.setSoknadData),
});

export default connect(mapStateToProps)(reduxForm({ form: SOKNAD_TYPE_PICKER_FORM, enableReinitialize: true })(SoknadTypePickerForm));
