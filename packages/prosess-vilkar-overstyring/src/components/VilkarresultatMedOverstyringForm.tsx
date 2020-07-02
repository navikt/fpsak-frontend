import React, { FunctionComponent, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import {
  Undertittel, Element, EtikettLiten, Normaltekst,
} from 'nav-frontend-typografi';

import { KodeverkMedNavn, Kodeverk, Aksjonspunkt } from '@fpsak-frontend/types';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import {
  FlexContainer, FlexRow, FlexColumn, Image, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { OverstyringPanel, VilkarResultPicker } from '@fpsak-frontend/prosess-felles';
import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { DDMMYYYY_DATE_FORMAT, decodeHtmlEntity } from '@fpsak-frontend/utils';
import avslattImage from '@fpsak-frontend/assets/images/avslaatt_hover.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/innvilget_hover.svg';
import keyImage from '@fpsak-frontend/assets/images/key-1-rotert.svg';
import keyUtgraetImage from '@fpsak-frontend/assets/images/key-1-rotert-utgraet.svg';

import styles from './vilkarresultatMedOverstyringForm.less';

const isOverridden = (aksjonspunktCodes, aksjonspunktCode) => aksjonspunktCodes.some((code) => code === aksjonspunktCode);
const isHidden = (kanOverstyre, aksjonspunktCodes, aksjonspunktCode) => !isOverridden(aksjonspunktCodes, aksjonspunktCode) && !kanOverstyre;

interface OwnProps {
  panelTittelKode: string;
  erOverstyrt?: boolean;
  overstyringApKode: string;
  lovReferanse?: string;
  isSolvable: boolean;
  erVilkarOk?: boolean;
  originalErVilkarOk?: boolean;
  customVilkarIkkeOppfyltText?: {
    id: string;
    values?: any;
  };
  customVilkarOppfyltText?: {
    id: string;
    values?: any;
  };
  erMedlemskapsPanel: boolean;
  hasAksjonspunkt: boolean;
  avslagsarsaker: KodeverkMedNavn[];
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
export const VilkarresultatMedOverstyringForm: FunctionComponent<OwnProps & InjectedFormProps> = ({
  panelTittelKode,
  erOverstyrt,
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
        <OverstyringPanel
          erOverstyrt={erOverstyrt}
          isSolvable={isSolvable}
          erVilkarOk={erVilkarOk}
          hasAksjonspunkt={hasAksjonspunkt}
          overrideReadOnly={overrideReadOnly}
          isSubmitting={formProps.submitting}
          isPristine={formProps.pristine}
          toggleAv={toggleAv}
        >
          <VilkarResultPicker
            avslagsarsaker={avslagsarsaker}
            customVilkarIkkeOppfyltText={customVilkarIkkeOppfyltText}
            customVilkarOppfyltText={customVilkarOppfyltText}
            erVilkarOk={erVilkarOk}
            readOnly={overrideReadOnly || !erOverstyrt}
            erMedlemskapsPanel={erMedlemskapsPanel}
          />
        </OverstyringPanel>
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
      // @ts-ignore Korleis fikse dette på ein bra måte?
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
  // @ts-ignore Korleis fikse dette på ein bra måte?
  ...VilkarResultPicker.transformValues(values),
});

// @ts-ignore Korleis fikse dette på ein bra måte?
const validate = (values: { erVilkarOk: boolean; avslagCode: string }) => VilkarResultPicker.validate(values.erVilkarOk, values.avslagCode);

const mapStateToPropsFactory = (_initialState, initialOwnProps) => {
  const { overstyringApKode, submitCallback } = initialOwnProps;
  const onSubmit = (values) => submitCallback([transformValues(values, overstyringApKode)]);
  const validateFn = (values) => validate(values);
  const aksjonspunktCodes = initialOwnProps.aksjonspunkter.map((a) => a.definisjon.kode);
  const formName = `VilkarresultatForm_${overstyringApKode}`;

  return (state, ownProps) => {
    const {
      behandlingId, behandlingVersjon, aksjonspunkter, erOverstyrt,
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
      hasAksjonspunkt: aksjonspunkt !== undefined,
      validate: validateFn,
      form: formName,
      originalErVilkarOk: erVilkarOk,
      ...behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'isOverstyrt', 'erVilkarOk'),
    };
  };
};

// @ts-ignore Kan ikkje senda med formnavn her sidan det er dynamisk. Må fikse på ein annan måte
const form = behandlingForm({ enableReinitialize: true })(VilkarresultatMedOverstyringForm);
export default connect(mapStateToPropsFactory)(form);
