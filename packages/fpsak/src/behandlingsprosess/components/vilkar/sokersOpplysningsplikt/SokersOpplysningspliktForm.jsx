import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { change } from 'redux-form';
import { createSelector } from 'reselect';
import {
  FormattedHTMLMessage, FormattedMessage, injectIntl, intlShape,
} from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';

import BpPanelTemplate from 'behandlingsprosess/components/vilkar/BpPanelTemplate';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { getKodeverk } from 'kodeverk/duck';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import { getBehandlingsresultat, getSoknad, getBehandlingVersjon } from 'behandling/behandlingSelectors';
import { behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix } from 'behandling/behandlingForm';
import { getSelectedBehandlingId } from 'behandling/duck';
import { isAksjonspunktOpen } from 'kodeverk/aksjonspunktStatus';
import vilkarUtfallType from 'kodeverk/vilkarUtfallType';
import { CheckboxField, RadioGroupField, RadioOption } from 'form/Fields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { isObject } from 'utils/objectUtils';
import { required } from 'utils/validation/validators';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import dokumentTypeId from 'kodeverk/dokumentTypeId';
import behandlingspunktCodes from 'behandlingsprosess/behandlingspunktCodes';
import BehandlingspunktBegrunnelseTextField from 'behandlingsprosess/components/BehandlingspunktBegrunnelseTextField';

import {
  getSelectedBehandlingspunktAksjonspunkter,
  getSelectedBehandlingspunktStatus,
} from 'behandlingsprosess/behandlingsprosessSelectors';

const formName = 'SokersOpplysningspliktForm';

const orgPrefix = 'org_';
const findRadioButtonTextCode = erVilkarOk => (erVilkarOk ? 'SokersOpplysningspliktForm.VilkarOppfylt' : 'SokersOpplysningspliktForm.VilkarIkkeOppfylt');
const getLabel = intl => (
  <div>
    <div><FormattedHTMLMessage id={findRadioButtonTextCode(false)} /></div>
    <div>{intl.formatMessage({ id: 'SokersOpplysningspliktForm.VilkarIkkeOppfyltMerInfo' })}</div>
  </div>
);
const capitalizeFirstLetters = navn => navn.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.substr(1)).join(' ');
const formatArbeidsgiver = arbeidsgiver => (arbeidsgiver
  ? `${capitalizeFirstLetters(arbeidsgiver.navn)} (${arbeidsgiver.organisasjonsnummer})`
  : '');
const isVilkarOppfyltDisabled = (hasSoknad, inntektsmeldingerSomIkkeKommer) => !hasSoknad || Object.values(inntektsmeldingerSomIkkeKommer).some(vd => !vd);

const getCheckboxChangeHandler = (erVilkarOk, reduxFormChange, behandlingFormPrefix) => (e, isSelected) => {
  if (erVilkarOk && !isSelected) {
    reduxFormChange(`${behandlingFormPrefix}.${formName}`, 'erVilkarOk', null);
  }
};

/**
 * SokersOpplysningspliktForm
 *
 * Presentasjonskomponent. Informasjon om søkers informasjonsplikt er godkjent eller avvist.
 */
export const SokersOpplysningspliktFormImpl = ({
  intl,
  handleSubmit,
  readOnly,
  readOnlySubmitButton,
  behandlingsresultat,
  hasSoknad,
  erVilkarOk,
  hasAksjonspunkt,
  manglendeVedlegg,
  dokumentTypeIds,
  inntektsmeldingerSomIkkeKommer,
  reduxFormChange,
  behandlingFormPrefix,
  ...formProps
}) => (
  <BpPanelTemplate
    handleSubmit={handleSubmit}
    titleCode="SokersOpplysningspliktForm.SokersOpplysningsplikt"
    isAksjonspunktOpen={!readOnlySubmitButton}
    aksjonspunktHelpTexts={['SokersOpplysningspliktForm.UtfyllendeOpplysninger']}
    formProps={formProps}
    readOnlySubmitButton={hasSoknad ? readOnlySubmitButton : !formProps.dirty || readOnlySubmitButton}
    isDirty={hasAksjonspunkt ? formProps.dirty : erVilkarOk !== formProps.initialValues.erVilkarOk}
    readOnly={readOnly}
  >
    {manglendeVedlegg.length > 0
      && (
      <ElementWrapper>
        <VerticalSpacer twentyPx />
        <Normaltekst><FormattedMessage id="SokersOpplysningspliktForm.ManglendeDokumentasjon" /></Normaltekst>
        <VerticalSpacer eightPx />
        <Row>
          <Column xs="11">
            <Table noHover>
              {manglendeVedlegg.map(vedlegg => (
                <TableRow key={vedlegg.dokumentType.kode + (vedlegg.arbeidsgiver ? vedlegg.arbeidsgiver.organisasjonsnummer : '')}>
                  <TableColumn>
                    {dokumentTypeIds.find(dti => dti.kode === vedlegg.dokumentType.kode).navn}
                  </TableColumn>
                  <TableColumn>
                    {vedlegg.dokumentType.kode === dokumentTypeId.INNTEKTSMELDING
                    && formatArbeidsgiver(vedlegg.arbeidsgiver)
                  }
                  </TableColumn>
                  <TableColumn>
                    {vedlegg.dokumentType.kode === dokumentTypeId.INNTEKTSMELDING
                    && (
                    <CheckboxField
                      label={intl.formatMessage({ id: 'SokersOpplysningspliktForm.DokumentasjonKommerIkke' })}
                      name={`inntektsmeldingerSomIkkeKommer.${orgPrefix}${vedlegg.arbeidsgiver.organisasjonsnummer}`}
                      disabled={readOnly}
                      onChange={getCheckboxChangeHandler(erVilkarOk, reduxFormChange, behandlingFormPrefix)}
                    />
                    )
                  }
                  </TableColumn>
                </TableRow>
              ))
      }
            </Table>
          </Column>
        </Row>
      </ElementWrapper>
      )
    }
    <BehandlingspunktBegrunnelseTextField readOnly={readOnly} />
    {!readOnly
      && (
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
      )
    }
    {readOnly
      && (
      <ElementWrapper>
        <RadioGroupField name="dummy" readOnly={readOnly} isEdited={hasAksjonspunkt && (erVilkarOk !== undefined)}>
          {[<RadioOption key="dummy" label={<FormattedHTMLMessage id={findRadioButtonTextCode(erVilkarOk)} />} value="" />]}
        </RadioGroupField>
        {erVilkarOk === false && behandlingsresultat.avslagsarsak
        && <Normaltekst>{behandlingsresultat.avslagsarsak.navn}</Normaltekst>
      }
      </ElementWrapper>
      )
    }
  </BpPanelTemplate>
);

