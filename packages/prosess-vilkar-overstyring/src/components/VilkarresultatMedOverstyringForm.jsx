import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { FadingPanel } from '@fpsak-frontend/shared-components';
import {
  behandlingForm, behandlingFormValueSelector, VilkarResultPicker, behandlingspunktCodes,
  OverstyrBekreftKnappPanel, OverstyrVurderingVelger,
} from '@fpsak-frontend/fp-felles';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';

import { VilkarresultatMedBegrunnelse } from './VilkarresultatMedBegrunnelse';
import getApCode from '../BehandlingspunktToAksjonspunkt';

import styles from './vilkarresultatMedOverstyringForm.less';

const behandlingpunktToVilkar = {
  [behandlingspunktCodes.OPPTJENING]: vilkarType.OPPTJENINGSVILKARET,
};

const avslagsarsakerES = ['1002', '1003', '1032'];

const getFodselVilkarAvslagsarsaker = (isFpFagsak, fodselsvilkarAvslagskoder) => (isFpFagsak
  ? fodselsvilkarAvslagskoder.filter((arsak) => !avslagsarsakerES.includes(arsak.kode))
  : fodselsvilkarAvslagskoder);

const getCustomVilkarText = (behandlingspunkt, oppfylt, medlemskapFom, behandlingType) => {
  const customVilkarText = {};
  const isBehandlingRevurderingFortsattMedlemskap = behandlingType.kode === BehandlingType.REVURDERING && !!medlem.fom;
  if (behandlingspunkt === behandlingspunktCodes.MEDLEMSKAP && isBehandlingRevurderingFortsattMedlemskap) {
    customVilkarText.id = oppfylt ? 'VilkarResultPicker.VilkarOppfyltRevurderingFom' : 'VilkarResultPicker.VilkarIkkeOppfyltRevurderingFom';
    customVilkarText.values = { fom: moment(medlemskapFom).format(DDMMYYYY_DATE_FORMAT) };
  }
  return customVilkarText.id ? customVilkarText : undefined;
};

/**
 * VilkarresultatForm
 *
 * Presentasjonskomponent. Viser resultat av vilkårskjøring når det ikke finnes tilknyttede aksjonspunkter.
 * Resultatet kan overstyres av Nav-ansatt med overstyr-rettighet.
 */
