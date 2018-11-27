import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { Row, Column } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';

import FaktaBegrunnelseTextField from 'fakta/components/FaktaBegrunnelseTextField';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import DateLabel from 'sharedComponents/DateLabel';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { behandlingForm } from 'behandling/behandlingForm';
import { DatepickerField, InputField } from 'form/Fields';
import {
  required, hasValidDate, minValue, maxValue, hasValidInteger,
} from 'utils/validation/validators';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import FaktaGruppe from 'fakta/components/FaktaGruppe';
import {
  getEditedStatus, getSoknad, getFamiliehendelse, getAksjonspunkter,
} from 'behandling/behandlingSelectors';

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
  isAntallBarnEdited,
  dirty,
  initialValues,
  fodselsdatoTps,
  antallBarnTps,
  isOverridden,
  submittable,
}) => (
  <ElementWrapper>
    <FaktaGruppe aksjonspunktCode={aksjonspunktCodes.TERMINBEKREFTELSE} titleCode="TermindatoFaktaForm.ApplicationInformation">
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
      )
    }
    <VerticalSpacer sixteenPx />
    <FaktaBegrunnelseTextField isDirty={dirty} isSubmittable={submittable} isReadOnly={readOnly} hasBegrunnelse={!!initialValues.begrunnelse} />
  </ElementWrapper>
);

TermindatoFaktaForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isTerminDatoEdited: PropTypes.bool,
  isUtstedtDatoEdited: PropTypes.bool,
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

export const buildInitialValues = createSelector([getSoknad, getFamiliehendelse, getAksjonspunkter], (soknad, familiehendelse, aksjonspunkter) => {
  const antallBarn = soknad.antallBarn ? soknad.antallBarn : NaN;
  return {
    utstedtdato: familiehendelse.utstedtdato ? familiehendelse.utstedtdato : soknad.utstedtdato,
    termindato: familiehendelse.termindato ? familiehendelse.termindato : soknad.termindato,
    antallBarn: familiehendelse.antallBarnTermin ? familiehendelse.antallBarnTermin : antallBarn,
    ...FaktaBegrunnelseTextField.buildInitialValues(aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.TERMINBEKREFTELSE)),
  };
});

const isUtstedtDatoOrTerminDatoEdited = (
  utstedtdato, termindato, initialValues,
) => initialValues && (initialValues.utstedtdato !== utstedtdato || initialValues.termindato !== termindato);

const validate = ({ utstedtdato, termindato }, initialValues) => {
  const errors = {};

  if (isUtstedtDatoOrTerminDatoEdited(utstedtdato, termindato, initialValues)
    && !moment(utstedtdato).isAfter(moment(termindato).subtract(14, 'weeks').subtract(4, 'days'))) {
    errors.utstedtdato = ([{ id: 'TermindatoFaktaForm.14WeeksAndThreeDays' }]);
  }
  return errors;
};

const transformValues = values => ({
  kode: aksjonspunktCodes.TERMINBEKREFTELSE,
  utstedtdato: values.utstedtdato,
  termindato: values.termindato,
  antallBarn: values.antallBarn,
  ...FaktaBegrunnelseTextField.transformValues(values),
});

const mapStateToProps = (state, ownProps) => ({
  initialValues: buildInitialValues(state),
  onSubmit: values => ownProps.submitHandler(transformValues(values)),
  isTerminDatoEdited: getEditedStatus(state).termindato,
  isUtstedtDatoEdited: getEditedStatus(state).utstedtdato,
  isAntallBarnEdited: getEditedStatus(state).antallBarn,
  fodselsdatoTps: getFamiliehendelse(state).fodselsdato,
  antallBarnTps: getFamiliehendelse(state).antallBarnFodsel,
  isOverridden: getFamiliehendelse(state).erOverstyrt,
});

export const termindatoFaktaFormName = 'TermindatoFaktaForm';

export default connect(mapStateToProps)(behandlingForm({
  form: termindatoFaktaFormName,
  validate,
})(TermindatoFaktaForm));
