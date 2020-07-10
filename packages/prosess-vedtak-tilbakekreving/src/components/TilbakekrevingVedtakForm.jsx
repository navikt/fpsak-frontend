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
import { ProsessStegSubmitButton } from '@fpsak-frontend/prosess-felles';
import {
  behandlingForm, isBehandlingFormSubmitting, isBehandlingFormDirty, hasBehandlingFormErrorsOfType, getBehandlingFormValues,
} from '@fpsak-frontend/form';
import advarselIcon from '@fpsak-frontend/assets/images/advarsel_ny.svg';

import underavsnittType from '../kodeverk/avsnittType';
import vedtaksbrevAvsnittPropType from '../propTypes/vedtaksbrevAvsnittPropType';
import TilbakekrevingEditerVedtaksbrevPanel from './brev/TilbakekrevingEditerVedtaksbrevPanel';

import styles from './tilbakekrevingVedtakForm.less';

const formName = 'TilbakekrevingVedtakForm';

const formatVedtakData = (values) => {
  const perioder = omit(values, underavsnittType.OPPSUMMERING);
  return {
    oppsummeringstekst: values[underavsnittType.OPPSUMMERING],
    perioderMedTekst: Object.keys(perioder).map((key) => ({
      fom: key.split('_')[0],
      tom: key.split('_')[1],
      faktaAvsnitt: perioder[key][underavsnittType.FAKTA],
      vilkaarAvsnitt: perioder[key][underavsnittType.VILKAR],
      saerligeGrunnerAvsnitt: perioder[key][underavsnittType.SARLIGEGRUNNER],
      saerligeGrunnerAnnetAvsnitt: perioder[key][underavsnittType.SARLIGEGRUNNER_ANNET],
    })),
  };
};

const fetchPreview = (fetchPreviewVedtaksbrev, uuid, formVerdier) => (e) => {
  fetchPreviewVedtaksbrev({
    uuid,
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
  behandlingUuid,
  behandlingVersjon,
  perioderSomIkkeHarUtfyltObligatoriskVerdi,
  erRevurderingTilbakekrevingKlage,
  fritekstOppsummeringPakrevdMenIkkeUtfylt,
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
      fritekstOppsummeringPakrevdMenIkkeUtfylt={fritekstOppsummeringPakrevdMenIkkeUtfylt}
    />
    <VerticalSpacer twentyPx />
    <FlexContainer fluid>
      <FlexRow>
        <FlexColumn>
          <ProsessStegSubmitButton
            textCode="TilbakekrevingVedtakForm.TilGodkjenning"
            formName={formName}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            isReadOnly={readOnly}
            isSubmittable={perioderSomIkkeHarUtfyltObligatoriskVerdi.length === 0 && !fritekstOppsummeringPakrevdMenIkkeUtfylt}
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
                onClick={fetchPreview(fetchPreviewVedtaksbrev, behandlingUuid, formVerdier)}
                onKeyDown={(e) => (e.keyCode === 13 ? fetchPreview(fetchPreviewVedtaksbrev, behandlingUuid, formVerdier)(e) : null)}
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
  behandlingUuid: PropTypes.string.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  perioderSomIkkeHarUtfyltObligatoriskVerdi: PropTypes.arrayOf(PropTypes.string).isRequired,
  erRevurderingTilbakekrevingKlage: PropTypes.bool,
  fritekstOppsummeringPakrevdMenIkkeUtfylt: PropTypes.bool,
};

const transformValues = (values, apKode) => [{
  kode: apKode,
  ...formatVedtakData(values),
}];

const finnPerioderSomIkkeHarVerdiForObligatoriskFelt = createSelector([
  (ownProps) => ownProps.vedtaksbrevAvsnitt, (ownProps) => ownProps.formVerdier], (vedtaksbrevAvsnitt, formVerdier) => vedtaksbrevAvsnitt.reduce((acc, va) => {
  const periode = `${va.fom}_${va.tom}`;
  const friteksterForPeriode = formVerdier[periode];

  const harObligatoriskFaktaTekst = va.underavsnittsliste.some((ua) => ua.fritekstPåkrevet && ua.underavsnittstype === underavsnittType.FAKTA);
  if (harObligatoriskFaktaTekst && (!friteksterForPeriode || !friteksterForPeriode[underavsnittType.FAKTA])) {
    return acc.concat(periode);
  }

  const harObligatoriskSarligeGrunnerAnnetTekst = va.underavsnittsliste
    .some((ua) => ua.fritekstPåkrevet && ua.underavsnittstype === underavsnittType.SARLIGEGRUNNER_ANNET);
  if (harObligatoriskSarligeGrunnerAnnetTekst && (!friteksterForPeriode || !friteksterForPeriode[underavsnittType.SARLIGEGRUNNER_ANNET])) {
    return acc.concat(periode);
  }
  return acc;
}, []));

const harFritekstOppsummeringPakrevdMenIkkeUtfylt = (vedtaksbrevAvsnitt) => vedtaksbrevAvsnitt
  .filter((avsnitt) => avsnitt.avsnittstype === underavsnittType.OPPSUMMERING)
  .some((avsnitt) => avsnitt.underavsnittsliste.some((underAvsnitt) => underAvsnitt.fritekstPåkrevet && !underAvsnitt.fritekst));

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const submitCallback = (values) => initialOwnProps.submitCallback(transformValues(values, initialOwnProps.aksjonspunktKodeForeslaVedtak));
  return (state, ownProps) => {
    const vedtaksbrevAvsnitt = ownProps.avsnittsliste;
    const initialValues = TilbakekrevingEditerVedtaksbrevPanel.buildInitialValues(vedtaksbrevAvsnitt);
    const formVerdier = getBehandlingFormValues(formName, ownProps.behandlingId, ownProps.behandlingVersjon)(state) || {};
    const fritekstOppsummeringPakrevdMenIkkeUtfylt = harFritekstOppsummeringPakrevdMenIkkeUtfylt(vedtaksbrevAvsnitt);
    return {
      initialValues,
      formVerdier,
      vedtaksbrevAvsnitt,
      onSubmit: submitCallback,
      perioderSomIkkeHarUtfyltObligatoriskVerdi: finnPerioderSomIkkeHarVerdiForObligatoriskFelt({ vedtaksbrevAvsnitt, formVerdier }),
      fritekstOppsummeringPakrevdMenIkkeUtfylt,
    };
  };
};

const TilbakekrevingVedtakForm = connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
})(TilbakekrevingVedtakFormImpl));

export default TilbakekrevingVedtakForm;
