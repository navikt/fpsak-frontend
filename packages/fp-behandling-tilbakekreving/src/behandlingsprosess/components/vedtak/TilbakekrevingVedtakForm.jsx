import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { omit } from '@fpsak-frontend/utils';
import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';
import {
  VerticalSpacer, FlexContainer, FlexRow, FlexColumn,
} from '@fpsak-frontend/shared-components';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import tilbakekrevingAksjonspunktCodes from 'behandlingTilbakekreving/src/kodeverk/tilbakekrevingAksjonspunktCodes';
import {
  behandlingFormTilbakekreving, hasBehandlingFormErrorsOfType, isBehandlingFormSubmitting, isBehandlingFormDirty, getBehandlingFormValues,
} from 'behandlingTilbakekreving/src/behandlingFormTilbakekreving';
import vedtaksbrevAvsnittPropType from 'behandlingTilbakekreving/src/proptypes/vedtaksbrevAvsnittPropType';
import {
  fetchPreviewVedtaksbrev as fetchPreviewVedtaksbrevActionCreator, getBehandlingIdentifier,
} from 'behandlingTilbakekreving/src/duckBehandlingTilbakekreving';
import behandlingSelectors from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import TilbakekrevingEditerVedtaksbrevPanel from './brev/TilbakekrevingEditerVedtaksbrevPanel';

import styles from './tilbakekrevingVedtakForm.less';

const formName = 'TilbakekrevingVedtakForm';

const formatVedtakData = (values) => {
  const perioder = omit(values, 'OPPSUMMERING');
  return {
    oppsummeringstekst: values.OPPSUMMERING,
    perioderMedTekst: Object.keys(perioder).map(key => ({
      fom: key.split('_')[0],
      tom: key.split('_')[1],
      faktaAvsnitt: perioder[key].FAKTA,
      vilkaarAvsnitt: perioder[key].VILKÅR,
      saerligeGrunnerAvsnitt: perioder[key].SÆRLIGEGRUNNER,
    })),
  };
};

const fetchPreview = (fetchPreviewVedtaksbrev, behandlingIdentifier, formVerdier) => (e) => {
  fetchPreviewVedtaksbrev({
    behandlingId: behandlingIdentifier.behandlingId,
    ...formatVedtakData(formVerdier),
  });
  e.preventDefault();
};

export const TilbakekrevingVedtakFormImpl = ({
  readOnly,
  fetchPreviewVedtaksbrev,
  behandlingIdentifier,
  vedtaksbrevAvsnitt,
  formVerdier,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <VerticalSpacer twentyPx />
    <TilbakekrevingEditerVedtaksbrevPanel vedtaksbrevAvsnitt={vedtaksbrevAvsnitt} formName={formName} readOnly={readOnly} />
    <VerticalSpacer twentyPx />
    <FlexContainer fluid>
      <FlexRow>
        <FlexColumn>
          <BehandlingspunktSubmitButton
            textCode="TilbakekrevingVedtakForm.TilGodkjenning"
            formName={formName}
            isReadOnly={readOnly}
            isSubmittable
            isBehandlingFormSubmitting={isBehandlingFormSubmitting}
            isBehandlingFormDirty={isBehandlingFormDirty}
            hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
          />
        </FlexColumn>
        <FlexColumn>
          <div className={styles.padding}>
            <a
              href=""
              onClick={fetchPreview(fetchPreviewVedtaksbrev, behandlingIdentifier, formVerdier)}
              onKeyDown={e => (e.keyCode === 13 ? fetchPreview(fetchPreviewVedtaksbrev, behandlingIdentifier, formVerdier)(e) : null)}
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
  fetchPreviewVedtaksbrev: PropTypes.func.isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  vedtaksbrevAvsnitt: PropTypes.arrayOf(vedtaksbrevAvsnittPropType).isRequired,
  formVerdier: PropTypes.shape().isRequired,
};

const transformValues = values => [{
    kode: tilbakekrevingAksjonspunktCodes.FORESLA_VEDTAK,
    ...formatVedtakData(values),
  }];

const mapStateToPropsFactory = (initialState, ownProps) => {
  const submitCallback = values => ownProps.submitCallback(transformValues(values));
  const vedtaksbrevAvsnitt = behandlingSelectors.getVedtaksbrevAvsnitt(initialState);
  return state => ({
    initialValues: TilbakekrevingEditerVedtaksbrevPanel.buildInitialValues(vedtaksbrevAvsnitt),
    onSubmit: submitCallback,
    behandlingIdentifier: getBehandlingIdentifier(state),
    formVerdier: getBehandlingFormValues(formName)(state) || {},
    vedtaksbrevAvsnitt,
  });
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    fetchPreviewVedtaksbrev: fetchPreviewVedtaksbrevActionCreator,
  }, dispatch),
});

const TilbakekrevingVedtakForm = connect(mapStateToPropsFactory, mapDispatchToProps)(behandlingFormTilbakekreving({
  form: formName,
})(TilbakekrevingVedtakFormImpl));

export default TilbakekrevingVedtakForm;
