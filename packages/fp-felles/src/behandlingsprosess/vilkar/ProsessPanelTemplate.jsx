import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

import {
  AksjonspunktHelpText, ElementWrapper, FadingPanel, VerticalSpacer,
} from '@fpsak-frontend/shared-components';

import {
  hasBehandlingFormErrorsOfType, isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '../../behandlingForm';
import VilkarResultPanel from './VilkarResultPanel';
import BehandlingspunktSubmitButton from '../BehandlingspunktSubmitButton';

/*
 * ProsessPanelTemplate
 *
 * Presentasjonskomponent.
 */
const ProsessPanelTemplate = ({
  intl,
  handleSubmit,
  behandlingId,
  behandlingVersjon,
  lovReferanse,
  titleCode,
  isAksjonspunktOpen,
  aksjonspunktHelpTexts,
  formProps,
  readOnlySubmitButton,
  isDirty,
  readOnly,
  bpStatus,
  children,
}) => (
  <FadingPanel>
    <form onSubmit={handleSubmit}>
      <Undertittel>{intl.formatMessage({ id: titleCode })}</Undertittel>
      <VerticalSpacer eightPx />
      {lovReferanse
        && (
        <ElementWrapper>
          <Normaltekst>{lovReferanse}</Normaltekst>
          <VerticalSpacer eightPx />
        </ElementWrapper>
        )}
      {bpStatus && isAksjonspunktOpen
        && (
        <ElementWrapper>
          <VilkarResultPanel status={bpStatus} />
          <VerticalSpacer eightPx />
        </ElementWrapper>
        )}
      <AksjonspunktHelpText isAksjonspunktOpen={isAksjonspunktOpen && !readOnly}>
        {aksjonspunktHelpTexts.map((aht) => intl.formatMessage({ id: aht }))}
      </AksjonspunktHelpText>
      <VerticalSpacer twentyPx />
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
    </form>
  </FadingPanel>
);

ProsessPanelTemplate.propTypes = {
  intl: PropTypes.shape().isRequired,
  handleSubmit: PropTypes.func.isRequired,
  titleCode: PropTypes.string.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  lovReferanse: PropTypes.string,
  bpStatus: PropTypes.string,
  isAksjonspunktOpen: PropTypes.bool.isRequired,
  aksjonspunktHelpTexts: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  formProps: PropTypes.shape().isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  isDirty: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

ProsessPanelTemplate.defaultProps = {
  lovReferanse: undefined,
  bpStatus: undefined,
  isDirty: undefined,
};

export default injectIntl(ProsessPanelTemplate);