SokersOpplysningspliktFormImpl.propTypes = {
  intl: intlShape.isRequired,
  handleSubmit: PropTypes.func.isRequired,
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
  hasAksjonspunkt: PropTypes.bool,
  behandlingsresultat: PropTypes.shape(),
  manglendeVedlegg: PropTypes.arrayOf(PropTypes.shape()),
  dokumentTypeIds: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  inntektsmeldingerSomIkkeKommer: PropTypes.shape(),
  reduxFormChange: PropTypes.func.isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
};

SokersOpplysningspliktFormImpl.defaultProps = {
  hasSoknad: undefined,
  erVilkarOk: undefined,
  hasAksjonspunkt: false,
  behandlingsresultat: {},
  manglendeVedlegg: [],
  inntektsmeldingerSomIkkeKommer: {},
};

export const getSortedManglendeVedlegg = createSelector([getSoknad], soknad => (soknad && soknad.manglendeVedlegg
  ? soknad.manglendeVedlegg.slice().sort(mv1 => (mv1.dokumentType.kode === dokumentTypeId.DOKUMENTASJON_AV_TERMIN_ELLER_FØDSEL ? 1 : 0))
  : []));

const hasSoknad = createSelector([getSoknad], soknad => soknad !== null && isObject(soknad));

export const buildInitialValues = createSelector(
  [getSortedManglendeVedlegg, hasSoknad, getSelectedBehandlingspunktStatus, getSelectedBehandlingspunktAksjonspunkter],
  (manglendeVedlegg, soknadExists, status, aksjonspunkter) => {
    const aksjonspunkt = aksjonspunkter.length > 0 ? aksjonspunkter[0] : undefined;
    const isOpenAksjonspunkt = aksjonspunkt && isAksjonspunktOpen(aksjonspunkt.status.kode);
    const isVilkarGodkjent = soknadExists && vilkarUtfallType.OPPFYLT === status;

    const inntektsmeldingerSomIkkeKommer = manglendeVedlegg
      .filter(mv => mv.dokumentType.kode === dokumentTypeId.INNTEKTSMELDING)
      .reduce((acc, mv) => ({
        ...acc,
        [`${orgPrefix}${mv.arbeidsgiver.organisasjonsnummer}`]: mv.brukerHarSagtAtIkkeKommer,
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

const transformValues = values => ({
  kode: values.aksjonspunktKode,
  erVilkarOk: values.erVilkarOk,
  inntektsmeldingerSomIkkeKommer: Object.keys(values.inntektsmeldingerSomIkkeKommer).map(key => ({
    organisasjonsnummer: key.replace(orgPrefix, ''),
    brukerHarSagtAtIkkeKommer: values.inntektsmeldingerSomIkkeKommer[key],
  }), {}),
  ...BehandlingspunktBegrunnelseTextField.transformValues(values),
});

const mapStateToProps = (state, ownProps) => ({
  hasSoknad: hasSoknad(state),
  behandlingsresultat: getBehandlingsresultat(state),
  dokumentTypeIds: getKodeverk(kodeverkTyper.DOKUMENT_TYPE_ID)(state),
  manglendeVedlegg: getSortedManglendeVedlegg(state),
  initialValues: buildInitialValues(state),
  behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state)),
  onSubmit: values => ownProps.submitCallback([transformValues(values)]),
  ...behandlingFormValueSelector(formName)(state, 'hasAksjonspunkt', 'erVilkarOk', 'inntektsmeldingerSomIkkeKommer'),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    reduxFormChange: change,
  }, dispatch),
});

const SokersOpplysningspliktForm = connect(mapStateToProps, mapDispatchToProps)(injectIntl(behandlingForm({
  form: formName,
})(SokersOpplysningspliktFormImpl)));

SokersOpplysningspliktForm.supports = behandlingspunkt => behandlingspunkt === behandlingspunktCodes.OPPLYSNINGSPLIKT;

export default SokersOpplysningspliktForm;
