import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';

import VilkarResultPanel from 'behandlingsprosess/components/vilkar/VilkarResultPanel';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import BehandlingspunktSubmitButton from 'behandlingsprosess/components/BehandlingspunktSubmitButton';
import FadingPanel from 'sharedComponents/FadingPanel';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import AksjonspunktHelpText from 'sharedComponents/AksjonspunktHelpText';

/*
 * BpPanelTemplate
 *
 * Presentasjonskomponent.
 */
const BpPanelTemplate = ({
  intl,
  handleSubmit,
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
      <VerticalSpacer twentyPx />
      {lovReferanse
        && (
        <ElementWrapper>
          <Normaltekst>{lovReferanse}</Normaltekst>
          <VerticalSpacer sixteenPx />
        </ElementWrapper>
        )
      }
      {bpStatus && isAksjonspunktOpen
        && (
        <ElementWrapper>
          <VilkarResultPanel status={bpStatus} />
          <VerticalSpacer sixteenPx />
        </ElementWrapper>
        )
      }
      <AksjonspunktHelpText isAksjonspunktOpen={isAksjonspunktOpen && !readOnly}>
        {aksjonspunktHelpTexts.map(aht => intl.formatMessage({ id: aht }))}
      </AksjonspunktHelpText>
      <VerticalSpacer twentyPx />
      {children}
      <BehandlingspunktSubmitButton formName={formProps.form} isReadOnly={readOnly} isSubmittable={!readOnlySubmitButton} isDirty={isDirty} />
    </form>
  </FadingPanel>
);

BpPanelTemplate.propTypes = {
  intl: intlShape.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  titleCode: PropTypes.string.isRequired,
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

BpPanelTemplate.defaultProps = {
  lovReferanse: undefined,
  bpStatus: undefined,
  isDirty: undefined,
};

export default injectIntl(BpPanelTemplate);
