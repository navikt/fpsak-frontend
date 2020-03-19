import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import AlertStripe from 'nav-frontend-alertstriper';

import {
  DateLabel, VerticalSpacer, FaktaGruppe,
} from '@fpsak-frontend/shared-components';
import {
  DatepickerField, InputField, behandlingForm, behandlingFormValueSelector,
} from '@fpsak-frontend/form';
import {
  hasValidDate, hasValidInteger, maxValue, minValue, required,
} from '@fpsak-frontend/utils';
import { FaktaBegrunnelseTextField, isFieldEdited } from '@fpsak-frontend/fakta-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import styles from './termindatoFaktaForm.less';

const minValue1 = minValue(1);
const maxValue9 = maxValue(9);

/**
 * TermindatoFaktaForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av termindato (Fødselsvilkåret).
 */
export const TermindatoFaktaForm = ({
  readOnly,
  isTerminDatoEdited,
  isUtstedtDatoEdited,
  isForTidligTerminbekreftelse,
  isAntallBarnEdited,
  dirty,
  initialValues,
  fodselsdatoTps,
  antallBarnTps,
  isOverridden,
  submittable,
  alleMerknaderFraBeslutter,
}) => (
  <>
    <FaktaGruppe
      aksjonspunktCode={aksjonspunktCodes.TERMINBEKREFTELSE}
      titleCode="TermindatoFaktaForm.ApplicationInformation"
      merknaderFraBeslutter={alleMerknaderFraBeslutter[aksjonspunktCodes.TERMINBEKREFTELSE]}
    >
      <Row>
        <Column xs="3">
          <DatepickerField
            name="utstedtdato"
            label={{ id: 'TermindatoFaktaForm.UtstedtDato' }}
            validate={[required, hasValidDate]}
            readOnly={readOnly}
            isEdited={isUtstedtDatoEdited}
          />
        </Column>
        <Column xs="3">
          <DatepickerField
            name="termindato"
            label={{ id: 'TermindatoFaktaForm.Termindato' }}
            validate={[required, hasValidDate]}
            readOnly={readOnly}
            isEdited={isTerminDatoEdited}
          />
        </Column>
        <Column xs="6">
          <InputField
            name="antallBarn"
            label={{ id: 'TermindatoFaktaForm.AntallBarn' }}
            parse={(value) => {
              const parsedValue = parseInt(value, 10);
              return Number.isNaN(parsedValue) ? value : parsedValue;
            }}
            validate={[required, hasValidInteger, minValue1, maxValue9]}
            bredde="XS"
            readOnly={readOnly}
            isEdited={isAntallBarnEdited}
          />
        </Column>
      </Row>
    </FaktaGruppe>
    { fodselsdatoTps && !isOverridden
      && (
      <FaktaGruppe titleCode="TermindatoFaktaForm.OpplysningerTPS">
        <Row>
          <Column xs="6"><Normaltekst><FormattedMessage id="TermindatoFaktaForm.FodselsdatoTps" /></Normaltekst></Column>
          <Column xs="6"><Normaltekst><FormattedMessage id="TermindatoFaktaForm.AntallBarnTps" /></Normaltekst></Column>
        </Row>
        <Row>
          <Column xs="6" name="tpsFodseldato">
            <Normaltekst><DateLabel dateString={fodselsdatoTps} /></Normaltekst>
          </Column>
          <Column xs="6" name="tpsAntallBarn">
            <Normaltekst>{antallBarnTps}</Normaltekst>
          </Column>
        </Row>
      </FaktaGruppe>
      )}
    <VerticalSpacer sixteenPx />
    <FaktaBegrunnelseTextField isDirty={dirty} isSubmittable={submittable} isReadOnly={readOnly} hasBegrunnelse={!!initialValues.begrunnelse} />
    {isForTidligTerminbekreftelse && (
      <>
        <VerticalSpacer sixteenPx />
        <AlertStripe type="advarsel" className={styles.marginBottom}>
          <FormattedMessage
            id="TermindatoFaktaForm.AdvarselForTidligUtstedtdato"
          />
        </AlertStripe>
      </>
    )}
  </>
);

TermindatoFaktaForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isTerminDatoEdited: PropTypes.bool,
  isUtstedtDatoEdited: PropTypes.bool,
  isForTidligTerminbekreftelse: PropTypes.bool.isRequired,
  isAntallBarnEdited: PropTypes.bool,
  fodselsdatoTps: PropTypes.string,
  antallBarnTps: PropTypes.number,
  isOverridden: PropTypes.bool,
  submittable: PropTypes.bool.isRequired,
  ...formPropTypes,
};

TermindatoFaktaForm.defaultProps = {
  isTerminDatoEdited: false,
  isUtstedtDatoEdited: false,
  isAntallBarnEdited: false,
  fodselsdatoTps: undefined,
  antallBarnTps: 0,
  isOverridden: false,
};

export const buildInitialValues = createSelector([
  (state, ownProps) => ownProps.soknad,
  (state, ownProps) => ownProps.gjeldendeFamiliehendelse,
  (state, ownProps) => ownProps.aksjonspunkt], (
  soknad, familiehendelse, aksjonspunkt,
) => {
  const antallBarn = soknad.antallBarn ? soknad.antallBarn : NaN;
  return {
    utstedtdato: familiehendelse.utstedtdato ? familiehendelse.utstedtdato : soknad.utstedtdato,
    termindato: familiehendelse.termindato ? familiehendelse.termindato : soknad.termindato,
    antallBarn: familiehendelse.antallBarnTermin ? familiehendelse.antallBarnTermin : antallBarn,
    ...FaktaBegrunnelseTextField.buildInitialValues(aksjonspunkt),
  };
});

const erTerminbekreftelseUtstedtForTidlig = (utstedtdato, termindato) => utstedtdato !== undefined && termindato !== undefined
&& !moment(utstedtdato).isAfter(moment(termindato).subtract(18, 'weeks').subtract(3, 'days'));

const transformValues = (values) => ({
  kode: aksjonspunktCodes.TERMINBEKREFTELSE,
  utstedtdato: values.utstedtdato,
  termindato: values.termindato,
  antallBarn: values.antallBarn,
  ...FaktaBegrunnelseTextField.transformValues(values),
});

export const termindatoFaktaFormName = 'TermindatoFaktaForm';

const getEditedStatus = createSelector(
  [(state, ownProps) => ownProps.soknad,
    (state, ownProps) => ownProps.gjeldendeFamiliehendelse,
    (state, ownProps) => ownProps.personopplysninger],
  (soknad, familiehendelse, personopplysning) => (
    isFieldEdited(soknad || {}, familiehendelse || {}, personopplysning || {})
  ),
);

const mapStateToPropsFactory = (initialState, staticOwnProps) => {
  const { behandlingId, behandlingVersjon } = staticOwnProps;
  const onSubmit = (values) => staticOwnProps.submitHandler(transformValues(values));
  return (state, ownProps) => {
    const termindato = behandlingFormValueSelector(termindatoFaktaFormName, behandlingId, behandlingVersjon)(state, 'termindato');
    const utstedtdato = behandlingFormValueSelector(termindatoFaktaFormName, behandlingId, behandlingVersjon)(state, 'utstedtdato');
    const editedStatus = getEditedStatus(state, ownProps);
    return {
      onSubmit,
      initialValues: buildInitialValues(state, ownProps),
      isTerminDatoEdited: editedStatus.termindato,
      isUtstedtDatoEdited: editedStatus.utstedtdato,
      isForTidligTerminbekreftelse: erTerminbekreftelseUtstedtForTidlig(utstedtdato, termindato),
      isAntallBarnEdited: editedStatus.antallBarn,
      fodselsdatoTps: ownProps.gjeldendeFamiliehendelse.fodselsdato,
      antallBarnTps: ownProps.gjeldendeFamiliehendelse.antallBarnFodsel,
      isOverridden: ownProps.gjeldendeFamiliehendelse.erOverstyrt,
    };
  };
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: termindatoFaktaFormName,
})(TermindatoFaktaForm));