export const VilkarresultatMedOverstyringForm = ({
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
  overrideReadOnly,
  kanOverstyreAccess,
  aksjonspunktCodes,
  toggleOverstyring,
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
          <OverstyrVurderingVelger
            aksjonspunktCode={apCode}
            resetValues={formProps.reset}
            overrideReadOnly={overrideReadOnly}
            kanOverstyreAccess={kanOverstyreAccess}
            aksjonspunktCodes={aksjonspunktCodes}
            toggleOverstyring={toggleOverstyring}
          />
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
      <OverstyrBekreftKnappPanel
        submitting={formProps.submitting}
        pristine={!isSolvable || formProps.pristine}
        overrideReadOnly={overrideReadOnly}
      />
    </form>
  </FadingPanel>
);

VilkarresultatMedOverstyringForm.propTypes = {
  intl: PropTypes.shape().isRequired,
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
  avslagsarsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  overrideReadOnly: PropTypes.bool.isRequired,
  toggleOverstyring: PropTypes.func.isRequired,
  kanOverstyreAccess: PropTypes.shape({
    isEnabled: PropTypes.bool.isRequired,
  }).isRequired,
  aksjonspunktCodes: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  ...formPropTypes,
};

VilkarresultatMedOverstyringForm.defaultProps = {
  customVilkarIkkeOppfyltText: undefined,
  customVilkarOppfyltText: undefined,
  aksjonspunktCode: undefined,
  lovReferanse: undefined,
};

const buildInitialValues = createSelector(
  [(ownProps) => ownProps.behandlingsresultat,
    (ownProps) => ownProps.behandlingspunktAksjonspunkter,
    (ownProps) => ownProps.behandlingspunktStatus,
    (ownProps) => ownProps.behandlingspunkt,
    (ownProps) => ownProps.fagsakYtelseType,
    (ownProps) => ownProps.behandlingspunktVilkar],
  (behandlingsresultat, aksjonspunkter, status, behandlingspunkt, ytelseType, allVilkar) => {
    const apCode = getApCode(behandlingspunkt, ytelseType, allVilkar);
    const aksjonspunkt = aksjonspunkter.find((ap) => ap.definisjon.kode === apCode);
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
  ...VilkarresultatMedBegrunnelse.transformValues(values),
});

const validate = (values) => VilkarresultatMedBegrunnelse.validate(values);

const getVilkar = createSelector(
  [(ownProps) => ownProps.behandlingspunkt, (ownProps) => ownProps.behandlingspunktVilkar],
  (behandlingspunkt, allVilkar) => {
    const vtKode = behandlingpunktToVilkar[behandlingspunkt];
    return vtKode ? allVilkar.find((v) => v.vilkarType.kode === vtKode) : allVilkar[0];
  },
);

const getRelevanteAvslagsarsaker = (vilkarTypeKode, fagsakYtelseType, avslagsarsaker) => {
  const vilkartypeAvslagsarsaker = avslagsarsaker[vilkarTypeKode];
  if (vilkarTypeKode === vilkarType.FODSELSVILKARET_MOR) {
    return getFodselVilkarAvslagsarsaker(fagsakYtelseType.kode === FagsakYtelseType.FORELDREPENGER, vilkartypeAvslagsarsaker);
  }
  return vilkartypeAvslagsarsaker;
};

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const { behandlingspunkt } = initialOwnProps;
  const apCode = getApCode(behandlingspunkt, initialOwnProps.fagsakYtelseType, initialOwnProps.behandlingspunktVilkar);
  const onSubmit = (values) => initialOwnProps.submitCallback([transformValues(values, apCode)]);
  const validateFn = (values) => validate(values);
  const aksjonspunktCodes = initialOwnProps.aksjonspunkter.map((a) => a.definisjon.kode);

  return (state, ownProps) => {
    const { behandlingId, behandlingVersjon } = ownProps;
    const aksjonspunkter = ownProps.behandlingspunktAksjonspunkter;
    const formName = `VilkarresultatForm_${behandlingspunkt}`;
    const aksjonspunkt = aksjonspunkter.find((ap) => ap.definisjon.kode === apCode);
    const vilkar = getVilkar(ownProps);
    const isSolvable = aksjonspunkt !== undefined
      ? !(aksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET && !aksjonspunkt.kanLoses) : false;
    const formData = { ...behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'isOverstyrt', 'erVilkarOk') };
    const customVilkarIkkeOppfyltText = getCustomVilkarText(behandlingspunkt, false, ownProps.medlemskapFom, ownProps.behandlingType);
    const customVilkarOppfyltText = getCustomVilkarText(behandlingspunkt, true, ownProps.medlemskapFom, ownProps.behandlingType);

    return {
      aksjonspunktCodes,
      apCode,
      customVilkarOppfyltText,
      customVilkarIkkeOppfyltText,
      lovReferanse: vilkar.lovReferanse,
      isSolvable: ownProps.behandlingspunktOverridden || isSolvable,
      isReadOnly: ownProps.behandlingspunktOverrideReadOnly,
      behandlingspunktTitleCode: ownProps.behandlingspunktTitleCode,
      behandlingspunkt,
      hasAksjonspunkt: aksjonspunkt !== undefined,
      avslagsarsaker: getRelevanteAvslagsarsaker(vilkar.vilkarType.kode, ownProps.fagsakYtelseType, ownProps.avslagsarsaker),
      form: formName,
      ...formData,
      initialValues: buildInitialValues(ownProps),
      validate: validateFn,
      onSubmit,
    };
  };
};

const form = behandlingForm({ enableReinitialize: true })(VilkarresultatMedOverstyringForm);
export default injectIntl(connect(mapStateToPropsFactory)(form));
