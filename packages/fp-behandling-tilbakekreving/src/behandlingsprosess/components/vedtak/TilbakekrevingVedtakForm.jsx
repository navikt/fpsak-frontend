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
  behandlingForm, hasBehandlingFormErrorsOfType, isBehandlingFormSubmitting, isBehandlingFormDirty,
} from 'behandlingTilbakekreving/src/behandlingForm';
import { fetchPreviewVedtaksbrev as fetchPreviewVedtaksbrevActionCreator, getBehandlingIdentifier } from 'behandlingTilbakekreving/src/duckTilbake';
import TilbakekrevingEditerVedtaksbrevPanel from './brev/TilbakekrevingEditerVedtaksbrevPanel';

import styles from './tilbakekrevingVedtakForm.less';

const formName = 'TilbakekrevingVedtakForm';

const fetchPreview = (fetchPreviewVedtaksbrev, behandlingIdentifier) => (e) => {
  fetchPreviewVedtaksbrev(behandlingIdentifier.behandlingId);
  e.preventDefault();
};

export const TilbakekrevingVedtakFormImpl = ({
  readOnly,
  fetchPreviewVedtaksbrev,
  behandlingIdentifier,
  vedtaksbrevData,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <VerticalSpacer twentyPx />
    <TilbakekrevingEditerVedtaksbrevPanel vedtaksbrevData={vedtaksbrevData} formName={formName} readOnly={readOnly} />
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
  fetchPreviewVedtaksbrev: PropTypes.func.isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  vedtaksbrevData: PropTypes.shape().isRequired,
};

const transformValues = (values) => {
  const perioder = omit(values, 'oppsummering');
  return [{
    kode: tilbakekrevingAksjonspunktCodes.FORESLA_VEDTAK,
    oppsummering: values.oppsummering,
    perioder: Object.keys(perioder).map(key => ({
      fom: key,
      ...omit(perioder[key], key),
    })),
  }];
};

// FIXME (TOR) hent vedtaksbrevdata fra rest-tjeneste
const mapStateToPropsFactory = (initialState, ownProps) => {
  const submitCallback = values => ownProps.submitCallback(transformValues(values));
  return state => ({
    initialValues: TilbakekrevingEditerVedtaksbrevPanel.buildInitialValues(),
    onSubmit: submitCallback,
    behandlingIdentifier: getBehandlingIdentifier(state),
    vedtaksbrevData: {
      oppsummering: {
        overskrift: 'Du må betale tilbake foreldrepenger',
        brodtekst: 'Vi sendte deg et varsel 3. mars 2019 hvor vi fortalte at du hadde fått utbetalt 15 000 kroner for mye. Du må betale 10 000 kroner tilbake.',
        fritekst: undefined,
      },
      perioder: [{
        fom: '10-04-2019',
        tom: '14-04-2019',
        overskrift: 'Perioden fra og med 10. april 2019 til og med 14. april 2019',
        brodtekst1: 'Både du og den andre forelderen har fått foreldrepenger for samme periode fordi du var innlagt i helseinstitusjon. '
          + 'Du kan ikke overføre kvoten din til den andre forelderen og i tillegg få utbetal foreldrepenger for samme periode. Du har '
          + 'derfor fått 2500 kroner for mye utbetalt i denne perioden.',
        fritekst1: undefined,
        underoverskrift: 'Hvordan vi har kommet fram til beløpet du må betale tilbake',
        brodtekst2: 'Du har ikke fått rett informasjon fra NAV, og vi mener at du ikke kunne forstå at beløpet du fikk utbetalt var feil.',
        fritekst2: undefined,
        brodtekst3: 'Vi har ikke opplysninger om at det er noe igjen av det feilutbetalte beløpet. Derfor må du ikke betale tilbake beløpet '
          + 'for denne perioden',
        fritekst3: undefined,
      }, {
        fom: '15-04-2019',
        tom: '20-04-2019',
        overskrift: 'Perioden fra og med 15. april 2019 til og med 20. april 2019',
        brodtekst1: 'Både du og den andre forelderen har fått foreldrepenger for samme periode fordi du var innlagt i helseinstitusjon. '
          + 'Du kan ikke overføre kvoten din til den andre forelderen og i tillegg få utbetal foreldrepenger for samme periode. Du har '
          + 'derfor fått 2500 kroner for mye utbetalt i denne perioden.',
        fritekst1: undefined,
        underoverskrift: 'Hvordan vi har kommet fram til beløpet du må betale tilbake',
        brodtekst2: 'Du har ikke fått rett informasjon fra NAV, og vi mener at du ikke kunne forstå at beløpet du fikk utbetalt var feil.',
        fritekst2: undefined,
        brodtekst3: 'Vi har ikke opplysninger om at det er noe igjen av det feilutbetalte beløpet. Derfor må du ikke betale tilbake '
          + 'beløpet for denne perioden',
        fritekst3: undefined,
      }],
      ekstraInformasjon: {
        overskrift: 'Hvordan betale tilbake pengene du skylder',
        brodtekst: 'Vi har overført beløpet du skylder til NAV Innkreving, som vil sende deg et krav om å betale tilbake det feilutbetalte beløpet.'
          + ' Har du spørsmål om dette, kan du kontakte NAV Innkreving (tlf eller modia)?',
        skattOverskrift: 'Skatt - kommer senere',
        klageOverskrift: 'Du har rett til å klage',
        klageBrodtekst1: 'Du kan klage innen 12 uker fra den datoen du mottok vedtaket. Du finner skjema og informasjon på nav.no/klage.',
        klageBrodtekst2: 'Du må betale tilbake, selv om du klager på dette vedtaket. (Lovhjemmel?) Vi vil betale tilbake pengene du har betalt inn, '
          + 'om du får vedtak om at du ikke trengte å betale tilbake hele eller deler av beløpet du skyldte.',
        innsynOverskrift: 'Du har rett til innsyn',
        innsynBrodtekst: 'På nav.no/dittnav kan du se dokumentene i saken din.',
        sporsmalOverskrift: 'Har du spørsmål?',
        sporsmalBrodtekst: 'Du finner nyttig informasjon på nav.no/familie. Du kan også kontakte oss på telefon 55555555',
        hilsenBrodtekst: 'Med vennlig hilsen',
        hilsenNavn: 'navn på enhet',
      },
    },
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
