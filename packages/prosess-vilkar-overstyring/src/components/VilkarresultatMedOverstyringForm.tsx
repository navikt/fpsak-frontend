import React, { FunctionComponent, useCallback } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import moment from 'moment';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import {
  Undertittel, Element, EtikettLiten, Normaltekst,
} from 'nav-frontend-typografi';
import { Knapp, Hovedknapp } from 'nav-frontend-knapper';

import { Kodeverk, Aksjonspunkt } from '@fpsak-frontend/types';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import {
  FlexContainer, FlexRow, FlexColumn, Image, VerticalSpacer, AksjonspunktBox, EditedIcon,
} from '@fpsak-frontend/shared-components';
import { VilkarResultPicker } from '@fpsak-frontend/prosess-felles';
import { behandlingForm, behandlingFormValueSelector, TextAreaField } from '@fpsak-frontend/form';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  DDMMYYYY_DATE_FORMAT, decodeHtmlEntity, hasValidText, maxLength, minLength, requiredIfNotPristine,
} from '@fpsak-frontend/utils';
import avslattImage from '@fpsak-frontend/assets/images/avslaatt_hover.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/innvilget_hover.svg';
import keyImage from '@fpsak-frontend/assets/images/key-1-rotert.svg';
import keyUtgraetImage from '@fpsak-frontend/assets/images/key-1-rotert-utgraet.svg';
import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel_ny.svg';

import styles from './vilkarresultatMedOverstyringForm.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const isOverridden = (aksjonspunktCodes, aksjonspunktCode) => aksjonspunktCodes.some((code) => code === aksjonspunktCode);
const isHidden = (kanOverstyre, aksjonspunktCodes, aksjonspunktCode) => !isOverridden(aksjonspunktCodes, aksjonspunktCode) && !kanOverstyre;

interface OwnProps {
  panelTittelKode: string;
  erOverstyrt?: boolean;
  isReadOnly: boolean;
  overstyringApKode: string;
  lovReferanse?: string;
  isSolvable: boolean;
  erVilkarOk?: boolean;
  originalErVilkarOk?: boolean;
  customVilkarIkkeOppfyltText?: {
    id: string;
    values?: {};
  };
  customVilkarOppfyltText?: {
    id: string;
    values?: {};
  };
  erMedlemskapsPanel: boolean;
  hasAksjonspunkt: boolean;
  avslagsarsaker: Kodeverk[];
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
  };
  aksjonspunktCodes: string[];
  toggleOverstyring: (fn: (oldArray: []) => void) => void;
}

/**
 * VilkarresultatForm
 *
 * Presentasjonskomponent. Viser resultat av vilkårskjøring når det ikke finnes tilknyttede aksjonspunkter.
 * Resultatet kan overstyres av Nav-ansatt med overstyr-rettighet.
 */
export const VilkarresultatMedOverstyringForm: FunctionComponent<OwnProps & WrappedComponentProps & InjectedFormProps> = ({
  intl,
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
  const togglePa = useCallback(() => toggleOverstyring((oldArray) => [...oldArray, overstyringApKode]), [overstyringApKode]);
  const toggleAv = useCallback(() => {
    formProps.reset();
    toggleOverstyring((oldArray) => oldArray.filter((code) => code !== overstyringApKode));
  }, [formProps, overstyringApKode]);

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
        <VilkarResultPicker
          avslagsarsaker={avslagsarsaker}
          customVilkarIkkeOppfyltText={customVilkarIkkeOppfyltText}
          customVilkarOppfyltText={customVilkarOppfyltText}
          erVilkarOk={erVilkarOk}
          readOnly={isReadOnly || !erOverstyrt}
          hasAksjonspunkt={hasAksjonspunkt}
          erMedlemskapsPanel={erMedlemskapsPanel}
        />
        {(erOverstyrt || hasAksjonspunkt) && (
          <>
            <VerticalSpacer eightPx />
            <TextAreaField
              name="begrunnelse"
              label={intl.formatMessage({ id: 'VilkarBegrunnelse.Vilkar' })}
              validate={[requiredIfNotPristine, minLength3, maxLength1500, hasValidText]}
              maxLength={1500}
              readOnly={isReadOnly || !erOverstyrt}
              placeholder={intl.formatMessage({ id: 'VilkarBegrunnelse.BegrunnVurdering' })}
            />
          </>
        )}
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
              {!overrideReadOnly && (
                <Hovedknapp
                  mini
                  spinner={formProps.submitting}
                  disabled={formProps.submitting || !isSolvable || formProps.pristine}
                >
                  <FormattedMessage id="OverstyrBekreftKnappPanel.ConfirmInformation" />
                </Hovedknapp>
              )}
            </FlexColumn>
            <FlexColumn>
              <Knapp
                htmlType="button"
                spinner={formProps.submitting}
                disabled={formProps.submitting}
                onClick={toggleAv}
                mini
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

interface SelectorProps {
  behandlingsresultat: {
    avslagsarsak: Kodeverk;
  };
  aksjonspunkter: Aksjonspunkt[];
  status: string;
  overstyringApKode: string;
  medlemskapFom: string;
  behandlingType: Kodeverk;
}

const buildInitialValues = createSelector(
  [(ownProps: SelectorProps) => ownProps.behandlingsresultat,
    (ownProps) => ownProps.aksjonspunkter,
    (ownProps) => ownProps.status,
    (ownProps) => ownProps.overstyringApKode],
  (behandlingsresultat, aksjonspunkter, status, overstyringApKode) => {
    const aksjonspunkt = aksjonspunkter.find((ap) => ap.definisjon.kode === overstyringApKode);
    return {
      isOverstyrt: aksjonspunkt !== undefined,
      begrunnelse: decodeHtmlEntity(aksjonspunkt && aksjonspunkt.begrunnelse ? aksjonspunkt.begrunnelse : ''),
      ...VilkarResultPicker.buildInitialValues(behandlingsresultat, aksjonspunkter, status),
    };
  },
);

const getCustomVilkarText = (medlemskapFom, behandlingType, erOppfylt) => {
  const isBehandlingRevurderingFortsattMedlemskap = behandlingType.kode === BehandlingType.REVURDERING && !!medlemskapFom;
  if (isBehandlingRevurderingFortsattMedlemskap) {
    return {
      id: erOppfylt ? 'VilkarResultPicker.VilkarOppfyltRevurderingFom' : 'VilkarResultPicker.VilkarIkkeOppfyltRevurderingFom',
      values: { fom: moment(medlemskapFom).format(DDMMYYYY_DATE_FORMAT), b: (...chunks) => <b>{chunks}</b> },
    };
  }
  return undefined;
};

const getCustomVilkarTextForOppfylt = createSelector(
  [(ownProps: SelectorProps) => ownProps.medlemskapFom, (ownProps) => ownProps.behandlingType],
  (medlemskapFom, behandlingType) => getCustomVilkarText(medlemskapFom, behandlingType, true),
);
const getCustomVilkarTextForIkkeOppfylt = createSelector(
  [(ownProps: SelectorProps) => ownProps.medlemskapFom, (ownProps) => ownProps.behandlingType],
  (medlemskapFom, behandlingType) => getCustomVilkarText(medlemskapFom, behandlingType, false),
);

const transformValues = (values, overstyringApKode) => ({
  kode: overstyringApKode,
  begrunnelse: values.begrunnelse,
  ...VilkarResultPicker.transformValues(values),
});

const validate = (values: { erVilkarOk: boolean; avslagCode: string }) => VilkarResultPicker.validate(values.erVilkarOk, values.avslagCode);

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
export default connect(mapStateToPropsFactory)(injectIntl(form));
