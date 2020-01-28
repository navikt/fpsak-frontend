import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Undertittel, EtikettLiten, Element, Normaltekst,
} from 'nav-frontend-typografi';

import {
  VerticalSpacer, FlexContainer, FlexRow, FlexColumn, AksjonspunktBox, Image,
} from '@fpsak-frontend/shared-components';
import avslattImage from '@fpsak-frontend/assets/images/avslaatt_hover.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/innvilget_hover.svg';

import {
  hasBehandlingFormErrorsOfType, isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '../../behandlingForm';
import BehandlingspunktSubmitButton from '../BehandlingspunktSubmitButton';

import styles from './prosessPanelTemplate.less';

/*
 * ProsessPanelTemplate
 *
 * Presentasjonskomponent.
 */
const ProsessPanelTemplate = ({
  behandlingId,
  behandlingVersjon,
  lovReferanse,
  titleCode,
  originalErVilkarOk,
  isAksjonspunktOpen,
  formProps,
  readOnlySubmitButton,
  readOnly,
  rendreFakta,
  isDirty,
  children,
}) => (
  <>
    <form onSubmit={formProps.handleSubmit}>
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
        <BehandlingspunktSubmitButton
          formName={formProps.form}
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

ProsessPanelTemplate.propTypes = {
  titleCode: PropTypes.string.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  lovReferanse: PropTypes.string,
  isAksjonspunktOpen: PropTypes.bool.isRequired,
  formProps: PropTypes.shape().isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  originalErVilkarOk: PropTypes.bool,
  rendreFakta: PropTypes.func,
  readOnly: PropTypes.bool.isRequired,
  isDirty: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

ProsessPanelTemplate.defaultProps = {
  lovReferanse: undefined,
  originalErVilkarOk: undefined,
  rendreFakta: undefined,
  isDirty: undefined,
};

export default ProsessPanelTemplate;
