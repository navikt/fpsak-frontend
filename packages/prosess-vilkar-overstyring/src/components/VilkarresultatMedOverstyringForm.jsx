import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import {
  Undertittel, Element, EtikettLiten, Normaltekst,
} from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import {
  FlexContainer, FlexRow, FlexColumn, Image, VerticalSpacer, AksjonspunktBox, EditedIcon,
} from '@fpsak-frontend/shared-components';
import {
  behandlingForm, behandlingFormValueSelector, VilkarResultPicker, OverstyrBekreftKnappPanel,
} from '@fpsak-frontend/fp-felles';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import avslattImage from '@fpsak-frontend/assets/images/avslaatt_hover.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/innvilget_hover.svg';
import keyImage from '@fpsak-frontend/assets/images/key-1-rotert.svg';
import keyUtgraetImage from '@fpsak-frontend/assets/images/key-1-rotert-utgraet.svg';
import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel_ny.svg';

import { VilkarresultatMedBegrunnelse } from './VilkarresultatMedBegrunnelse';

import styles from './vilkarresultatMedOverstyringForm.less';

const isOverridden = (aksjonspunktCodes, aksjonspunktCode) => aksjonspunktCodes.some((code) => code === aksjonspunktCode);
const isHidden = (kanOverstyre, aksjonspunktCodes, aksjonspunktCode) => !isOverridden(aksjonspunktCodes, aksjonspunktCode) && !kanOverstyre;

/**
 * VilkarresultatForm
 *
 * Presentasjonskomponent. Viser resultat av vilkårskjøring når det ikke finnes tilknyttede aksjonspunkter.
 * Resultatet kan overstyres av Nav-ansatt med overstyr-rettighet.
 */
export const VilkarresultatMedOverstyringForm = ({
  panelTittelKode,
  erOverstyrt,
  isReadOnly,
  overstyringApKode,
  lovReferanse,
  isSolvable,
  erVilkarOk,
  originalErVilkarOk,
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
}) => {
  const togglePa = useCallback(() => toggleOverstyring((oldArray) => [...oldArray, overstyringApKode]));
  const toggleAv = useCallback(() => {
    formProps.reset();
    toggleOverstyring((oldArray) => oldArray.filter((code) => code !== overstyringApKode));
  });

  return (
    <form onSubmit={formProps.handleSubmit}>
      <FlexContainer>
        <FlexRow>
          {(!erOverstyrt && originalErVilkarOk !== undefined) && (
          <FlexColumn>
            <Image className={styles.status} src={originalErVilkarOk ? innvilgetImage : avslattImage} />
          </FlexColumn>
          )}
          <FlexColumn>
            <Undertittel><FormattedMessage id={panelTittelKode} /></Undertittel>
          </FlexColumn>
          {lovReferanse && (
            <FlexColumn>
              <EtikettLiten className={styles.vilkar}>{lovReferanse}</EtikettLiten>
            </FlexColumn>
          )}
        </FlexRow>
        <FlexRow>
          <FlexColumn>
            {originalErVilkarOk && (
              <>
                <VerticalSpacer eightPx />
                <Element><FormattedMessage id="VilkarresultatMedOverstyringForm.ErOppfylt" /></Element>
              </>
            )}
            {originalErVilkarOk === false && (
              <>
                <VerticalSpacer eightPx />
                <Element><FormattedMessage id="VilkarresultatMedOverstyringForm.ErIkkeOppfylt" /></Element>
              </>
            )}
            {originalErVilkarOk === undefined && (
              <>
                <VerticalSpacer eightPx />
                <Normaltekst><FormattedMessage id="VilkarresultatMedOverstyringForm.IkkeBehandlet" /></Normaltekst>
              </>
            )}
          </FlexColumn>
          {originalErVilkarOk !== undefined && !isHidden(kanOverstyreAccess.isEnabled, aksjonspunktCodes, overstyringApKode) && (
            <>
                {(!erOverstyrt && !overrideReadOnly) && (
                  <FlexColumn>
                    <VerticalSpacer eightPx />
                    <Image className={styles.key} src={keyImage} onClick={togglePa} />
                  </FlexColumn>
                )}
                {(erOverstyrt || overrideReadOnly) && (
                  <FlexColumn>
                    <VerticalSpacer eightPx />
                    <Image className={styles.keyWithoutCursor} src={keyUtgraetImage} />
                  </FlexColumn>
                )}
            </>
          )}
        </FlexRow>
      </FlexContainer>
      <VerticalSpacer eightPx />
      {(erOverstyrt || hasAksjonspunkt) && (
      <AksjonspunktBox className={styles.aksjonspunktMargin} erAksjonspunktApent={erOverstyrt}>
        <Element><FormattedMessage id="VilkarresultatMedOverstyringForm.AutomatiskVurdering" /></Element>
        <VerticalSpacer eightPx />
        <VilkarresultatMedBegrunnelse
          skalViseBegrunnelse={erOverstyrt || hasAksjonspunkt}
          readOnly={isReadOnly || !erOverstyrt}
          erVilkarOk={erVilkarOk}
          customVilkarIkkeOppfyltText={customVilkarIkkeOppfyltText}
          customVilkarOppfyltText={customVilkarOppfyltText}
          erMedlemskapsPanel={erMedlemskapsPanel}
          hasAksjonspunkt={hasAksjonspunkt}
          avslagsarsaker={avslagsarsaker}
        />
        <VerticalSpacer sixteenPx />
        {!erOverstyrt && (erVilkarOk !== undefined) && (
          <>
            <VerticalSpacer fourPx />
            <FlexRow>
              <FlexColumn>
                <EditedIcon />
              </FlexColumn>
              <FlexColumn>
                <Normaltekst><FormattedMessage id="VilkarresultatMedOverstyringForm.Endret" /></Normaltekst>
              </FlexColumn>
            </FlexRow>
          </>
        )}
        {erOverstyrt && (
        <FlexContainer>
          <FlexRow>
            <FlexColumn>
              <Image src={advarselIkonUrl} />
            </FlexColumn>
            <FlexColumn>
              <Element><FormattedMessage id="VilkarresultatMedOverstyringForm.Unntakstilfeller" /></Element>
            </FlexColumn>
          </FlexRow>
          <VerticalSpacer sixteenPx />
          <FlexRow>
            <FlexColumn>
              <OverstyrBekreftKnappPanel
                submitting={formProps.submitting}
                pristine={!isSolvable || formProps.pristine}
                overrideReadOnly={overrideReadOnly}
              />
            </FlexColumn>
            <FlexColumn>
              <Knapp
                htmlType="button"
                spinner={formProps.submitting}
                disabled={formProps.submitting}
                onClick={toggleAv}
              >
                <FormattedMessage id="VilkarresultatMedOverstyringForm.Avbryt" />
              </Knapp>
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
        )}
      </AksjonspunktBox>
      )}
    </form>
  );
};

