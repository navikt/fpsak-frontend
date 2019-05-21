import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { BehandlingspunktBegrunnelseTextField, BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';
import {
  VerticalSpacer, FlexContainer, FlexRow, FlexColumn,
} from '@fpsak-frontend/shared-components';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import tilbakekrevingAksjonspunktCodes from 'behandlingTilbakekreving/src/kodeverk/tilbakekrevingAksjonspunktCodes';
import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingTilbakekreving/src/behandlingsprosess/behandlingsprosessTilbakeSelectors';
import {
  behandlingForm, hasBehandlingFormErrorsOfType, isBehandlingFormSubmitting, isBehandlingFormDirty,
} from 'behandlingTilbakekreving/src/behandlingForm';
import { fetchPreviewVedtaksbrev as fetchPreviewVedtaksbrevActionCreator, getBehandlingIdentifier } from 'behandlingTilbakekreving/src/duckTilbake';

import styles from './tilbakekrevingVedtakForm.less';

const formName = 'TilbakekrevingVedtakForm';

const fetchPreview = (fetchPreviewVedtaksbrev, behandlingIdentifier) => (e) => {
  fetchPreviewVedtaksbrev(behandlingIdentifier.behandlingId);
  e.preventDefault();
};

export const TilbakekrevingVedtakFormImpl = ({
  readOnly,
  readOnlySubmitButton,
  fetchPreviewVedtaksbrev,
  behandlingIdentifier,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <VerticalSpacer twentyPx />
    <BehandlingspunktBegrunnelseTextField readOnly={readOnly} textCode="TilbakekrevingVedtakForm.FritekstIVedtaksbrevet" />
    <VerticalSpacer twentyPx />
    <FlexContainer fluid>
      <FlexRow>
        <FlexColumn>
          <BehandlingspunktSubmitButton
            textCode="TilbakekrevingVedtakForm.TilGodkjenning"
            formName={formName}
            isReadOnly={readOnly}
            isSubmittable={!readOnlySubmitButton}
            isBehandlingFormSubmitting={isBehandlingFormSubmitting}
            isBehandlingFormDirty={isBehandlingFormDirty}
            hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
          />
        </FlexColumn>
        <FlexColumn>
          <div className={styles.padding}>
            <a
              href=""
              onClick={fetchPreview(fetchPreviewVedtaksbrev, behandlingIdentifier)}
              onKeyDown={e => (e.keyCode === 13 ? fetchPreview(fetchPreviewVedtaksbrev, behandlingIdentifier)(e) : null)}
              className={classNames(styles.buttonLink, 'lenke lenke--frittstaende')}
            >
              <FormattedMessage id="TilbakekrevingVedtakForm.ForhandvisBrev" />
            </a>
          </div>
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  </form>
);

TilbakekrevingVedtakFormImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  fetchPreviewVedtaksbrev: PropTypes.func.isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
};

const transformValues = values => [{
  kode: tilbakekrevingAksjonspunktCodes.FORESLA_VEDTAK,
  ...values,
}];

const mapStateToPropsFactory = (initialState, ownProps) => {
  const submitCallback = values => ownProps.submitCallback(transformValues(values));
  const aksjonspunkt = getSelectedBehandlingspunktAksjonspunkter(initialState)[0];
  const initialValues = BehandlingspunktBegrunnelseTextField.buildInitialValues([{ begrunnelse: aksjonspunkt.begrunnelse }]);
  return state => ({
    initialValues,
    onSubmit: submitCallback,
    behandlingIdentifier: getBehandlingIdentifier(state),
  });
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    fetchPreviewVedtaksbrev: fetchPreviewVedtaksbrevActionCreator,
  }, dispatch),
});

const TilbakekrevingVedtakForm = connect(mapStateToPropsFactory, mapDispatchToProps)(behandlingForm({
  form: formName,
})(TilbakekrevingVedtakFormImpl));

export default TilbakekrevingVedtakForm;
