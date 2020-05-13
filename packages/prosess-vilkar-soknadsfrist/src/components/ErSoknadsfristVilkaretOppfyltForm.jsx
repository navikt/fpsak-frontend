import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';
import Panel from 'nav-frontend-paneler';
import { Column, Row } from 'nav-frontend-grid';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ISO_DATE_FORMAT, required, getKodeverknavnFn } from '@fpsak-frontend/utils';
import { DateLabel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  RadioGroupField, RadioOption, behandlingForm, behandlingFormValueSelector, hasBehandlingFormErrorsOfType, isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/form';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import {
  ProsessStegBegrunnelseTextField, ProsessStegSubmitButton,
} from '@fpsak-frontend/prosess-felles';

import styles from './erSoknadsfristVilkaretOppfyltForm.less';

const findRadioButtonTextCode = (erVilkarOk) => (erVilkarOk
  ? 'ErSoknadsfristVilkaretOppfyltForm.VilkarOppfylt' : 'ErSoknadsfristVilkaretOppfyltForm.VilkarIkkeOppfylt');

const findSoknadsfristDate = (mottattDato, antallDagerSoknadLevertForSent) => (
  moment(mottattDato)
    .subtract(antallDagerSoknadLevertForSent, 'days')
    .format(ISO_DATE_FORMAT)
);

const isEdited = (hasAksjonspunkt, erVilkarOk) => hasAksjonspunkt && erVilkarOk !== undefined;
const showAvslagsarsak = (erVilkarOk, avslagsarsak) => erVilkarOk === false && avslagsarsak;

/**
 * ErSoknadsfristVilkaretOppfyltForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for vurdering av søknadsfristvilkåret.
 */
export const ErSoknadsfristVilkaretOppfyltFormImpl = ({
  intl,
  readOnly,
  readOnlySubmitButton,
  soknad,
  antallDagerSoknadLevertForSent,
  textCode,
  dato,
  erVilkarOk,
  behandlingsresultat,
  hasAksjonspunkt,
  getKodeverknavn,
  behandlingId,
  behandlingVersjon,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <Undertittel>{intl.formatMessage({ id: 'ErSoknadsfristVilkaretOppfyltForm.Soknadsfrist' })}</Undertittel>
    <span className="typo-normal">
      <FormattedMessage id="ErSoknadsfristVilkaretOppfyltForm.ApplicationReceivedPart1" />
      <span className={styles.days}>
        <FormattedMessage id="ErSoknadsfristVilkaretOppfyltForm.ApplicationReceivedPart2" values={{ numberOfDays: antallDagerSoknadLevertForSent }} />
      </span>
      <FormattedMessage id="ErSoknadsfristVilkaretOppfyltForm.ApplicationReceivedPart3" />
      {soknad.mottattDato && antallDagerSoknadLevertForSent && (
        <DateLabel dateString={findSoknadsfristDate(soknad.mottattDato, antallDagerSoknadLevertForSent)} />
      )}
    </span>
    <Row>
      <Column xs="6">
        <Panel className={styles.panel}>
          <SkjemaGruppe legend={intl.formatMessage({ id: 'ErSoknadsfristVilkaretOppfyltForm.Consider' })}>
            <ul className={styles.hyphen}>
              <li><FormattedMessage id="ErSoknadsfristVilkaretOppfyltForm.Question1" /></li>
              <li><FormattedMessage id="ErSoknadsfristVilkaretOppfyltForm.Question2" /></li>
              <li><FormattedMessage id="ErSoknadsfristVilkaretOppfyltForm.Question3" /></li>
            </ul>
          </SkjemaGruppe>
        </Panel>
      </Column>
      <Column xs="6">
        <Panel className={styles.panelDates}>
          <Row>
            <Column xs="6">
              <Undertekst>{intl.formatMessage({ id: 'ErSoknadsfristVilkaretOppfyltForm.MottattDato' })}</Undertekst>
              <span className="typo-normal">
                {soknad.mottattDato && <DateLabel dateString={soknad.mottattDato} />}
              </span>
            </Column>
            <Column xs="6">
              {textCode && <Undertekst>{intl.formatMessage({ id: textCode })}</Undertekst>}
              <span className="typo-normal">
                {dato && <DateLabel id="date-label" dateString={dato} />}
              </span>
            </Column>
          </Row>
          <VerticalSpacer twentyPx />
          <Row>
            <Column xs="11">
              <Undertekst>{intl.formatMessage({ id: 'ErSoknadsfristVilkaretOppfyltForm.ExplanationFromApplication' })}</Undertekst>
              <span className="typo-normal">
                {soknad.begrunnelseForSenInnsending || '-'}
              </span>
            </Column>
          </Row>
        </Panel>
      </Column>
    </Row>
    <VerticalSpacer sixteenPx />
    {!readOnly && (
      <Row>
        <Column xs="6">
          <RadioGroupField name="erVilkarOk" validate={[required]}>
            <RadioOption
              label={(
                <FormattedMessage
                  id={findRadioButtonTextCode(true)}
                  values={{
                    b: (...chunks) => <b>{chunks}</b>,
                  }}
                />
              )}
              value
            />
            <RadioOption
              label={(
                <FormattedMessage
                  id={findRadioButtonTextCode(false)}
                  values={{
                    b: (...chunks) => <b>{chunks}</b>,
                  }}
                />
              )}
              value={false}
            />
          </RadioGroupField>
        </Column>
      </Row>
    )}
    {readOnly && (
      <>
        <RadioGroupField name="dummy" className={styles.text} readOnly={readOnly} isEdited={isEdited(hasAksjonspunkt, erVilkarOk)}>
          {[<RadioOption
            key="dummy"
            label={(
              <FormattedMessage
                id={findRadioButtonTextCode(erVilkarOk)}
                values={{
                  b: (...chunks) => <b>{chunks}</b>,
                }}
              />
                  )}
            value=""
          />]}
        </RadioGroupField>
        {showAvslagsarsak(erVilkarOk, behandlingsresultat.avslagsarsak) && (
          <Normaltekst>{getKodeverknavn(behandlingsresultat.avslagsarsak, vilkarType.SOKNADFRISTVILKARET)}</Normaltekst>
        )}
      </>
    )}
    <ProsessStegBegrunnelseTextField readOnly={readOnly} />
    <VerticalSpacer sixteenPx />
    <ProsessStegSubmitButton
      formName={formProps.form}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      isReadOnly={readOnly}
      isSubmittable={!readOnlySubmitButton}
      isBehandlingFormSubmitting={isBehandlingFormSubmitting}
      isBehandlingFormDirty={isBehandlingFormDirty}
      hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
    />
  </form>
);

ErSoknadsfristVilkaretOppfyltFormImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  /**
   * Skal knapp for å bekrefte data være trykkbar
   */
  readOnlySubmitButton: PropTypes.bool.isRequired,
  antallDagerSoknadLevertForSent: PropTypes.string,
  textCode: PropTypes.string.isRequired,
  dato: PropTypes.string,
  behandlingsresultat: PropTypes.shape(),
  hasAksjonspunkt: PropTypes.bool,
  getKodeverknavn: PropTypes.func.isRequired,
  ...formPropTypes,
};

