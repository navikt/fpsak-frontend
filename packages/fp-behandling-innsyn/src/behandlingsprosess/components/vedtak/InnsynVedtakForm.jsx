import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import {
  isBehandlingFormDirty, hasBehandlingFormErrorsOfType, isBehandlingFormSubmitting, behandlingForm, behandlingFormValueSelector,
} from 'behandlingInnsyn/src/behandlingForm';
import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';
import {
  getAksjonspunkter,
  getBehandlingInnsynDokumenter,
  getBehandlingInnsynMottattDato,
  getBehandlingInnsynResultatType,
  getBehandlingSprak,
} from 'behandlingInnsyn/src/selectors/innsynBehandlingSelectors';
import {
  FadingPanel, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { TextAreaField } from '@fpsak-frontend/form';
import {
  hasValidText, maxLength, minLength, requiredIfNotPristine, getLanguageCodeFromSprakkode, decodeHtmlEntity,
} from '@fpsak-frontend/utils';
import { getFilteredReceivedDocuments, getSelectedSaksnummer } from 'behandlingInnsyn/src/duckInnsyn';
import innsynResultatType from '@fpsak-frontend/kodeverk/src/innsynResultatType';
import DocumentListVedtakInnsyn from './DocumentListVedtakInnsyn';

import styles from './innsynVedtakForm.less';

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);

const getPreviewCallback = (formProps, begrunnelse, previewCallback) => (e) => {
  if (formProps.valid || formProps.pristine) {
    previewCallback('', 'INSSKR', begrunnelse || ' ');
  } else {
    formProps.submit();
  }
  e.preventDefault();
};

const findResultTypeMessage = (resultat) => {
  if (resultat === innsynResultatType.AVVIST) {
    return 'InnsynVedtakForm.Avslatt';
  }
  if (resultat === innsynResultatType.DELVISTINNVILGET) {
    return 'InnsynVedtakForm.Delvis';
  }
  return 'InnsynVedtakForm.Innvilget';
};

/**
 * InnsynVedtakForm
 *
 * Presentasjonskomponent. Viser panelet som håndterer vedtaksforslag av innsyn.
 */
export const InnsynVedtakFormImpl = ({
  intl,
  readOnly,
  previewCallback,
  saksNr,
  documents,
  sprakkode,
  apBegrunnelse,
  begrunnelse,
  resultat,
  ...formProps
}) => {
  const previewBrev = getPreviewCallback(formProps, begrunnelse, previewCallback);
  return (
    <FadingPanel>
      <form onSubmit={formProps.handleSubmit}>
        <Undertittel><FormattedMessage id={readOnly ? 'InnsynVedtakForm.Vedtak' : 'InnsynVedtakForm.ForslagVedtak'} /></Undertittel>
        <VerticalSpacer eightPx />
        <Undertekst><FormattedMessage id="InnsynVedtakForm.Resultat" /></Undertekst>
        <Normaltekst>
          <FormattedMessage
            id={findResultTypeMessage(resultat)}
          />
        </Normaltekst>
        <VerticalSpacer eightPx />
        <Undertekst><FormattedMessage id="InnsynVedtakForm.Vurdering" /></Undertekst>
        <Normaltekst className={styles.wordwrap}>{decodeHtmlEntity(apBegrunnelse)}</Normaltekst>
        <VerticalSpacer twentyPx />
        {(resultat !== innsynResultatType.INNVILGET)
        && (
        <Row>
          <Column xs="8">
            <TextAreaField
              name="begrunnelse"
              label={intl.formatMessage({ id: 'InnsynVedtakForm.Fritekst' })}
              validate={[requiredIfNotPristine, minLength3, maxLength1500, hasValidText]}
              maxLength={1500}
              readOnly={readOnly}
              badges={[{
                type: 'fokus',
                textId: getLanguageCodeFromSprakkode(sprakkode),
                title: 'Malform.Beskrivelse',
              }]}
            />
          </Column>
        </Row>
        )
      }
        <VerticalSpacer twentyPx />
        {resultat !== innsynResultatType.AVVIST
        && <DocumentListVedtakInnsyn saksNr={saksNr} documents={documents.filter(document => document.fikkInnsyn === true)} readOnly={readOnly} />
      }
        <VerticalSpacer twentyPx />
        <Row>
          {!readOnly
          && (
          <Column xs="3">
            <BehandlingspunktSubmitButton
              textCode="SubmitButton.ConfirmInformation"
              formName={formProps.form}
              isReadOnly={readOnly}
              isSubmittable
              isBehandlingFormSubmitting={isBehandlingFormSubmitting}
              isBehandlingFormDirty={isBehandlingFormDirty}
              hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
            />
          </Column>
          )}
          <Column xs="4">
            <a
              onClick={previewBrev}
              onKeyDown={e => (e.keyCode === 13 ? previewBrev(e) : null)}
              className="lenke lenke--frittstaende"
              target="_blank"
              rel="noopener noreferrer"
              role="link"
              tabIndex="0"
            >
              <FormattedMessage id={readOnly ? 'InnsynVedtakForm.VisVedtaksbrev' : 'InnsynVedtakForm.ForhåndsvisBrev'} />
            </a>
          </Column>
        </Row>
      </form>
    </FadingPanel>
  );
};


