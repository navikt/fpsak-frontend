import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { Undertekst } from 'nav-frontend-typografi';
import { Column } from 'nav-frontend-grid';

import FaktaBegrunnelseTextField from 'fakta/components/FaktaBegrunnelseTextField';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import ArrowBox from 'sharedComponents/ArrowBox';
import {
  getEditedStatus, getFamiliehendelse, getBehandlingType, getBarnFraTpsRelatertTilSoknad,
  getPersonopplysning, getAksjonspunkter, getSoknadAntallBarn,
} from 'behandling/behandlingSelectors';
import { behandlingFormValueSelector, behandlingForm } from 'behandling/behandlingForm';
import FodselSammenligningPanel from 'behandling/components/fodselSammenligning/FodselSammenligningPanel';
import {
  required, hasValidDate, minValue, maxValue, hasValidInteger, dateBeforeOrEqualToToday,
} from 'utils/validation/validators';
import behandlingType from 'kodeverk/behandlingType';
import {
  DatepickerField, InputField, RadioGroupField, RadioOption,
} from 'form/Fields';
import FaktaGruppe from 'fakta/components/FaktaGruppe';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';

import styles from './SjekkFodselDokForm.less';

const minValue1 = minValue(1);
const maxValue9 = maxValue(9);

/**
 * FodselInfoPanel
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av manglende fødsel (Fødselsvilkåret).
 */
export const SjekkFodselDokForm = ({
  readOnly,
  dokumentasjonForeliggerIsEdited,
  fodselInfo,
  dokumentasjonForeligger,
  behandlingsType,
  dirty,
  initialValues,
  submittable,
}) => (
  <ElementWrapper>
    <FodselSammenligningPanel />
    <FaktaGruppe
      aksjonspunktCode={aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL}
      titleCode="SjekkFodselDokForm.DokumentasjonAvFodsel"
    >
      <div className={styles.horizontalForm}>
        <RadioGroupField name="dokumentasjonForeligger" validate={[required]} readOnly={readOnly} isEdited={dokumentasjonForeliggerIsEdited}>
          <RadioOption label={<FormattedMessage id="SjekkFodselDokForm.DokumentasjonForeligger" />} value />
          <RadioOption label={<FormattedMessage id="SjekkFodselDokForm.DokumentasjonForeliggerIkke" />} value={false} />
        </RadioGroupField>
      </div>
      {fodselInfo && !!fodselInfo.length && dokumentasjonForeligger
      && (
        <div className={styles.clearfix}>
          <Column xs="6">
            <ArrowBox>
              <Undertekst>{<FormattedMessage id="SjekkFodselDokForm.FastsettAntallBarn" />}</Undertekst>
              <div className={styles.horizontalForm}>
                <RadioGroupField name="brukAntallBarnITps" validate={[required]} readOnly={readOnly}>
                  <RadioOption
                    label={behandlingsType.kode !== behandlingType.REVURDERING
                      ? <FormattedMessage id="SjekkFodselDokForm.BrukAntallISoknad" />
                      : <FormattedMessage id="SjekkFodselDokForm.BrukAntallIYtelsesvedtaket" />}
                    value={false}
                  />
                  <RadioOption label={<FormattedMessage id="SjekkFodselDokForm.BrukAntallITPS" />} value />
                </RadioGroupField>
              </div>
            </ArrowBox>
          </Column>
        </div>
      )
      }
      {(!fodselInfo || !fodselInfo.length) && dokumentasjonForeligger
      && (
        <div className={styles.clearfix}>
          <Column xs="6">
            <ArrowBox>
              {<FormattedMessage id="SjekkFodselDokForm.FyllInnDokumenterteOpplysninger" />}
              <div className={styles.fodselRow}>
                <Column xs="5" className={styles.datePickerField}>
                  <DatepickerField
                    name="fodselsdato"
                    label={<FormattedMessage id="SjekkFodselDokForm.Fodselsdato" />}
                    validate={[required, hasValidDate, dateBeforeOrEqualToToday]}
                    readOnly={readOnly}
                  />
                </Column>
                <Column xs="1" />
                <Column xs="6">
                  <InputField
                    name="antallBarnFodt"
                    label={<FormattedMessage id="SjekkFodselDokForm.AntallBarnFodt" />}
                    parse={(value) => {
                      const parsedValue = parseInt(value, 10);
                      return Number.isNaN(parsedValue) ? value : parsedValue;
                    }}
                    validate={[required, hasValidInteger, minValue1, maxValue9]}
                    readOnly={readOnly}
                    bredde="XS"
                    className={styles.revurderingInput}
                  />
                </Column>
              </div>
            </ArrowBox>
          </Column>
        </div>
      )
      }
    </FaktaGruppe>
    <VerticalSpacer sixteenPx />
    <FaktaBegrunnelseTextField isDirty={dirty} isSubmittable={submittable} isReadOnly={readOnly} hasBegrunnelse={!!initialValues.begrunnelse} />
  </ElementWrapper>
);

SjekkFodselDokForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  dokumentasjonForeligger: PropTypes.bool,
  fodselInfo: PropTypes.arrayOf(PropTypes.shape()),
  behandlingsType: PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  }),
  dokumentasjonForeliggerIsEdited: PropTypes.bool,
  submittable: PropTypes.bool.isRequired,
  ...formPropTypes,
};

SjekkFodselDokForm.defaultProps = {
  dokumentasjonForeligger: undefined,
  fodselInfo: [],
  dokumentasjonForeliggerIsEdited: false,
  behandlingsType: {
    kode: '',
    navn: '',
  },
};

export const buildInitialValues = createSelector([getFamiliehendelse, getAksjonspunkter], (familiehendelse, aksjonspunkter) => ({
  fodselsdato: familiehendelse.fodselsdato ? familiehendelse.fodselsdato : null,
  antallBarnFodt: familiehendelse.antallBarnFodsel ? familiehendelse.antallBarnFodsel : null,
  dokumentasjonForeligger: familiehendelse.dokumentasjonForeligger !== null
    ? familiehendelse.dokumentasjonForeligger : undefined,
  brukAntallBarnITps: familiehendelse.brukAntallBarnFraTps !== null
    ? familiehendelse.brukAntallBarnFraTps : undefined,
  ...FaktaBegrunnelseTextField.buildInitialValues(aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL)),
}));

const getAntallBarn = (brukAntallBarnITps, antallBarnLagret, antallBarnFraSoknad, antallBarnFraTps) => {
  if (antallBarnFraTps === 0) {
    return antallBarnLagret;
  }
  return brukAntallBarnITps ? antallBarnFraTps : antallBarnFraSoknad;
};

const transformValues = (values, antallBarnFraSoknad, antallBarnFraTps, fodselInfo) => ({
  kode: aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL,
  fodselsdato: values.fodselsdato,
  antallBarnFodt: values.dokumentasjonForeligger
    ? getAntallBarn(values.brukAntallBarnITps, values.antallBarnFodt, antallBarnFraSoknad, antallBarnFraTps) : undefined,
  dokumentasjonForeligger: values.dokumentasjonForeligger,
  brukAntallBarnITps: fodselInfo && !!fodselInfo.length ? values.brukAntallBarnITps : false,
  ...FaktaBegrunnelseTextField.transformValues(values),
});

export const sjekkFodselDokForm = 'SjekkFodselDokForm';

const mapStateToProps = (state, ownProps) => {
  const fodselInfo = getPersonopplysning(state).barnFraTpsRelatertTilSoknad;
  return {
    initialValues: buildInitialValues(state),
    onSubmit: values => ownProps.submitHandler(transformValues(values,
      getSoknadAntallBarn(state), getBarnFraTpsRelatertTilSoknad(state).length, fodselInfo)),
    fodselInfo,
    dokumentasjonForeliggerIsEdited: getEditedStatus(state).dokumentasjonForeligger,
    dokumentasjonForeligger: behandlingFormValueSelector(sjekkFodselDokForm)(state, 'dokumentasjonForeligger'),
    behandlingsType: getBehandlingType(state),
  };
};

export default connect(mapStateToProps)(behandlingForm({
  form: sjekkFodselDokForm,
})(SjekkFodselDokForm));