ErSoknadsfristVilkaretOppfyltFormImpl.defaultProps = {
  antallDagerSoknadLevertForSent: undefined,
  dato: undefined,
  behandlingsresultat: {},
  hasAksjonspunkt: false,
};


export const buildInitialValues = createSelector([
  (state, ownProps) => ownProps.aksjonspunkter, (state, ownProps) => ownProps.status],
(aksjonspunkter, status) => ({
  erVilkarOk: isAksjonspunktOpen(aksjonspunkter[0].status.kode) ? undefined : vilkarUtfallType.OPPFYLT === status,
  ...ProsessStegBegrunnelseTextField.buildInitialValues(aksjonspunkter),
}));

const transformValues = (values, aksjonspunkter) => ({
  erVilkarOk: values.erVilkarOk,
  kode: aksjonspunkter[0].definisjon.kode,
  ...ProsessStegBegrunnelseTextField.transformValues(values),
});

const findDate = createSelector([
  (state, ownProps) => ownProps.soknad, (state, ownProps) => ownProps.gjeldendeFamiliehendelse], (soknad, familiehendelse) => {
  if (soknad.soknadType.kode === soknadType.FODSEL) {
    const soknadFodselsdato = soknad.fodselsdatoer ? Object.values(soknad.fodselsdatoer)[0] : undefined;
    const fodselsdato = familiehendelse && familiehendelse.fodselsdato ? familiehendelse.fodselsdato : soknadFodselsdato;
    const termindato = familiehendelse && familiehendelse.termindato ? familiehendelse.termindato : soknad.termindato;
    return fodselsdato || termindato;
  }
  return familiehendelse && familiehendelse.omsorgsovertakelseDato ? familiehendelse.omsorgsovertakelseDato : soknad.omsorgsovertakelseDato;
});

const findTextCode = createSelector([
  (state, ownProps) => ownProps.soknad, (state, ownProps) => ownProps.gjeldendeFamiliehendelse], (soknad, familiehendelse) => {
  if (soknad.soknadType.kode === soknadType.FODSEL) {
    const soknadFodselsdato = soknad.fodselsdatoer ? Object.values(soknad.fodselsdatoer)[0] : undefined;
    const fodselsdato = familiehendelse && familiehendelse.fodselsdato ? familiehendelse.fodselsdato : soknadFodselsdato;
    return fodselsdato ? 'ErSoknadsfristVilkaretOppfyltForm.Fodselsdato' : 'ErSoknadsfristVilkaretOppfyltForm.Termindato';
  }
  return 'ErSoknadsfristVilkaretOppfyltForm.Omsorgsovertakelsesdato';
});

const formName = 'ErSoknadsfristVilkaretOppfyltForm';

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const {
    aksjonspunkter, vilkar, alleKodeverk, submitCallback,
  } = initialOwnProps;
  const vilkarCodes = aksjonspunkter.map((a) => a.vilkarType.kode);
  const onSubmit = (values) => submitCallback([transformValues(values, aksjonspunkter)]);
  const antallDagerSoknadLevertForSent = vilkar
    .find((v) => vilkarCodes.includes(v.vilkarType.kode)).merknadParametere.antallDagerSoeknadLevertForSent;
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);

  return (state, ownProps) => {
    const { behandlingId, behandlingVersjon } = ownProps;
    return {
      getKodeverknavn,
      onSubmit,
      antallDagerSoknadLevertForSent,
      initialValues: buildInitialValues(state, ownProps),
      dato: findDate(state, ownProps),
      textCode: findTextCode(state, ownProps),
      hasAksjonspunkt: aksjonspunkter.length > 0,
      ...behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'textCode', 'dato', 'erVilkarOk'),
    };
  };
};

export default connect(mapStateToPropsFactory)(injectIntl(behandlingForm({
  form: formName,
})(ErSoknadsfristVilkaretOppfyltFormImpl)));
