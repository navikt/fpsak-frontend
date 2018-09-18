import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import FadingPanel from 'sharedComponents/FadingPanel';
import { behandlingForm, behandlingFormValueSelector } from 'behandling/behandlingForm';
import {
  getAksjonspunkter,
  getBehandlingInnsynDokumenter,
  getBehandlingInnsynMottattDato,
  getBehandlingInnsynResultatType,
  getBehandlingSprak,
} from 'behandling/behandlingSelectors';
import { getSelectedSaksnummer } from 'fagsak/fagsakSelectors';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';

import BehandlingspunktSubmitButton from 'behandlingsprosess/components/BehandlingspunktSubmitButton';
import { TextAreaField } from 'form/Fields';
import { getLanguageCodeFromSprakkode } from 'utils/languageUtils';
import {
  hasValidText, maxLength, minLength, requiredIfNotPristine,
} from 'utils/validation/validators';
import { getFilteredReceivedDocuments } from 'behandlingsupport/behandlingsupportSelectors';
import innsynResultatType from 'kodeverk/innsynResultatType';
import decodeHtmlEntity from 'utils/decodeHtmlEntityUtils';
import DocumentListVedtakInnsyn from './DocumentListVedtakInnsyn';


import styles from './innsynVedtakForm.less';


const maxLength1500 = (0, maxLength)(1500);
const minLength3 = (0, minLength)(3);

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
  } if (resultat === innsynResultatType.DELVISTINNVILGET) {
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

const mapStateToProps = (state, ownProps) => {
  const aksjonspunkter = getAksjonspunkter(state);
  return {
    saksNr: getSelectedSaksnummer(state),
    documents: getDocumenterMedFikkInnsynVerdi(state),
    sprakkode: getBehandlingSprak(state),
    initialValues: buildInitialValues(getBehandlingInnsynMottattDato(state), aksjonspunkter),
    apBegrunnelse: aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_INNSYN).begrunnelse,
    begrunnelse: behandlingFormValueSelector(formName)(state, 'begrunnelse'),
    resultat: getBehandlingInnsynResultatType(state).kode,
    onSubmit: values => ownProps.submitCallback([transformValues(values)]),

  };
};

const InnsynVedtakForm = connect(mapStateToProps)(injectIntl(behandlingForm({
  form: formName,
})(InnsynVedtakFormImpl)));

InnsynVedtakForm.formName = formName;

export default InnsynVedtakForm;
