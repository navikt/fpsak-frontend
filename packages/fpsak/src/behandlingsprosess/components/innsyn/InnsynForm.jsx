import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { Row } from 'nav-frontend-grid';
import moment from 'moment';

import FadingPanel from 'sharedComponents/FadingPanel';
import ArrowBox from 'sharedComponents/ArrowBox';
import { ISO_DATE_FORMAT } from 'utils/formats';
import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingsprosess/behandlingsprosessSelectors';
import { getSelectedSaksnummer } from 'fagsak/fagsakSelectors';
import { behandlingForm, behandlingFormValueSelector } from 'behandling/behandlingForm';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { getKodeverk } from 'kodeverk/duck';
import { DatepickerField, RadioGroupField, RadioOption } from 'form/Fields';
import { getRestApiData } from 'data/duck';
import { FpsakApi } from 'data/fpsakApi';
import {
  getBehandlingOnHoldDate, getBehandlingInnsynMottattDato, getBehandlingInnsynResultatType,
  getBehandlingInnsynVedtaksdokumentasjon, getBehandlingInnsynDokumenter,
} from 'behandling/behandlingSelectors';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import AksjonspunktHelpText from 'sharedComponents/AksjonspunktHelpText';
import { required, hasValidDate } from 'utils/validation/validators';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { isAksjonspunktOpen } from 'kodeverk/aksjonspunktStatus';
import { getFilteredReceivedDocuments } from 'behandlingsupport/behandlingsupportSelectors';
import BehandlingspunktBegrunnelseTextField from 'behandlingsprosess/components/BehandlingspunktBegrunnelseTextField';
import BehandlingspunktSubmitButton from 'behandlingsprosess/components/BehandlingspunktSubmitButton';
import innsynResultatTyperKV from 'kodeverk/innsynResultatType';
import DocumentListInnsyn from './DocumentListInnsyn';
import VedtakDocuments from './VedtakDocuments';

/**
 * InnsynForm
 *
 * Presentasjonskomponent. Viser panelet som håndterer avklaring av innsyn.
 */
export const InnsynFormImpl = ({
  intl,
  readOnly,
  isSubmittable,
  innsynResultatTyper,
  innsynResultatType,
  behandlingTypes,
  sattPaVent,
  saksNr,
  documents,
  vedtaksdokumenter,
  isApOpen,
  ...formProps
}) => (
  <FadingPanel>
    <form onSubmit={formProps.handleSubmit}>
      <Undertittel><FormattedMessage id="InnsynForm.Innsynsbehandling" /></Undertittel>
      <VerticalSpacer twentyPx />
      <AksjonspunktHelpText isAksjonspunktOpen={isApOpen}>
        {[<FormattedMessage id="InnsynForm.VurderKravetOmInnsyn" key="1" />]}
      </AksjonspunktHelpText>
      <VerticalSpacer twentyPx />
      <DatepickerField
        name="mottattDato"
        label={{ id: 'InnsynForm.DatoMottattKrav' }}
        readOnly={readOnly}
        isEdited={!isApOpen}
        validate={[required, hasValidDate]}
      />
      <VerticalSpacer sixteenPx />
      <VedtakDocuments vedtaksdokumenter={vedtaksdokumenter} behandlingTypes={behandlingTypes} />
      <VerticalSpacer twentyPx />
      <DocumentListInnsyn saksNr={saksNr} documents={documents} readOnly={readOnly} />
      <BehandlingspunktBegrunnelseTextField readOnly={readOnly} />
      <RadioGroupField
        name="innsynResultatType"
        validate={[required]}
        readOnly={readOnly}
        label={<FormattedMessage id="InnsynForm.Resultat" key="1" />}
        isEdited={!isApOpen}
      >
        {innsynResultatTyper.map(irt => <RadioOption key={irt.kode} value={irt.kode} label={irt.navn} />)}
      </RadioGroupField>
      {(innsynResultatType === innsynResultatTyperKV.INNVILGET || innsynResultatType === innsynResultatTyperKV.DELVISTINNVILGET)
      && (
      <ArrowBox alignOffset={(innsynResultatType === innsynResultatTyperKV.INNVILGET) ? 20 : 168}>
        <RadioGroupField
          name="sattPaVent"
          label={<FormattedMessage id="InnsynForm.VelgVidereAksjon" key="1" />}
          direction="vertical"
          readOnly={readOnly}
          isEdited={!isApOpen}
          validate={[required]}
        >
          <RadioOption label={{ id: 'InnsynForm.SettBehandlingPåVent' }} value />
          <RadioOption label={{ id: 'InnsynForm.ForeslåOgFatteVedtak' }} value={false} />
        </RadioGroupField>
        <Row>
          {sattPaVent
          && (
          <DatepickerField
            name="fristDato"
            label={{ id: 'InnsynForm.FristDato' }}
            readOnly={readOnly}
            isEdited={!isApOpen}
            validate={[required, hasValidDate]}
          />
          )}
        </Row>
      </ArrowBox>
      )
    }
      <VerticalSpacer sixteenPx />
      <BehandlingspunktSubmitButton
        formName={formProps.form}
        textCode={sattPaVent ? 'SubmitButton.SettPåVent' : undefined}
        isReadOnly={readOnly}
        isSubmittable={!isSubmittable}
      />
    </form>
  </FadingPanel>
);