InnsynVedtakFormImpl.propTypes = {
  saksNr: PropTypes.number.isRequired,
  intl: intlShape.isRequired,
  readOnly: PropTypes.bool.isRequired,
  apBegrunnelse: PropTypes.string.isRequired,
  resultat: PropTypes.string.isRequired,
  begrunnelse: PropTypes.string,
  sprakkode: PropTypes.shape().isRequired,
  documents: PropTypes.arrayOf(PropTypes.shape({
    journalpostId: PropTypes.string.isRequired,
    dokumentId: PropTypes.string.isRequired,
    tittel: PropTypes.string.isRequired,
    tidspunkt: PropTypes.string,
    kommunikasjonsretning: PropTypes.string.isRequired,
  })).isRequired,
  ...formPropTypes,
};

InnsynVedtakFormImpl.defaultProps = {
  begrunnelse: undefined,
};

const buildInitialValues = (innsynMottattDato, aksjonspunkter) => ({
  mottattDato: innsynMottattDato,
  begrunnelse: aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.FORESLA_VEDTAK).begrunnelse,
});

const transformValues = values => ({
  kode: aksjonspunktCodes.FORESLA_VEDTAK,
  ...values,
});

const getDocumenterMedFikkInnsynVerdi = createSelector(
  [getFilteredReceivedDocuments, getBehandlingInnsynDokumenter],
  (alleDokumenter, valgteDokumenter) => alleDokumenter
    .filter(dokAlle => valgteDokumenter.find(dokValgte => dokValgte.dokumentId === dokAlle.dokumentId))
    .map(dokAlle => ({
      ...dokAlle,
      fikkInnsyn: valgteDokumenter.find(dokValgte => dokValgte.dokumentId === dokAlle.dokumentId).fikkInnsyn,
    })),
);

const formName = 'InnsynVedtakForm';

const mapStateToPropsFactory = (initialState, ownProps) => {
  const onSubmit = values => ownProps.submitCallback([transformValues(values)]);
  return (state) => {
    const aksjonspunkter = getAksjonspunkter(state);
    return {
      saksNr: getSelectedSaksnummer(state),
      documents: getDocumenterMedFikkInnsynVerdi(state),
      sprakkode: getBehandlingSprak(state),
      initialValues: buildInitialValues(getBehandlingInnsynMottattDato(state), aksjonspunkter),
      apBegrunnelse: aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_INNSYN).begrunnelse,
      begrunnelse: behandlingFormValueSelector(formName)(state, 'begrunnelse'),
      resultat: getBehandlingInnsynResultatType(state).kode,
      onSubmit,
    };
  };
};

const InnsynVedtakForm = connect(mapStateToPropsFactory)(injectIntl(behandlingForm({
  form: formName,
})(InnsynVedtakFormImpl)));

InnsynVedtakForm.formName = formName;

export default InnsynVedtakForm;