VilkarresultatMedOverstyringForm.propTypes = {
  erOverstyrt: PropTypes.bool,
  erVilkarOk: PropTypes.bool,
  originalErVilkarOk: PropTypes.bool,
  isReadOnly: PropTypes.bool.isRequired,
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
  lovReferanse: undefined,
  erOverstyrt: undefined,
  erVilkarOk: undefined,
  originalErVilkarOk: undefined,
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

const getCustomVilkarText = (medlemskapFom, behandlingType, erOppfylt) => {
  const customVilkarText = {};
  const isBehandlingRevurderingFortsattMedlemskap = behandlingType.kode === BehandlingType.REVURDERING && !!medlemskapFom;
  if (isBehandlingRevurderingFortsattMedlemskap) {
    customVilkarText.id = erOppfylt ? 'VilkarResultPicker.VilkarOppfyltRevurderingFom' : 'VilkarResultPicker.VilkarIkkeOppfyltRevurderingFom';
    customVilkarText.values = { fom: moment(medlemskapFom).format(DDMMYYYY_DATE_FORMAT) };
  }
  return customVilkarText.id ? customVilkarText : undefined;
};

const getCustomVilkarTextForOppfylt = createSelector(
  [(ownProps) => ownProps.medlemskapFom, (ownProps) => ownProps.behandlingType],
  (medlemskapFom, behandlingType) => getCustomVilkarText(medlemskapFom, behandlingType, true),
);
const getCustomVilkarTextForIkkeOppfylt = createSelector(
  [(ownProps) => ownProps.medlemskapFom, (ownProps) => ownProps.behandlingType],
  (medlemskapFom, behandlingType) => getCustomVilkarText(medlemskapFom, behandlingType, false),
);

const transformValues = (values, overstyringApKode) => ({
  kode: overstyringApKode,
  ...VilkarResultPicker.transformValues(values),
  ...VilkarresultatMedBegrunnelse.transformValues(values),
});

const validate = (values) => VilkarresultatMedBegrunnelse.validate(values);

const mapStateToPropsFactory = (_initialState, initialOwnProps) => {
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

    const initialValues = buildInitialValues(ownProps);

    const erOppfylt = vilkarUtfallType.OPPFYLT === ownProps.status;
    const erVilkarOk = vilkarUtfallType.IKKE_VURDERT !== ownProps.status ? erOppfylt : undefined;

    return {
      onSubmit,
      aksjonspunktCodes,
      initialValues,
      customVilkarOppfyltText: getCustomVilkarTextForOppfylt(ownProps),
      customVilkarIkkeOppfyltText: getCustomVilkarTextForIkkeOppfylt(ownProps),
      isSolvable: erOverstyrt || isSolvable,
      isReadOnly: overrideReadOnly,
      hasAksjonspunkt: aksjonspunkt !== undefined,
      validate: validateFn,
      form: formName,
      originalErVilkarOk: erVilkarOk,
      ...behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'isOverstyrt', 'erVilkarOk'),
    };
  };
};

const form = behandlingForm({ enableReinitialize: true })(VilkarresultatMedOverstyringForm);
export default connect(mapStateToPropsFactory)(form);
