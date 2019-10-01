import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import Panel from 'nav-frontend-paneler';
import { Column, Row } from 'nav-frontend-grid';
import { Fieldset } from 'nav-frontend-skjema';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';
import moment from 'moment';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ISO_DATE_FORMAT, required } from '@fpsak-frontend/utils';
import { BehandlingspunktBegrunnelseTextField, injectKodeverk } from '@fpsak-frontend/fp-felles';
import {
  DateLabel, ElementWrapper, FadingPanel, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';

import { getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import behandlingsprosessSelectors from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/selectors/behandlingsprosessForstegangOgRevSelectors';
import { getFamiliehendelseGjeldende } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import {
  behandlingFormForstegangOgRevurdering,
  behandlingFormValueSelector,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';

import styles from './erSoknadsfristVilkaretOppfyltForm.less';

const findRadioButtonTextCode = (erVilkarOk) => (erVilkarOk ? 'SokersOpplysningspliktForm.VilkarOppfylt' : 'SokersOpplysningspliktForm.VilkarIkkeOppfylt');

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
  ...formProps
}) => (
  <FadingPanel>
    <form onSubmit={formProps.handleSubmit}>
      <Undertittel>{intl.formatMessage({ id: 'ErSoknadsfristVilkaretOppfyltForm.Soknadsfrist' })}</Undertittel>
      <span className="typo-normal">
        <FormattedMessage id="ErSoknadsfristVilkaretOppfyltForm.ApplicationReceivedPart1" />
        <span className={styles.days}>
          <FormattedMessage id="ErSoknadsfristVilkaretOppfyltForm.ApplicationReceivedPart2" values={{ numberOfDays: antallDagerSoknadLevertForSent }} />
        </span>
        <FormattedMessage id="ErSoknadsfristVilkaretOppfyltForm.ApplicationReceivedPart3" />
      (
        {(soknad.mottattDato && antallDagerSoknadLevertForSent)
        && <DateLabel dateString={findSoknadsfristDate(soknad.mottattDato, antallDagerSoknadLevertForSent)} />}
)
      </span>
      <Row>
        <Column xs="6">
          <Panel className={styles.panel}>
            <Fieldset legend={intl.formatMessage({ id: 'ErSoknadsfristVilkaretOppfyltForm.Consider' })}>
              <ul className={styles.hyphen}>
                <li><FormattedMessage id="ErSoknadsfristVilkaretOppfyltForm.Question1" /></li>
                <li><FormattedMessage id="ErSoknadsfristVilkaretOppfyltForm.Question2" /></li>
                <li><FormattedMessage id="ErSoknadsfristVilkaretOppfyltForm.Question3" /></li>
              </ul>
            </Fieldset>
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
      {!readOnly
        && (
        <Row>
          <Column xs="6">
            <RadioGroupField name="erVilkarOk" validate={[required]}>
              <RadioOption label={<FormattedHTMLMessage id={findRadioButtonTextCode(true)} />} value />
              <RadioOption label={<FormattedHTMLMessage id={findRadioButtonTextCode(false)} />} value={false} />
            </RadioGroupField>
          </Column>
        </Row>
        )}
      {readOnly
        && (
        <ElementWrapper>
          <RadioGroupField name="dummy" className={styles.text} readOnly={readOnly} isEdited={isEdited(hasAksjonspunkt, erVilkarOk)}>
            {[<RadioOption key="dummy" label={<FormattedHTMLMessage id={findRadioButtonTextCode(erVilkarOk)} />} value="" />]}
          </RadioGroupField>
          {showAvslagsarsak(erVilkarOk, behandlingsresultat.avslagsarsak)
          && <Normaltekst>{getKodeverknavn(behandlingsresultat.avslagsarsak, vilkarType.SOKNADFRISTVILKARET)}</Normaltekst>}
        </ElementWrapper>
        )}
      <BehandlingspunktBegrunnelseTextField readOnly={readOnly} />
      <BehandlingspunktSubmitButton
        formName={formProps.form}
        isReadOnly={readOnly}
        isSubmittable={!readOnlySubmitButton}
        isBehandlingFormSubmitting={isBehandlingFormSubmitting}
        isBehandlingFormDirty={isBehandlingFormDirty}
        hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
      />
    </form>
  </FadingPanel>
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


export const buildInitialValues = createSelector(
  [behandlingsprosessSelectors.getSelectedBehandlingspunktAksjonspunkter, behandlingsprosessSelectors.getSelectedBehandlingspunktStatus],
  (aksjonspunkter, status) => ({
    erVilkarOk: isAksjonspunktOpen(aksjonspunkter[0].status.kode) ? undefined : vilkarUtfallType.OPPFYLT === status,
    ...BehandlingspunktBegrunnelseTextField.buildInitialValues(aksjonspunkter),
  }),
);

const transformValues = (values, aksjonspunkter) => ({
  erVilkarOk: values.erVilkarOk,
  kode: aksjonspunkter[0].definisjon.kode,
  ...BehandlingspunktBegrunnelseTextField.transformValues(values),
});

const findDate = createSelector([behandlingSelectors.getSoknad, getFamiliehendelseGjeldende], (soknad, familiehendelse) => {
  if (soknad.soknadType.kode === soknadType.FODSEL) {
    const soknadFodselsdato = soknad.fodselsdatoer ? Object.values(soknad.fodselsdatoer)[0] : undefined;
    const fodselsdato = familiehendelse && familiehendelse.fodselsdato ? familiehendelse.fodselsdato : soknadFodselsdato;
    const termindato = familiehendelse && familiehendelse.termindato ? familiehendelse.termindato : soknad.termindato;
    return fodselsdato || termindato;
  }
  return familiehendelse && familiehendelse.omsorgsovertakelseDato ? familiehendelse.omsorgsovertakelseDato : soknad.omsorgsovertakelseDato;
});

const findTextCode = createSelector([behandlingSelectors.getSoknad, getFamiliehendelseGjeldende], (soknad, familiehendelse) => {
  if (soknad.soknadType.kode === soknadType.FODSEL) {
    const soknadFodselsdato = soknad.fodselsdatoer ? Object.values(soknad.fodselsdatoer)[0] : undefined;
    const fodselsdato = familiehendelse && familiehendelse.fodselsdato ? familiehendelse.fodselsdato : soknadFodselsdato;
    return fodselsdato ? 'ErSoknadsfristVilkaretOppfyltForm.Fodselsdato' : 'ErSoknadsfristVilkaretOppfyltForm.Termindato';
  }
  return 'ErSoknadsfristVilkaretOppfyltForm.Omsorgsovertakelsesdato';
});

const formName = 'ErSoknadsfristVilkaretOppfyltForm';

const mapStateToPropsFactory = (initialState, ownProps) => {
  const aksjonspunkter = behandlingsprosessSelectors.getSelectedBehandlingspunktAksjonspunkter(initialState);
  const vilkarCodes = aksjonspunkter.map((a) => a.vilkarType.kode);
  const onSubmit = (values) => ownProps.submitCallback([transformValues(values, aksjonspunkter)]);
  const antallDagerSoknadLevertForSent = behandlingSelectors.getBehandlingVilkar(initialState)
    .find((v) => vilkarCodes.includes(v.vilkarType.kode)).merknadParametere.antallDagerSoeknadLevertForSent;

  return (state) => ({
    onSubmit,
    antallDagerSoknadLevertForSent,
    initialValues: buildInitialValues(state),
    behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
    soknad: behandlingSelectors.getSoknad(state),
    dato: findDate(state),
    textCode: findTextCode(state),
    hasAksjonspunkt: aksjonspunkter.length > 0,
    ...behandlingFormValueSelector(formName)(state, 'textCode', 'dato', 'erVilkarOk'),
  });
};

const ErSoknadsfristVilkaretOppfyltForm = connect(mapStateToPropsFactory)(injectIntl(behandlingFormForstegangOgRevurdering({
  form: formName,
})(injectKodeverk(getAlleKodeverk)(ErSoknadsfristVilkaretOppfyltFormImpl))));

ErSoknadsfristVilkaretOppfyltForm.supports = (apCodes) => apCodes.includes(aksjonspunktCodes.SOKNADSFRISTVILKARET);

export default ErSoknadsfristVilkaretOppfyltForm;
