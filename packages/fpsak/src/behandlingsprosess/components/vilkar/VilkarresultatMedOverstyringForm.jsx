import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

import { isObject } from 'utils/objectUtils';
import FadingPanel from 'sharedComponents/FadingPanel';
import { getBehandlingsresultat, isBehandlingRevurderingFortsattMedlemskap, getBehandlingRevurderingAvFortsattMedlemskapFom }
  from 'behandling/behandlingSelectors';
import { behandlingForm, behandlingFormValueSelector } from 'behandling/behandlingForm';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import vilkarType from 'kodeverk/vilkarType';
import behandlingspunktCodes from 'behandlingsprosess/behandlingspunktCodes';
import aksjonspunktCode from 'kodeverk/aksjonspunktCodes';
import { DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import {
  getSelectedBehandlingspunktTitleCode, getSelectedBehandlingspunktAksjonspunkter, getSelectedBehandlingspunktStatus,
  getSelectedBehandlingspunkt, getIsSelectedBehandlingspunktOverridden, getSelectedBehandlingspunktVilkar,
  isSelectedBehandlingspunktOverrideReadOnly,
} from 'behandlingsprosess/behandlingsprosessSelectors';
import aksjonspunktStatus from 'kodeverk/aksjonspunktStatus';
import OverstyrVurderingChecker from 'behandlingsprosess/components/OverstyrVurderingChecker';
import OverstyrConfirmationForm from 'behandlingsprosess/components/OverstyrConfirmationForm';
import VilkarResultPicker from 'behandlingsprosess/components/vilkar/VilkarResultPicker';
import OverstyrConfirmVilkarButton from 'behandlingsprosess/components/OverstyrConfirmVilkarButton';
import { isForeldrepengerFagsak } from 'fagsak/fagsakSelectors';

import styles from './vilkarresultatMedOverstyringForm.less';

// TODO (TOR) Refaktorer komponent!

const behandlingspunktToAksjonspunktEngangsstonad = {
  [behandlingspunktCodes.FOEDSEL]: aksjonspunktCode.OVERSTYR_FODSELSVILKAR,
  [behandlingspunktCodes.ADOPSJON]: aksjonspunktCode.OVERSTYR_ADOPSJONSVILKAR,
  [behandlingspunktCodes.MEDLEMSKAP]: aksjonspunktCode.OVERSTYR_MEDLEMSKAPSVILKAR,
  [behandlingspunktCodes.SOEKNADSFRIST]: aksjonspunktCode.OVERSTYR_SOKNADSFRISTVILKAR,
};
const behandlingspunktToAksjonspunktForeldrepenger = {
  [behandlingspunktCodes.FOEDSEL]: {
    [vilkarType.FODSELSVILKARET_MOR]: aksjonspunktCode.OVERSTYR_FODSELSVILKAR,
    [vilkarType.FODSELSVILKARET_FAR]: aksjonspunktCode.OVERSTYR_FODSELSVILKAR_FAR_MEDMOR,
  },
  [behandlingspunktCodes.ADOPSJON]: aksjonspunktCode.OVERSTYRING_AV_ADOPSJONSVILKÅRET_FP,
  [behandlingspunktCodes.MEDLEMSKAP]: aksjonspunktCode.OVERSTYR_MEDLEMSKAPSVILKAR,
  [behandlingspunktCodes.SOEKNADSFRIST]: aksjonspunktCode.OVERSTYR_SOKNADSFRISTVILKAR,
  [behandlingspunktCodes.OPPTJENING]: aksjonspunktCode.OVERSTYRING_AV_OPPTJENINGSVILKARET,
};

const getApCode = (behandlingspunkt, isForeldrepenger, allVilkar) => {
  const apCode = isForeldrepenger
    ? behandlingspunktToAksjonspunktForeldrepenger[behandlingspunkt]
    : behandlingspunktToAksjonspunktEngangsstonad[behandlingspunkt];
  return isObject(apCode)
    ? apCode[allVilkar.map(v => v.vilkarType.kode).find(v => apCode[v])]
    : apCode;
};

const behandlingpunktToVilkar = {
  [behandlingspunktCodes.OPPTJENING]: vilkarType.OPPTJENINGSVILKARET,
};

const getCustomVilkarText = (state, behandlingspunkt, oppfylt) => {
  const customVilkarText = {};
  if (behandlingspunkt === behandlingspunktCodes.MEDLEMSKAP && isBehandlingRevurderingFortsattMedlemskap(state)) {
    const fom = getBehandlingRevurderingAvFortsattMedlemskapFom(state);
    customVilkarText.id = oppfylt ? 'VilkarResultPicker.VilkarOppfyltRevurderingFom' : 'VilkarResultPicker.VilkarIkkeOppfyltRevurderingFom';
    customVilkarText.values = { fom: moment(fom).format(DDMMYYYY_DATE_FORMAT) };
  }
  return customVilkarText.id ? customVilkarText : undefined;
};

/**
 * VilkarresultatForm
 *
 * Presentasjonskomponent. Viser resultat av vilkårskjøring når det ikke finnes tilknyttede aksjonspunkter.
 * Resultatet kan overstyres av Nav-ansatt med overstyr-rettighet.
 */
export const VilkarresultatMedOverstyringFormImpl = ({
  intl,
  behandlingspunktTitleCode,
  isOverstyrt,
  erVilkarOk,
  isReadOnly,
  customVilkarIkkeOppfyltText,
  customVilkarOppfyltText,
  apCode,
  avslagsarsaker,
  lovReferanse,
  hasAksjonspunkt,
  isSolvable,
  ...formProps
}) => (
  <FadingPanel>
    <form onSubmit={formProps.handleSubmit}>
      <div className={styles.headerContainer}>
        <div className={styles.textAlign}>
          <Undertittel>{intl.formatMessage({ id: behandlingspunktTitleCode })}</Undertittel>
          <Normaltekst>{lovReferanse}</Normaltekst>
        </div>
        <div className={styles.checkerAlign}>
          <OverstyrVurderingChecker aksjonspunktCode={apCode} resetValues={formProps.reset} />
        </div>
      </div>
      {isOverstyrt
      && <OverstyrConfirmationForm formProps={formProps} />
        }
      <VilkarResultPicker
        avslagsarsaker={avslagsarsaker}
        customVilkarIkkeOppfyltText={customVilkarIkkeOppfyltText}
        customVilkarOppfyltText={customVilkarOppfyltText}
        erVilkarOk={erVilkarOk}
        readOnly={isReadOnly || !isOverstyrt}
        hasAksjonspunkt={hasAksjonspunkt}
      />
      <OverstyrConfirmVilkarButton submitting={formProps.submitting} pristine={!isSolvable || formProps.pristine} />
    </form>
  </FadingPanel>
);

VilkarresultatMedOverstyringFormImpl.propTypes = {
  intl: intlShape.isRequired,
  isOverstyrt: PropTypes.bool,
  erVilkarOk: PropTypes.bool,
  customVilkarIkkeOppfyltText: PropTypes.shape({
    id: PropTypes.string.isRequired,
    values: PropTypes.shape(),
  }),
  customVilkarOppfyltText: PropTypes.shape({
    id: PropTypes.string.isRequired,
    values: PropTypes.shape(),
  }),
  isReadOnly: PropTypes.bool,
  aksjonspunktCode: PropTypes.string,
  lovReferanse: PropTypes.string,
  hasAksjonspunkt: PropTypes.bool,
  avslagsarsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  })).isRequired,
  ...formPropTypes,
};

