import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import moment from 'moment';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';

import {
  behandlingForm, behandlingFormValueSelector, BehandlingspunktBegrunnelseTextField, ProsessPanelTemplate,
  getKodeverknavnFn,
} from '@fpsak-frontend/fp-felles';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import {
  ElementWrapper, Table, TableColumn, TableRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT, isObject, required } from '@fpsak-frontend/utils';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import dokumentTypeId from '@fpsak-frontend/kodeverk/src/dokumentTypeId';

import styles from './sokersOpplysningspliktForm.less';

const formName = 'SokersOpplysningspliktForm';

const orgPrefix = 'org_';
const aktørPrefix = 'aktør_';

const findRadioButtonTextCode = (erVilkarOk) => (erVilkarOk ? 'SokersOpplysningspliktForm.VilkarOppfylt' : 'SokersOpplysningspliktForm.VilkarIkkeOppfylt');
const getLabel = (intl) => (
  <div>
    <div><FormattedHTMLMessage id={findRadioButtonTextCode(false)} /></div>
    <div>{intl.formatMessage({ id: 'SokersOpplysningspliktForm.VilkarIkkeOppfyltMerInfo' })}</div>
  </div>
);
const capitalizeFirstLetters = (navn) => navn.toLowerCase().split(' ').map((w) => w.charAt(0).toUpperCase() + w.substr(1)).join(' ');

const lagArbeidsgiverNavnOgFødselsdatoTekst = (arbeidsgiver) => `${capitalizeFirstLetters(arbeidsgiver.navn)} (${moment(arbeidsgiver.fødselsdato)
  .format(DDMMYYYY_DATE_FORMAT)})`;

const lagArbeidsgiverNavnOgOrgnrTekst = (arbeidsgiver) => `${capitalizeFirstLetters(arbeidsgiver.navn)} (${arbeidsgiver.organisasjonsnummer})`;

const formatArbeidsgiver = (arbeidsgiver) => {
  if (!arbeidsgiver) {
    return '';
  }
  if (arbeidsgiver.fødselsdato) {
    return lagArbeidsgiverNavnOgFødselsdatoTekst(arbeidsgiver);
  }
  return lagArbeidsgiverNavnOgOrgnrTekst(arbeidsgiver);
};

const isVilkarOppfyltDisabled = (hasSoknad, inntektsmeldingerSomIkkeKommer) => !hasSoknad || Object.values(inntektsmeldingerSomIkkeKommer).some((vd) => !vd);

/**
 * SokersOpplysningspliktForm
 *
 * Presentasjonskomponent. Informasjon om søkers informasjonsplikt er godkjent eller avvist.
 */
