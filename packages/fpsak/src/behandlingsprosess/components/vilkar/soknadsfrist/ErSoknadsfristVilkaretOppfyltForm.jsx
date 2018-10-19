import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import {
  injectIntl, intlShape, FormattedMessage, FormattedHTMLMessage,
} from 'react-intl';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import Panel from 'nav-frontend-paneler';
import { Row, Column } from 'nav-frontend-grid';
import { Fieldset } from 'nav-frontend-skjema';
import { Undertekst, Undertittel, Normaltekst } from 'nav-frontend-typografi';
import { ISO_DATE_FORMAT } from 'utils/formats';
import moment from 'moment';

import ElementWrapper from 'sharedComponents/ElementWrapper';
import FadingPanel from 'sharedComponents/FadingPanel';
import { getSelectedBehandlingspunktAksjonspunkter, getSelectedBehandlingspunktStatus } from 'behandlingsprosess/behandlingsprosessSelectors';
import {
  getBehandlingsresultat, getBehandlingVilkar, getSoknad, getFamiliehendelse,
} from 'behandling/behandlingSelectors';
import { behandlingForm, behandlingFormValueSelector } from 'behandling/behandlingForm';
import { RadioGroupField, RadioOption } from 'form/Fields';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import vilkarUtfallType from 'kodeverk/vilkarUtfallType';
import DateLabel from 'sharedComponents/DateLabel';
import { required } from 'utils/validation/validators';
import { isAksjonspunktOpen } from 'kodeverk/aksjonspunktStatus';
import soknadType from 'kodeverk/soknadType';
import BehandlingspunktBegrunnelseTextField from 'behandlingsprosess/components/BehandlingspunktBegrunnelseTextField';
import BehandlingspunktSubmitButton from 'behandlingsprosess/components/BehandlingspunktSubmitButton';

import styles from './erSoknadsfristVilkaretOppfyltForm.less';

const findRadioButtonTextCode = erVilkarOk => (erVilkarOk ? 'SokersOpplysningspliktForm.VilkarOppfylt' : 'SokersOpplysningspliktForm.VilkarIkkeOppfylt');

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
        )
      }
      {readOnly
        && (
        <ElementWrapper>
          <RadioGroupField name="dummy" className={styles.text} readOnly={readOnly} isEdited={isEdited(hasAksjonspunkt, erVilkarOk)}>
            {[<RadioOption key="dummy" label={<FormattedHTMLMessage id={findRadioButtonTextCode(erVilkarOk)} />} value="" />]}
          </RadioGroupField>
          {showAvslagsarsak(erVilkarOk, behandlingsresultat.avslagsarsak)
          && <Normaltekst>{behandlingsresultat.avslagsarsak.navn}</Normaltekst>
          }
        </ElementWrapper>
        )
      }
      <BehandlingspunktBegrunnelseTextField readOnly={readOnly} />
      <BehandlingspunktSubmitButton formName={formProps.form} isReadOnly={readOnly} isSubmittable={!readOnlySubmitButton} />
    </form>
  </FadingPanel>
);

ErSoknadsfristVilkaretOppfyltFormImpl.propTypes = {
  intl: intlShape.isRequired,
  /**
   * Skal knapp for å bekrefte data være trykkbar
   */
  readOnlySubmitButton: PropTypes.bool.isRequired,
  antallDagerSoknadLevertForSent: PropTypes.string,
  textCode: PropTypes.string.isRequired,
  dato: PropTypes.string,
  behandlingsresultat: PropTypes.shape(),
  hasAksjonspunkt: PropTypes.bool,
  ...formPropTypes,
};

ErSoknadsfristVilkaretOppfyltFormImpl.defaultProps = {
  antallDagerSoknadLevertForSent: undefined,
  dato: undefined,
  behandlingsresultat: {},
  hasAksjonspunkt: false,
};


export const buildInitialValues = createSelector(
  [getSelectedBehandlingspunktAksjonspunkter, getSelectedBehandlingspunktStatus],
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

const findDate = createSelector([getSoknad, getFamiliehendelse], (soknad, familiehendelse) => {
  if (soknad.soknadType.kode === soknadType.FODSEL) {
    const soknadFodselsdato = soknad.fodselsdatoer ? Object.values(soknad.fodselsdatoer)[0] : undefined;
    const fodselsdato = familiehendelse && familiehendelse.fodselsdato ? familiehendelse.fodselsdato : soknadFodselsdato;
    const termindato = familiehendelse && familiehendelse.termindato ? familiehendelse.termindato : soknad.termindato;
    return fodselsdato || termindato;
  }
  return familiehendelse && familiehendelse.omsorgsovertakelseDato ? familiehendelse.omsorgsovertakelseDato : soknad.omsorgsovertakelseDato;
});

const findTextCode = createSelector([getSoknad, getFamiliehendelse], (soknad, familiehendelse) => {
  if (soknad.soknadType.kode === soknadType.FODSEL) {
    const soknadFodselsdato = soknad.fodselsdatoer ? Object.values(soknad.fodselsdatoer)[0] : undefined;
    const fodselsdato = familiehendelse && familiehendelse.fodselsdato ? familiehendelse.fodselsdato : soknadFodselsdato;
    return fodselsdato ? 'ErSoknadsfristVilkaretOppfyltForm.Fodselsdato' : 'ErSoknadsfristVilkaretOppfyltForm.Termindato';
  }
  return 'ErSoknadsfristVilkaretOppfyltForm.Omsorgsovertakelsesdato';
});

const formName = 'ErSoknadsfristVilkaretOppfyltForm';

const mapStateToProps = (state, initialProps) => {
  const aksjonspunkter = getSelectedBehandlingspunktAksjonspunkter(state);
  const vilkarCodes = aksjonspunkter.map(a => a.vilkarType.kode);
  return {
    initialValues: buildInitialValues(state),
    onSubmit: values => initialProps.submitCallback([transformValues(values, aksjonspunkter)]),
    behandlingsresultat: getBehandlingsresultat(state),
    soknad: getSoknad(state),
    antallDagerSoknadLevertForSent: getBehandlingVilkar(state)
      .find(v => vilkarCodes.includes(v.vilkarType.kode)).merknadParametere.antallDagerSoeknadLevertForSent,
    dato: findDate(state),
    textCode: findTextCode(state),
    hasAksjonspunkt: aksjonspunkter.length > 0,
    ...behandlingFormValueSelector(formName)(state, 'textCode', 'dato', 'erVilkarOk'),
  };
};

const ErSoknadsfristVilkaretOppfyltForm = connect(mapStateToProps)(injectIntl(behandlingForm({
  form: formName,
})(ErSoknadsfristVilkaretOppfyltFormImpl)));

ErSoknadsfristVilkaretOppfyltForm.supports = apCodes => apCodes.includes(aksjonspunktCodes.SOKNADSFRISTVILKARET);

export default ErSoknadsfristVilkaretOppfyltForm;