VilkarresultatMedOverstyringFormImpl.defaultProps = {
  isOverstyrt: false,
  erVilkarOk: undefined,
  customVilkarIkkeOppfyltText: undefined,
  customVilkarOppfyltText: undefined,
  isReadOnly: false,
  aksjonspunktCode: undefined,
  lovReferanse: undefined,
  hasAksjonspunkt: false,
};

const buildInitialValues = createSelector(
  [getBehandlingsresultat, getSelectedBehandlingspunktAksjonspunkter, getSelectedBehandlingspunktStatus, getSelectedBehandlingspunkt,
    isForeldrepengerFagsak, getSelectedBehandlingspunktVilkar],
  (behandlingsresultat, aksjonspunkter, status, behandlingspunkt, isForeldrepenger, allVilkar) => {
    const apCode = getApCode(behandlingspunkt, isForeldrepenger, allVilkar);
    const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === apCode);
    return {
      isOverstyrt: aksjonspunkt !== undefined,
      ...VilkarResultPicker.buildInitialValues(behandlingsresultat, aksjonspunkter, status),
      ...OverstyrConfirmationForm.buildInitialValues(aksjonspunkt),
    };
  },
);

const transformValues = (values, apCode) => ({
  kode: apCode,
  ...VilkarResultPicker.transformValues(values),
  ...OverstyrConfirmationForm.transformValues(values),
});