export const SokersOpplysningspliktFormImpl = ({
  intl,
  readOnly,
  readOnlySubmitButton,
  behandlingsresultat,
  hasSoknad,
  erVilkarOk,
  originalErVilkarOk,
  hasAksjonspunkt,
  manglendeVedlegg,
  dokumentTypeIds,
  inntektsmeldingerSomIkkeKommer,
  getKodeverknavn,
  behandlingId,
  behandlingVersjon,
  ...formProps
}) => (
  <ProsessPanelTemplate
    titleCode="SokersOpplysningspliktForm.SokersOpplysningsplikt"
    isAksjonspunktOpen={!readOnlySubmitButton}
    formProps={formProps}
    isDirty={hasAksjonspunkt ? formProps.dirty : erVilkarOk !== formProps.initialValues.erVilkarOk}
    readOnlySubmitButton={hasSoknad ? readOnlySubmitButton : !formProps.dirty || readOnlySubmitButton}
    readOnly={readOnly}
    behandlingId={behandlingId}
    behandlingVersjon={behandlingVersjon}
    originalErVilkarOk={originalErVilkarOk}
  >
    {manglendeVedlegg.length > 0 && (
      <ElementWrapper>
        <VerticalSpacer twentyPx />
        <Normaltekst><FormattedMessage id="SokersOpplysningspliktForm.ManglendeDokumentasjon" /></Normaltekst>
        <VerticalSpacer eightPx />
        <Row>
          <Column xs="11">
            <Table noHover>
              {manglendeVedlegg.map((vedlegg) => (
                <TableRow key={vedlegg.dokumentType.kode + (vedlegg.arbeidsgiver ? vedlegg.arbeidsgiver.organisasjonsnummer : '')}>
                  <TableColumn>
                    {dokumentTypeIds.find((dti) => dti.kode === vedlegg.dokumentType.kode).navn}
                  </TableColumn>
                  <TableColumn>
                    {vedlegg.dokumentType.kode === dokumentTypeId.INNTEKTSMELDING
                    && formatArbeidsgiver(vedlegg.arbeidsgiver)}
                  </TableColumn>
                </TableRow>
              ))}
            </Table>
          </Column>
        </Row>
      </ElementWrapper>
    )}
    <BehandlingspunktBegrunnelseTextField readOnly={readOnly} />
    {!readOnly && (
      <Row>
        <Column xs="6">
          <RadioGroupField name="erVilkarOk" validate={[required]}>
            <RadioOption
              label={(
                <FormattedHTMLMessage
                  id={findRadioButtonTextCode(true)}
                />
              )}
              value
              disabled={isVilkarOppfyltDisabled(hasSoknad, inntektsmeldingerSomIkkeKommer)}
            />
            <RadioOption label={getLabel(intl)} value={false} />
          </RadioGroupField>
        </Column>
      </Row>
    )}
    {readOnly && (
      <ElementWrapper>
        <div className={styles.radioIE}>
          <RadioGroupField name="dummy" readOnly={readOnly} isEdited={hasAksjonspunkt && (erVilkarOk !== undefined)}>
            {[<RadioOption key="dummy" label={<FormattedHTMLMessage id={findRadioButtonTextCode(erVilkarOk)} />} value="" />]}
          </RadioGroupField>
          {erVilkarOk === false && behandlingsresultat.avslagsarsak
        && <Normaltekst className={styles.radioIE}>{getKodeverknavn(behandlingsresultat.avslagsarsak, vilkarType.SOKERSOPPLYSNINGSPLIKT)}</Normaltekst>}
        </div>
      </ElementWrapper>
    )}
  </ProsessPanelTemplate>
);

SokersOpplysningspliktFormImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  /**
   * Skal input-felter vises eller ikke
   */
  readOnly: PropTypes.bool.isRequired,
  /**
   * Skal knapp for å bekrefte data være trykkbar
   */
  readOnlySubmitButton: PropTypes.bool.isRequired,
  hasSoknad: PropTypes.bool,
  erVilkarOk: PropTypes.bool,
  originalErVilkarOk: PropTypes.bool,
  hasAksjonspunkt: PropTypes.bool,
  behandlingsresultat: PropTypes.shape(),
  manglendeVedlegg: PropTypes.arrayOf(PropTypes.shape()),
  dokumentTypeIds: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  inntektsmeldingerSomIkkeKommer: PropTypes.shape(),
  getKodeverknavn: PropTypes.func.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
};

SokersOpplysningspliktFormImpl.defaultProps = {
  hasSoknad: undefined,
  erVilkarOk: undefined,
  originalErVilkarOk: undefined,
  hasAksjonspunkt: false,
  behandlingsresultat: {},
  manglendeVedlegg: [],
  inntektsmeldingerSomIkkeKommer: {},
};

export const getSortedManglendeVedlegg = createSelector([
  (state, ownProps) => ownProps.soknad], (soknad) => (soknad && soknad.manglendeVedlegg
  ? soknad.manglendeVedlegg.slice().sort((mv1) => (mv1.dokumentType.kode === dokumentTypeId.DOKUMENTASJON_AV_TERMIN_ELLER_FØDSEL ? 1 : -1))
  : []));

const hasSoknad = createSelector([(state, ownProps) => ownProps.soknad], (soknad) => soknad !== null && isObject(soknad));

