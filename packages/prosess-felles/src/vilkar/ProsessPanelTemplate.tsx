import React, { ReactNode, FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Undertittel, EtikettLiten, Element, Normaltekst,
} from 'nav-frontend-typografi';

import {
  VerticalSpacer, FlexContainer, FlexRow, FlexColumn, AksjonspunktBox, Image,
} from '@fpsak-frontend/shared-components';
import {
  hasBehandlingFormErrorsOfType, isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/form';
import avslattImage from '@fpsak-frontend/assets/images/avslaatt_hover.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/innvilget_hover.svg';

import ProsessStegSubmitButton from '../ProsessStegSubmitButton';

import styles from './prosessPanelTemplate.less';

interface OwnProps {
  titleCode: string;
  behandlingId: number;
  behandlingVersjon: number;
  lovReferanse?: string;
  isAksjonspunktOpen: boolean;
  handleSubmit: () => void;
  formName: string;
  readOnlySubmitButton: boolean;
  originalErVilkarOk?: boolean;
  rendreFakta?: () => void;
  readOnly: boolean;
  isDirty?: boolean;
  children: ReactNode | ReactNode[];
}

/*
 * ProsessPanelTemplate
 *
 * Presentasjonskomponent.
 */
const ProsessPanelTemplate: FunctionComponent<OwnProps> = ({
  behandlingId,
  behandlingVersjon,
  lovReferanse,
  titleCode,
  originalErVilkarOk,
  isAksjonspunktOpen,
  handleSubmit,
  formName,
  readOnlySubmitButton,
  readOnly,
  rendreFakta,
  isDirty,
  children,
}) => (
  <>
    <form onSubmit={handleSubmit}>
      <FlexContainer>
        <FlexRow>
          {originalErVilkarOk !== undefined && (
            <FlexColumn>
              <Image className={styles.status} src={originalErVilkarOk ? innvilgetImage : avslattImage} />
            </FlexColumn>
          )}
          <FlexColumn>
            <Undertittel><FormattedMessage id={titleCode} /></Undertittel>
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
            {(!isAksjonspunktOpen && originalErVilkarOk === undefined) && (
              <>
                <VerticalSpacer eightPx />
                <Normaltekst><FormattedMessage id="VilkarresultatMedOverstyringForm.IkkeBehandlet" /></Normaltekst>
              </>
            )}
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
      {isAksjonspunktOpen && <VerticalSpacer eightPx />}
      <AksjonspunktBox className={styles.aksjonspunktMargin} erAksjonspunktApent={isAksjonspunktOpen}>
        {children}
        {!readOnly && <VerticalSpacer sixteenPx />}
        <ProsessStegSubmitButton
          formName={formName}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          isReadOnly={readOnly}
          isSubmittable={!readOnlySubmitButton}
          isDirty={isDirty}
          isBehandlingFormSubmitting={isBehandlingFormSubmitting}
          isBehandlingFormDirty={isBehandlingFormDirty}
          hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
        />

      </AksjonspunktBox>
      {rendreFakta && (
        <>
          <VerticalSpacer sixteenPx />
          {rendreFakta()}
        </>
      )}
    </form>
  </>
);

export default ProsessPanelTemplate;