const validate = values => VilkarResultPicker.validate(values.erVilkarOk, values.avslagCode);

const getVilkar = createSelector(
  [getSelectedBehandlingspunkt, getSelectedBehandlingspunktVilkar],
  (behandlingspunkt, allVilkar) => {
    const vtKode = behandlingpunktToVilkar[behandlingspunkt];
    return vtKode ? allVilkar.find(v => v.vilkarType.kode === vtKode) : allVilkar[0];
  },
);

const mapStateToProps = (state, ownProps) => {
  const behandlingspunkt = getSelectedBehandlingspunkt(state);
  const aksjonspunkter = getSelectedBehandlingspunktAksjonspunkter(state);
  const formName = `VilkarresultatForm_${behandlingspunkt}`;
  const apCode = getApCode(behandlingspunkt, isForeldrepengerFagsak(state), getSelectedBehandlingspunktVilkar(state));
  const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === apCode);
  const vilkar = getVilkar(state);
  const isSolvable = aksjonspunkt !== undefined
    ? !(aksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET && !aksjonspunkt.kanLoses) : false;
  const formData = { ...behandlingFormValueSelector(formName)(state, 'isOverstyrt', 'erVilkarOk') };
  const customVilkarIkkeOppfyltText = getCustomVilkarText(state, behandlingspunkt, false);
  const customVilkarOppfyltText = getCustomVilkarText(state, behandlingspunkt, true);

  return {
    apCode,
    customVilkarIkkeOppfyltText,
    customVilkarOppfyltText,
    lovReferanse: vilkar.lovReferanse,
    isSolvable: getIsSelectedBehandlingspunktOverridden(state) || isSolvable,
    hasAksjonspunkt: aksjonspunkt !== undefined,
    avslagsarsaker: getKodeverk(kodeverkTyper.AVSLAGSARSAK)(state)[vilkar.vilkarType.kode],
    isReadOnly: isSelectedBehandlingspunktOverrideReadOnly(state),
    behandlingspunktTitleCode: getSelectedBehandlingspunktTitleCode(state),
    form: formName,
    ...formData,
    initialValues: buildInitialValues(state),
    onSubmit: values => ownProps.submitCallback([transformValues(values, apCode)]),
    validate: values => validate(values),
  };
};

const form = behandlingForm({ enableReinitialize: true })(VilkarresultatMedOverstyringFormImpl);
const VilkarresultatMedOverstyringForm = injectIntl(connect(mapStateToProps)(form));

const getAllApCodes = (behandlingspunkt) => {
  const esAp = behandlingspunktToAksjonspunktEngangsstonad[behandlingspunkt];
  const apCodes = esAp ? [esAp] : [];
  const fpAps = behandlingspunktToAksjonspunktForeldrepenger[behandlingspunkt];
  if (isObject(fpAps)) {
    return apCodes.concat(Object.values(fpAps));
  } if (fpAps) {
    return apCodes.concat([fpAps]);
  }
  return apCodes;
};

VilkarresultatMedOverstyringForm.supports = (apCodes, behandlingspunkt) => {
  const bpApCodes = getAllApCodes(behandlingspunkt);
  return (apCodes.length === 0 && bpApCodes.length > 0) || apCodes.some(apCode => bpApCodes.includes(apCode));
};

export default VilkarresultatMedOverstyringForm;
