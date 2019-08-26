import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import {
  FormattedHTMLMessage, FormattedMessage, injectIntl, intlShape,
} from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { BehandlingspunktBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import { behandlingspunktCodes, injectKodeverk } from '@fpsak-frontend/fp-felles';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import {
  ElementWrapper, Table, TableRow, TableColumn, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { required, isObject } from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import dokumentTypeId from '@fpsak-frontend/kodeverk/src/dokumentTypeId';

import BpPanelTemplate from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/vilkar/BpPanelTemplate';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import {
  behandlingFormForstegangOgRevurdering, behandlingFormValueSelector,
} from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import { getKodeverk, getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import behandlingsprosessSelectors from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/selectors/behandlingsprosessForstegangOgRevSelectors';

import styles from './sokersOpplysningspliktForm.less';

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
  getKodeverknavn,
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
        <div className={styles.radioIE}>
          <RadioGroupField name="dummy" readOnly={readOnly} isEdited={hasAksjonspunkt && (erVilkarOk !== undefined)}>
            {[<RadioOption key="dummy" label={<FormattedHTMLMessage id={findRadioButtonTextCode(erVilkarOk)} />} value="" />]}
          </RadioGroupField>
          {erVilkarOk === false && behandlingsresultat.avslagsarsak
        && <Normaltekst className={styles.radioIE}>{getKodeverknavn(behandlingsresultat.avslagsarsak, vilkarType.SOKERSOPPLYSNINGSPLIKT)}</Normaltekst>
      }
        </div>
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
  getKodeverknavn: PropTypes.func.isRequired,
};

SokersOpplysningspliktFormImpl.defaultProps = {
  hasSoknad: undefined,
  erVilkarOk: undefined,
  hasAksjonspunkt: false,
  behandlingsresultat: {},
  manglendeVedlegg: [],
  inntektsmeldingerSomIkkeKommer: {},
};

export const getSortedManglendeVedlegg = createSelector([behandlingSelectors.getSoknad], soknad => (soknad && soknad.manglendeVedlegg
  ? soknad.manglendeVedlegg.slice().sort(mv1 => (mv1.dokumentType.kode === dokumentTypeId.DOKUMENTASJON_AV_TERMIN_ELLER_FØDSEL ? 1 : -1))
  : []));

const hasSoknad = createSelector([behandlingSelectors.getSoknad], soknad => soknad !== null && isObject(soknad));

export const buildInitialValues = createSelector(
  [getSortedManglendeVedlegg, hasSoknad, behandlingsprosessSelectors.getSelectedBehandlingspunktStatus,
    behandlingsprosessSelectors.getSelectedBehandlingspunktAksjonspunkter],
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

const mapStateToPropsFactory = (initialState, ownProps) => {
  const onSubmit = values => ownProps.submitCallback([transformValues(values)]);
  return state => ({
    onSubmit,
    hasSoknad: hasSoknad(state),
    behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
    dokumentTypeIds: getKodeverk(kodeverkTyper.DOKUMENT_TYPE_ID)(state),
    manglendeVedlegg: getSortedManglendeVedlegg(state),
    initialValues: buildInitialValues(state),
    ...behandlingFormValueSelector(formName)(state, 'hasAksjonspunkt', 'erVilkarOk', 'inntektsmeldingerSomIkkeKommer'),
  });
};

const SokersOpplysningspliktForm = connect(mapStateToPropsFactory)(injectIntl(behandlingFormForstegangOgRevurdering({
  form: formName,
})(injectKodeverk(getAlleKodeverk)(SokersOpplysningspliktFormImpl))));

SokersOpplysningspliktForm.supports = behandlingspunkt => behandlingspunkt === behandlingspunktCodes.OPPLYSNINGSPLIKT;

export default SokersOpplysningspliktForm;
