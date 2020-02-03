import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { createSelector } from 'reselect';

import { omit } from '@fpsak-frontend/utils';
import {
  FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import {
  behandlingForm, isBehandlingFormSubmitting, isBehandlingFormDirty, hasBehandlingFormErrorsOfType,
  BehandlingspunktSubmitButton, getBehandlingFormValues,
} from '@fpsak-frontend/fp-felles';

import advarselIcon from '@fpsak-frontend/assets/images/advarsel_ny.svg';
import vedtaksbrevAvsnittPropType from '../propTypes/vedtaksbrevAvsnittPropType';
import TilbakekrevingEditerVedtaksbrevPanel from './brev/TilbakekrevingEditerVedtaksbrevPanel';

import styles from './tilbakekrevingVedtakForm.less';

const formName = 'TilbakekrevingVedtakForm';

const UNDERAVSNITT_TYPE = {
  OPPSUMMERING: 'OPPSUMMERING',
  FAKTA: 'FAKTA',
  VILKAR: 'VILKÅR',
  SARLIGEGRUNNER: 'SÆRLIGEGRUNNER',
  SARLIGEGRUNNER_ANNET: 'SÆRLIGEGRUNNER_ANNET',
};

const formatVedtakData = (values) => {
  const perioder = omit(values, UNDERAVSNITT_TYPE.OPPSUMMERING);
  return {
    oppsummeringstekst: values[UNDERAVSNITT_TYPE.OPPSUMMERING],
    perioderMedTekst: Object.keys(perioder).map((key) => ({
      fom: key.split('_')[0],
      tom: key.split('_')[1],
      faktaAvsnitt: perioder[key][UNDERAVSNITT_TYPE.FAKTA],
      vilkaarAvsnitt: perioder[key][UNDERAVSNITT_TYPE.VILKAR],
      saerligeGrunnerAvsnitt: perioder[key][UNDERAVSNITT_TYPE.SARLIGEGRUNNER],
      saerligeGrunnerAnnetAvsnitt: perioder[key][UNDERAVSNITT_TYPE.SARLIGEGRUNNER_ANNET],
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
  perioderSomIkkeHarUtfyltObligatoriskVerdi,
  erRevurderingTilbakekrevingKlage,
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
      perioderSomIkkeHarUtfyltObligatoriskVerdi={perioderSomIkkeHarUtfyltObligatoriskVerdi}
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
            isSubmittable={perioderSomIkkeHarUtfyltObligatoriskVerdi.length === 0}
            isBehandlingFormSubmitting={isBehandlingFormSubmitting}
            isBehandlingFormDirty={isBehandlingFormDirty}
            hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
          />
        </FlexColumn>
        { perioderSomIkkeHarUtfyltObligatoriskVerdi.length === 0 && (
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
        )}
        { erRevurderingTilbakekrevingKlage && (
          <FlexColumn className={classNames(styles.infoTextContainer)}>
            <FlexRow>
              <FlexColumn className={classNames(styles.padding, styles.infoTextIconColumn)}>
                <Image className={styles.infoTextIcon} src={advarselIcon} />
              </FlexColumn>
              <FlexColumn className={classNames(styles.infotextColumn)}>
                <FormattedMessage id="TilbakekrevingVedtakForm.Infotekst.Klage" />
              </FlexColumn>
            </FlexRow>
          </FlexColumn>
        )}
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
  perioderSomIkkeHarUtfyltObligatoriskVerdi: PropTypes.arrayOf(PropTypes.string).isRequired,
  erRevurderingTilbakekrevingKlage: PropTypes.bool,
};

const transformValues = (values, apKode) => [{
  kode: apKode,
  ...formatVedtakData(values),
}];

const finnPerioderSomIkkeHarVerdiForObligatoriskFelt = createSelector([
  (ownProps) => ownProps.vedtaksbrevAvsnitt, (ownProps) => ownProps.formVerdier], (vedtaksbrevAvsnitt, formVerdier) => vedtaksbrevAvsnitt.reduce((acc, va) => {
  const periode = `${va.fom}_${va.tom}`;
  const friteksterForPeriode = formVerdier[periode];

  const harObligatoriskFaktaTekst = va.underavsnittsliste.some((ua) => ua.fritekstPåkrevet && ua.underavsnittstype === UNDERAVSNITT_TYPE.FAKTA);
  if (harObligatoriskFaktaTekst && (!friteksterForPeriode || !friteksterForPeriode[UNDERAVSNITT_TYPE.FAKTA])) {
    return acc.concat(periode);
  }

  const harObligatoriskSarligeGrunnerAnnetTekst = va.underavsnittsliste
    .some((ua) => ua.fritekstPåkrevet && ua.underavsnittstype === UNDERAVSNITT_TYPE.SARLIGEGRUNNER_ANNET);
  if (harObligatoriskSarligeGrunnerAnnetTekst && (!friteksterForPeriode || !friteksterForPeriode[UNDERAVSNITT_TYPE.SARLIGEGRUNNER_ANNET])) {
    return acc.concat(periode);
  }
  return acc;
}, []));


const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const submitCallback = (values) => initialOwnProps.submitCallback(transformValues(values, initialOwnProps.aksjonspunktKodeForeslaVedtak));
  return (state, ownProps) => {
    const vedtaksbrevAvsnitt = ownProps.avsnittsliste;
    const initialValues = TilbakekrevingEditerVedtaksbrevPanel.buildInitialValues(vedtaksbrevAvsnitt);
    const formVerdier = getBehandlingFormValues(formName, ownProps.behandlingId, ownProps.behandlingVersjon)(state) || {};
    return {
      initialValues,
      formVerdier,
      vedtaksbrevAvsnitt,
      onSubmit: submitCallback,
      perioderSomIkkeHarUtfyltObligatoriskVerdi: finnPerioderSomIkkeHarVerdiForObligatoriskFelt({ vedtaksbrevAvsnitt, formVerdier }),
    };
  };
};

const TilbakekrevingVedtakForm = connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
})(TilbakekrevingVedtakFormImpl));

export default TilbakekrevingVedtakForm;