InnsynFormImpl.propTypes = {
  intl: intlShape.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isSubmittable: PropTypes.bool.isRequired,
  innsynResultatTyper: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingTypes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  saksNr: PropTypes.number.isRequired,
  documents: PropTypes.arrayOf(PropTypes.shape({
    journalpostId: PropTypes.string.isRequired,
    dokumentId: PropTypes.string.isRequired,
    tittel: PropTypes.string.isRequired,
    tidspunkt: PropTypes.string,
    kommunikasjonsretning: PropTypes.string.isRequired,
  })).isRequired,
  vedtaksdokumenter: PropTypes.arrayOf(PropTypes.shape({
    dokumentId: PropTypes.string.isRequired,
    tittel: PropTypes.string.isRequired,
    opprettetDato: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  innsynResultatType: PropTypes.string,
  sattPaVent: PropTypes.bool,
  isApOpen: PropTypes.bool.isRequired,
  ...formPropTypes,
};

InnsynFormImpl.defaultProps = {
  innsynResultatType: undefined,
  sattPaVent: undefined,
};

const hentDokumenterMedNavnOgFikkInnsyn = dokumenter => dokumenter.reduce((acc, d) => {
  const dokumentNavn = `dokument_${d.dokumentId}`;
  return {
    [dokumentNavn]: d.fikkInnsyn,
    ...acc,
  };
}, {});

const buildInitialValues = createSelector(
  [getBehandlingInnsynMottattDato, getBehandlingInnsynResultatType,
    getBehandlingOnHoldDate, getBehandlingInnsynDokumenter, getSelectedBehandlingspunktAksjonspunkter],
  (innsynMottattDato, innsynResultatType, fristBehandlingPaaVent, dokumenter, aksjonspunkter) => ({
    mottattDato: innsynMottattDato,
    innsynResultatType: innsynResultatType ? innsynResultatType.kode : undefined,
    fristDato: moment().add(3, 'days').format(ISO_DATE_FORMAT),
    sattPaVent: isAksjonspunktOpen(aksjonspunkter[0].status.kode) ? undefined : !!fristBehandlingPaaVent,
    ...BehandlingspunktBegrunnelseTextField.buildInitialValues(aksjonspunkter),
    ...hentDokumenterMedNavnOgFikkInnsyn(dokumenter),
  }),
);

const getDocumentsStatus = (values, documents) => documents.map(document => ({
  dokumentId: document.dokumentId,
  journalpostId: document.journalpostId,
  fikkInnsyn: !!values[`dokument_${document.dokumentId}`],
}));

const getFilteredValues = values => (Object.keys(values)
  .filter(valueKey => !valueKey.startsWith('dokument_'))
  .reduce((acc, valueKey) => ({
    ...acc,
    [valueKey]: values[valueKey],
  }), {})
);

const transformValues = (values, documents) => ({
  kode: aksjonspunktCodes.VURDER_INNSYN,
  innsynDokumenter: getDocumentsStatus(values, documents),
  ...getFilteredValues(values),
});

const formName = 'InnsynForm';

const mapStateToProps = (state, ownProps) => ({
  documents: getFilteredReceivedDocuments(state),
  saksNr: getSelectedSaksnummer(state),
  vedtaksdokumenter: getBehandlingInnsynVedtaksdokumentasjon(state),
  innsynResultatTyper: getKodeverk(kodeverkTyper.INNSYN_RESULTAT_TYPE)(state),
  behandlingTypes: getKodeverk(kodeverkTyper.BEHANDLING_TYPE)(state),
  isApOpen: isAksjonspunktOpen(getSelectedBehandlingspunktAksjonspunkter(state)[0].status.kode),
  innsynResultatType: behandlingFormValueSelector(formName)(state, 'innsynResultatType'),
  sattPaVent: behandlingFormValueSelector(formName)(state, 'sattPaVent'),
  initialValues: buildInitialValues(state),
  onSubmit: values => ownProps.submitCallback([transformValues(values, getRestApiData(FpsakApi.ALL_DOCUMENTS)(state))]),
});


const InnsynForm = connect(mapStateToProps)(injectIntl(behandlingForm({
  form: formName,
})(InnsynFormImpl)));

InnsynForm.supports = apCodes => apCodes.includes(aksjonspunktCodes.VURDER_INNSYN);

InnsynForm.formName = formName;

export default InnsynForm;
