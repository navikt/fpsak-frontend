import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

import { FadingPanel } from '@fpsak-frontend/shared-components';
import { getBehandlingsresultat, isBehandlingRevurderingFortsattMedlemskap }
  from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { behandlingForm, behandlingFormValueSelector } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import { getFagsakYtelseType, getKodeverk, isForeldrepengerFagsak } from 'behandlingForstegangOgRevurdering/src/duck';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import {
  getSelectedBehandlingspunktTitleCode, getSelectedBehandlingspunktAksjonspunkter, getSelectedBehandlingspunktStatus,
  getSelectedBehandlingspunkt, getIsSelectedBehandlingspunktOverridden, getSelectedBehandlingspunktVilkar,
  isSelectedBehandlingspunktOverrideReadOnly,
} from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/behandlingsprosessSelectors';
import OverstyrVurderingChecker from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/OverstyrVurderingChecker';
import OverstyrConfirmationForm from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/OverstyrConfirmationForm';
import VilkarResultPicker from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/vilkar/VilkarResultPicker';
import OverstyrConfirmVilkarButton from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/OverstyrConfirmVilkarButton';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { getFodselVilkarAvslagsarsaker } from './fodsel/FodselVilkarForm';
import { VilkarresultatMedBegrunnelse } from './VilkarresultatMedBegrunnelse';
import { getApCode, getAllApCodes } from './BehandlingspunktToAksjonspunkt';

import styles from './vilkarresultatMedOverstyringForm.less';

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
  isReadOnly,
  apCode,
  lovReferanse,
  isSolvable,
  erVilkarOk,
  customVilkarIkkeOppfyltText,
  customVilkarOppfyltText,
  behandlingspunkt,
  hasAksjonspunkt,
  avslagsarsaker,
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
      <VilkarresultatMedBegrunnelse
        skalViseBegrunnelse={isOverstyrt}
        readOnly={isReadOnly || !isOverstyrt}
        erVilkarOk={erVilkarOk}
        customVilkarIkkeOppfyltText={customVilkarIkkeOppfyltText}
        customVilkarOppfyltText={customVilkarOppfyltText}
        behandlingspunkt={behandlingspunkt}
        hasAksjonspunkt={hasAksjonspunkt}
        avslagsarsaker={avslagsarsaker}
      />
      <OverstyrConfirmVilkarButton submitting={formProps.submitting} pristine={!isSolvable || formProps.pristine} />
    </form>
  </FadingPanel>
);

VilkarresultatMedOverstyringFormImpl.propTypes = {
  intl: intlShape.isRequired,
  isOverstyrt: PropTypes.bool.isRequired,
  erVilkarOk: PropTypes.bool.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  aksjonspunktCode: PropTypes.string,
  lovReferanse: PropTypes.string,
  customVilkarIkkeOppfyltText: PropTypes.shape({
    id: PropTypes.string.isRequired,
    values: PropTypes.shape(),
  }),
  customVilkarOppfyltText: PropTypes.shape({
    id: PropTypes.string.isRequired,
    values: PropTypes.shape(),
  }),
  behandlingspunkt: PropTypes.string.isRequired,
  hasAksjonspunkt: PropTypes.bool.isRequired,
  avslagsarsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  })).isRequired,
  ...formPropTypes,
};

VilkarresultatMedOverstyringFormImpl.defaultProps = {
  customVilkarIkkeOppfyltText: undefined,
  customVilkarOppfyltText: undefined,
  aksjonspunktCode: undefined,
  lovReferanse: undefined,
};

const buildInitialValues = createSelector(
  [getBehandlingsresultat, getSelectedBehandlingspunktAksjonspunkter, getSelectedBehandlingspunktStatus, getSelectedBehandlingspunkt,
    getFagsakYtelseType, getSelectedBehandlingspunktVilkar],
  (behandlingsresultat, aksjonspunkter, status, behandlingspunkt, ytelseType, allVilkar) => {
    const apCode = getApCode(behandlingspunkt, ytelseType, allVilkar);
    const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === apCode);
    return {
      isOverstyrt: aksjonspunkt !== undefined,
      ...VilkarresultatMedBegrunnelse.buildInitialValues(behandlingsresultat, aksjonspunkter,
        status, behandlingspunkt, ytelseType, allVilkar),
    };
  },
);

