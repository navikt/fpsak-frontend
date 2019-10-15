import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { omit } from '@fpsak-frontend/utils';
import {
  FlexColumn, FlexContainer, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import {
  behandlingForm, isBehandlingFormSubmitting, isBehandlingFormDirty, hasBehandlingFormErrorsOfType,
  BehandlingspunktSubmitButton, getBehandlingFormValues,
} from '@fpsak-frontend/fp-felles';

import vedtaksbrevAvsnittPropType from '../propTypes/vedtaksbrevAvsnittPropType';
import TilbakekrevingEditerVedtaksbrevPanel from './brev/TilbakekrevingEditerVedtaksbrevPanel';

import styles from './tilbakekrevingVedtakForm.less';

const formName = 'TilbakekrevingVedtakForm';

const formatVedtakData = (values) => {
  const perioder = omit(values, 'OPPSUMMERING');
  return {
    oppsummeringstekst: values.OPPSUMMERING,
    perioderMedTekst: Object.keys(perioder).map((key) => ({
      fom: key.split('_')[0],
      tom: key.split('_')[1],
      faktaAvsnitt: perioder[key].FAKTA,
      vilkaarAvsnitt: perioder[key].VILKÅR,
      saerligeGrunnerAvsnitt: perioder[key].SÆRLIGEGRUNNER,
    })),
  };
};

const fetchPreview = (fetchPreviewVedtaksbrev, behandlingId, formVerdier) => (e) => {
  fetchPreviewVedtaksbrev({
    behandlingId,
    ...formatVedtakData(formVerdier),
  });
  e.preventDefault();
};

export const TilbakekrevingVedtakFormImpl = ({
  readOnly,
  fetchPreviewVedtaksbrev,
  vedtaksbrevAvsnitt,
  formVerdier,
  behandlingId,
  behandlingVersjon,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <VerticalSpacer twentyPx />
    <TilbakekrevingEditerVedtaksbrevPanel
      vedtaksbrevAvsnitt={vedtaksbrevAvsnitt}
      formName={formName}
      readOnly={readOnly}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
    />
    <VerticalSpacer twentyPx />
    <FlexContainer fluid>
      <FlexRow>
        <FlexColumn>
          <BehandlingspunktSubmitButton
            textCode="TilbakekrevingVedtakForm.TilGodkjenning"
            formName={formName}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
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
              onClick={fetchPreview(fetchPreviewVedtaksbrev, behandlingId, formVerdier)}
              onKeyDown={(e) => (e.keyCode === 13 ? fetchPreview(fetchPreviewVedtaksbrev, behandlingId, formVerdier)(e) : null)}
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
  vedtaksbrevAvsnitt: PropTypes.arrayOf(vedtaksbrevAvsnittPropType).isRequired,
  formVerdier: PropTypes.shape().isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
};

const transformValues = (values, apKode) => [{
  kode: apKode,
  ...formatVedtakData(values),
}];

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const submitCallback = (values) => initialOwnProps.submitCallback(transformValues(values, initialOwnProps.aksjonspunktKodeForeslaVedtak));
  return (state, ownProps) => {
    const vedtaksbrevAvsnitt = ownProps.avsnittsliste;
    return {
      initialValues: TilbakekrevingEditerVedtaksbrevPanel.buildInitialValues(vedtaksbrevAvsnitt),
      onSubmit: submitCallback,
      formVerdier: getBehandlingFormValues(formName, ownProps.behandlingId, ownProps.behandlingVersjon)(state) || {},
      vedtaksbrevAvsnitt,
    };
  };
};

const TilbakekrevingVedtakForm = connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
})(TilbakekrevingVedtakFormImpl));

export default TilbakekrevingVedtakForm;