const lagArbeidsgiverKey = (arbeidsgiver) => {
  if (arbeidsgiver.aktørId) {
    return `${aktørPrefix}${arbeidsgiver.aktørId}`;
  } return `${orgPrefix}${arbeidsgiver.organisasjonsnummer}`;
};

export const buildInitialValues = createSelector(
  [getSortedManglendeVedlegg,
    hasSoknad,
    (state, ownProps) => ownProps.status,
    (state, ownProps) => ownProps.aksjonspunkter],
  (manglendeVedlegg, soknadExists, status, aksjonspunkter) => {
    const aksjonspunkt = aksjonspunkter.length > 0 ? aksjonspunkter[0] : undefined;
    const isOpenAksjonspunkt = aksjonspunkt && isAksjonspunktOpen(aksjonspunkt.status.kode);
    const isVilkarGodkjent = soknadExists && vilkarUtfallType.OPPFYLT === status;

    const inntektsmeldingerSomIkkeKommer = manglendeVedlegg
      .filter((mv) => mv.dokumentType.kode === dokumentTypeId.INNTEKTSMELDING)
      .reduce((acc, mv) => ({
        ...acc,
        [lagArbeidsgiverKey(mv.arbeidsgiver)]: mv.brukerHarSagtAtIkkeKommer,
      }), {});

    return {
      inntektsmeldingerSomIkkeKommer,
      erVilkarOk: isOpenAksjonspunkt && soknadExists ? undefined : isVilkarGodkjent,
      aksjonspunktKode: aksjonspunkt ? aksjonspunkt.definisjon.kode : aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_OVST,
      hasAksjonspunkt: aksjonspunkt !== undefined,
      ...BehandlingspunktBegrunnelseTextField.buildInitialValues(aksjonspunkter),
    };
  },
);

const transformValues = (values, manglendeVedlegg) => {
  const arbeidsgivere = manglendeVedlegg
    .filter((mv) => mv.dokumentType.kode === dokumentTypeId.INNTEKTSMELDING)
    .map((mv) => mv.arbeidsgiver);
  return {
    kode: values.aksjonspunktKode,
    erVilkarOk: values.erVilkarOk,
    inntektsmeldingerSomIkkeKommer: arbeidsgivere.map((ag) => ({
      organisasjonsnummer: ag.aktørId ? null : ag.organisasjonsnummer, // backend sender fødselsdato i orgnummer feltet for privatpersoner... fiks dette
      aktørId: ag.aktørId,
      brukerHarSagtAtIkkeKommer: values.inntektsmeldingerSomIkkeKommer[lagArbeidsgiverKey(ag)],
    }), {}),
    ...BehandlingspunktBegrunnelseTextField.transformValues(values),
  };
};

const submitSelector = createSelector(
  [getSortedManglendeVedlegg, (state, props) => props.submitCallback],
  (manglendeVedlegg, submitCallback) => (values) => submitCallback([transformValues(values, manglendeVedlegg)]),
);

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const getKodeverknavn = getKodeverknavnFn(initialOwnProps.alleKodeverk, kodeverkTyper);
  const isOpenAksjonspunkt = initialOwnProps.aksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode));
  const erVilkarOk = isOpenAksjonspunkt ? undefined : vilkarUtfallType.OPPFYLT === initialOwnProps.status;

  return (state, ownProps) => {
    const { behandlingId, behandlingVersjon, alleKodeverk } = ownProps;
    return {
      getKodeverknavn,
      onSubmit: submitSelector(state, ownProps),
      hasSoknad: hasSoknad(state, ownProps),
      originalErVilkarOk: erVilkarOk,
      dokumentTypeIds: alleKodeverk[kodeverkTyper.DOKUMENT_TYPE_ID],
      manglendeVedlegg: getSortedManglendeVedlegg(state, ownProps),
      initialValues: buildInitialValues(state, ownProps),
      ...behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'hasAksjonspunkt', 'erVilkarOk', 'inntektsmeldingerSomIkkeKommer'),
    };
  };
};


export default connect(mapStateToPropsFactory)(injectIntl(behandlingForm({
  form: formName,
})(SokersOpplysningspliktFormImpl)));