const transformValues = (values, apCode) => ({
  kode: apCode,
  ...VilkarResultPicker.transformValues(values),
  ...OverstyrConfirmationForm.transformValues(values),
});

const validate = values => VilkarresultatMedBegrunnelse.validate(values);

const getVilkar = createSelector(
  [getSelectedBehandlingspunkt, getSelectedBehandlingspunktVilkar],
  (behandlingspunkt, allVilkar) => {
    const vtKode = behandlingpunktToVilkar[behandlingspunkt];
    return vtKode ? allVilkar.find(v => v.vilkarType.kode === vtKode) : allVilkar[0];
  },
);

const getRelevanteAvslagsarsaker = (vilkarTypeKode, state) => {
  const vilkartypeAvslagsarsaker = getKodeverk(kodeverkTyper.AVSLAGSARSAK)(state)[vilkarTypeKode];
  if (vilkarTypeKode === vilkarType.FODSELSVILKARET_MOR) {
      return getFodselVilkarAvslagsarsaker(isForeldrepengerFagsak(state), vilkartypeAvslagsarsaker);
  }
  return vilkartypeAvslagsarsaker;
};


const mapStateToPropsFactory = (initialState, ownProps) => {
  const behandlingspunkt = getSelectedBehandlingspunkt(initialState);
  const apCode = getApCode(behandlingspunkt, getFagsakYtelseType(initialState), getSelectedBehandlingspunktVilkar(initialState));
  const onSubmit = values => ownProps.submitCallback([transformValues(values, apCode)]);
  const validateFn = values => validate(values);

  return (state) => {
    const aksjonspunkter = getSelectedBehandlingspunktAksjonspunkter(state);
    const formName = `VilkarresultatForm_${behandlingspunkt}`;
    const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === apCode);
    const vilkar = getVilkar(state);
    const isSolvable = aksjonspunkt !== undefined
      ? !(aksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET && !aksjonspunkt.kanLoses) : false;
    const formData = { ...behandlingFormValueSelector(formName)(state, 'isOverstyrt', 'erVilkarOk') };
    const customVilkarIkkeOppfyltText = getCustomVilkarText(state, behandlingspunkt, false);
    const customVilkarOppfyltText = getCustomVilkarText(state, behandlingspunkt, true);

    return {
      apCode,
      customVilkarOppfyltText,
      customVilkarIkkeOppfyltText,
      lovReferanse: vilkar.lovReferanse,
      isSolvable: getIsSelectedBehandlingspunktOverridden(state) || isSolvable,
      isReadOnly: isSelectedBehandlingspunktOverrideReadOnly(state),
      behandlingspunktTitleCode: getSelectedBehandlingspunktTitleCode(state),
      behandlingspunkt,
      hasAksjonspunkt: aksjonspunkt !== undefined,
      avslagsarsaker: getRelevanteAvslagsarsaker(vilkar.vilkarType.kode, state),
      form: formName,
      ...formData,
      initialValues: buildInitialValues(state),
      validate: validateFn,
      onSubmit,
    };
  };
};

const form = behandlingForm({ enableReinitialize: true })(VilkarresultatMedOverstyringFormImpl);
const VilkarresultatMedOverstyringForm = injectIntl(connect(mapStateToPropsFactory)(form));

VilkarresultatMedOverstyringForm.supports = (apCodes, behandlingspunkt) => {
  const bpApCodes = getAllApCodes(behandlingspunkt);
  return (apCodes.length === 0 && bpApCodes.length > 0) || apCodes.some(apCode => bpApCodes.includes(apCode));
};

export default VilkarresultatMedOverstyringForm;
