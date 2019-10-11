import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { FadingPanel } from '@fpsak-frontend/shared-components';
import {
  behandlingForm, behandlingFormValueSelector, VilkarResultPicker, OverstyrBekreftKnappPanel, OverstyrVurderingVelger,
} from '@fpsak-frontend/fp-felles';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';

import { VilkarresultatMedBegrunnelse } from './VilkarresultatMedBegrunnelse';

import styles from './vilkarresultatMedOverstyringForm.less';

/**
 * VilkarresultatForm
 *
 * Presentasjonskomponent. Viser resultat av vilkårskjøring når det ikke finnes tilknyttede aksjonspunkter.
 * Resultatet kan overstyres av Nav-ansatt med overstyr-rettighet.
 */
export const VilkarresultatMedOverstyringForm = ({
  panelTittel,
  isOverstyrt,
  isReadOnly,
  overstyringApKode,
  lovReferanse,
  isSolvable,
  erVilkarOk,
  customVilkarIkkeOppfyltText,
  customVilkarOppfyltText,
  erMedlemskapsPanel,
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
          <Undertittel>{panelTittel}</Undertittel>
          {lovReferanse && <Normaltekst>{lovReferanse}</Normaltekst>}
        </div>
        <div className={styles.checkerAlign}>
          <OverstyrVurderingVelger
            aksjonspunktCode={overstyringApKode}
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
        erMedlemskapsPanel={erMedlemskapsPanel}
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
  isOverstyrt: PropTypes.bool,
  erVilkarOk: PropTypes.bool,
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
  erMedlemskapsPanel: PropTypes.bool.isRequired,
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
  isOverstyrt: undefined,
  erVilkarOk: undefined,
};

const buildInitialValues = createSelector(
  [(ownProps) => ownProps.behandlingsresultat,
    (ownProps) => ownProps.aksjonspunkter,
    (ownProps) => ownProps.status,
    (ownProps) => ownProps.overstyringApKode],
  (behandlingsresultat, aksjonspunkter, status, overstyringApKode) => {
    const aksjonspunkt = aksjonspunkter.find((ap) => ap.definisjon.kode === overstyringApKode);
    return {
      isOverstyrt: aksjonspunkt !== undefined,
      ...VilkarresultatMedBegrunnelse.buildInitialValues(behandlingsresultat, aksjonspunkter, status, overstyringApKode),
    };
  },
);

const getCustomVilkarText = (erMedlemskapsPanel, medlemskapFom, behandlingType, erOppfylt) => {
  const customVilkarText = {};
  const isBehandlingRevurderingFortsattMedlemskap = behandlingType.kode === BehandlingType.REVURDERING && !!medlemskapFom;
  if (isBehandlingRevurderingFortsattMedlemskap) {
    customVilkarText.id = erOppfylt ? 'VilkarResultPicker.VilkarOppfyltRevurderingFom' : 'VilkarResultPicker.VilkarIkkeOppfyltRevurderingFom';
    customVilkarText.values = { fom: moment(medlemskapFom).format(DDMMYYYY_DATE_FORMAT) };
  }
  return customVilkarText.id ? customVilkarText : undefined;
};

const getCustomVilkarTextForOppfylt = createSelector(
  [(ownProps) => ownProps.erMedlemskapsPanel, (ownProps) => ownProps.medlemskapFom, (ownProps) => ownProps.behandlingType],
  (erMedlemskapsPanel, medlemskapFom, behandlingType) => getCustomVilkarText(erMedlemskapsPanel, medlemskapFom, behandlingType, true),
);
const getCustomVilkarTextForIkkeOppfylt = createSelector(
  [(ownProps) => ownProps.erMedlemskapsPanel, (ownProps) => ownProps.medlemskapFom, (ownProps) => ownProps.behandlingType],
  (erMedlemskapsPanel, medlemskapFom, behandlingType) => getCustomVilkarText(erMedlemskapsPanel, medlemskapFom, behandlingType, false),
);

const transformValues = (values, overstyringApKode) => ({
  kode: overstyringApKode,
  ...VilkarResultPicker.transformValues(values),
  ...VilkarresultatMedBegrunnelse.transformValues(values),
});

const validate = (values) => VilkarresultatMedBegrunnelse.validate(values);

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const { overstyringApKode, submitCallback } = initialOwnProps;
  const onSubmit = (values) => submitCallback([transformValues(values, overstyringApKode)]);
  const validateFn = (values) => validate(values);
  const aksjonspunktCodes = initialOwnProps.aksjonspunkter.map((a) => a.definisjon.kode);
  const formName = `VilkarresultatForm_${overstyringApKode}`;

  return (state, ownProps) => {
    const {
      behandlingId, behandlingVersjon, aksjonspunkter, erOverstyrt, overrideReadOnly,
    } = ownProps;

    const aksjonspunkt = aksjonspunkter.find((ap) => ap.definisjon.kode === overstyringApKode);
    const isSolvable = aksjonspunkt !== undefined
      ? !(aksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET && !aksjonspunkt.kanLoses) : false;

    return {
      onSubmit,
      aksjonspunktCodes,
      customVilkarOppfyltText: getCustomVilkarTextForOppfylt(ownProps),
      customVilkarIkkeOppfyltText: getCustomVilkarTextForIkkeOppfylt(ownProps),
      isSolvable: erOverstyrt || isSolvable,
      isReadOnly: overrideReadOnly,
      hasAksjonspunkt: aksjonspunkt !== undefined,
      initialValues: buildInitialValues(ownProps),
      validate: validateFn,
      form: formName,
      ...behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'isOverstyrt', 'erVilkarOk'),
    };
  };
};

const form = behandlingForm({ enableReinitialize: true })(VilkarresultatMedOverstyringForm);
export default connect(mapStateToPropsFactory)(form);
