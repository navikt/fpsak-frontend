import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';

import {
  FlexContainer, FlexRow, FlexColumn, DateLabel, TimeLabel, Image, VerticalSpacer, Tooltip,
} from '@fpsak-frontend/shared-components';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import chevronUp from '@fpsak-frontend/assets/images/pil_opp.svg';
import chevronDown from '@fpsak-frontend/assets/images/pil_ned.svg';
import stjerneImg from '@fpsak-frontend/assets/images/stjerne.svg';
import { Kodeverk } from '@fpsak-frontend/types';

import styles from './behandlingPickerItemContent.less';

// TODO (TOR) Kva er dette for noko? Desse tekstane burde vel komma fra kodeverket? Ein skal uansett ikkje hardkoda kodane her!
// TODO hente de forksjellige kodeverkene man trenger
const getÅrsak = (årsak) => {
  switch (årsak.behandlingArsakType.kode) {
    case 'RE-MF':
    case 'RE-MFIP':
      return 'Behandlingspunkt.Årsak.ManglerFødselsdato';
    case 'RE-AVAB':
      return 'Behandlingspunkt.Årsak.AvvikAntallBarn';
    case 'RE-LOV':
    case 'RE-RGLF':
      return 'Behandlingspunkt.Årsak.FeilLovanvendelse';
    case 'RE-FEFAKTA':
      return 'Behandlingspunkt.Årsak.EndredeOpplysninger';
    case 'RE-PRSSL':
    case 'RE-ANNET':
      return 'Behandlingspunkt.Årsak.Annet';
    case 'RE-END-FRA-BRUKER':
      return 'Behandlingspunkt.Årsak.Søknad';
    case 'RE-END-INNTEKTSMELD':
      return 'Behandlingspunkt.Årsak.Inntektsmelding';
    case 'BERØRT-BEHANDLING':
      return 'Behandlingspunkt.Årsak.BerørtBehandling';
    case 'KØET-BEHANDLING':
      return 'Behandlingspunkt.Årsak.KøetBehandling';
    case 'RE-KLAG-U-INNTK':
    case 'RE-KLAG-M-INNTK':
    case 'ETTER_KLAGE':
      return 'Behandlingspunkt.Årsak.Klage';
    case 'RE-MDL':
      return 'Behandlingspunkt.Årsak.OpplysningerMedlemskap';
    case 'RE-OPTJ':
      return 'Behandlingspunkt.Årsak.OpplysningerOpptjening';
    case 'RE-FRDLING':
      return 'Behandlingspunkt.Årsak.OpplysningerFordeling';
    case 'RE-INNTK':
      return 'Behandlingspunkt.Årsak.OpplysningerInntekt';
    case 'RE-DØD':
      return 'Behandlingspunkt.Årsak.OpplysningerDød';
    case 'RE-SRTB':
      return 'Behandlingspunkt.Årsak.OpplysningerRelasjon';
    case 'RE-FRIST':
      return 'Behandlingspunkt.Årsak.OpplysningerSøknadsfrist';
    case 'RE-BER-GRUN':
    case 'RE-ENDR-BER-GRUN':
      return 'Behandlingspunkt.Årsak.OpplysningerBeregning';
    case 'RE-YTELSE':
    case 'RE-TILST-YT-INNVIL':
    case 'RE-TILST-YT-OPPH':
      return 'Behandlingspunkt.Årsak.OpplysningerAnnenYtelse';
    case 'RE-HENDELSE-FØDSEL':
    case 'RE-FØDSEL':
      return 'Behandlingspunkt.Årsak.Fødsel';
    case 'RE-HENDELSE-DØD-F':
      return 'Behandlingspunkt.Årsak.SøkerDød';
    case 'RE-HENDELSE-DØD-B':
      return 'Behandlingspunkt.Årsak.BarnDød';
    case 'RE-HENDELSE-DØDFØD':
      return 'Behandlingspunkt.Årsak.Dødfødsel';
    case 'RE-REGISTEROPPL':
      return 'Behandlingspunkt.Årsak.NyeRegisteropplysninger';
    default:
      return 'Behandlingspunkt.Årsak.Annet';
  }
};

const tilbakekrevingÅrsakTyperKlage = [
  behandlingArsakType.RE_KLAGE_KA,
  behandlingArsakType.RE_KLAGE_NFP,
];

const erTilbakekrevingÅrsakKlage = (årsak) => årsak && tilbakekrevingÅrsakTyperKlage.includes(årsak.kode);

const renderChevron = (chevron, messageId) => (
  <FormattedMessage id={messageId}>
    {(altText: string) => <Image src={chevron} alt={altText} />}
  </FormattedMessage>
);

interface OwnProps {
  withChevronDown?: boolean;
  withChevronUp?: boolean;
  behandlendeEnhetId?: string;
  behandlendeEnhetNavn?: string;
  opprettetDato: string;
  avsluttetDato?: string;
  behandlingsstatus: string;
  behandlingTypeKode: string;
  behandlingTypeNavn: string;
  førsteÅrsak?: {
    behandlingArsakType?: Kodeverk;
    erAutomatiskRevurdering?: boolean;
    manueltOpprettet?: boolean;
  };
  erGjeldendeVedtak?: boolean;
  behandlingsresultatTypeKode?: string;
  behandlingsresultatTypeNavn?: string;
}

/**
 * BehandlingPickerItemContent
 *
 * Presentasjonskomponent. Håndterer formatering av innholdet i den enkelte behandling i behandlingsvelgeren.
 */
const BehandlingPickerItemContent: FunctionComponent<OwnProps> = ({
  withChevronDown = false,
  withChevronUp = false,
  behandlendeEnhetId,
  behandlendeEnhetNavn,
  opprettetDato,
  avsluttetDato,
  behandlingsstatus,
  behandlingTypeNavn,
  erGjeldendeVedtak = false,
  behandlingsresultatTypeKode,
  behandlingsresultatTypeNavn,
  førsteÅrsak = {
    behandlingArsakType: {
      kode: '-',
    },
  },
  behandlingTypeKode,
}) => (
  <Panel border>
    <FlexContainer>
      <FlexRow>
        <FlexColumn className={styles.arsakPadding}>
          <Element>{behandlingTypeNavn}</Element>
        </FlexColumn>
        {behandlingTypeKode === behandlingType.REVURDERING && førsteÅrsak.behandlingArsakType && (
          <>
            <FlexColumn className={styles.arsakPadding}>-</FlexColumn>
            <FlexColumn>
              <Normaltekst>
                <FormattedMessage id={getÅrsak(førsteÅrsak)} />
              </Normaltekst>
            </FlexColumn>
          </>
        )}
        {behandlingTypeKode === behandlingType.TILBAKEKREVING_REVURDERING && erTilbakekrevingÅrsakKlage(førsteÅrsak.behandlingArsakType) && (
          <>
            <FlexColumn className={styles.arsakPadding}>-</FlexColumn>
            <FlexColumn>
              <Normaltekst>
                <FormattedMessage id="Behandlingspunkt.Årsak.Klage" />
              </Normaltekst>
            </FlexColumn>
          </>
        )}
        <FlexColumn className={styles.pushRight}>
          {erGjeldendeVedtak && (
            <Image
              className={styles.starImage}
              src={stjerneImg}
              tooltip={<FormattedMessage id="BehandlingPickerItemContent.GjeldendeVedtak" />}
              alignTooltipLeft
            />
          )}
        </FlexColumn>
        <FlexColumn>
          {withChevronDown && renderChevron(chevronDown, 'BehandlingPickerItemContent.Open')}
          {withChevronUp && renderChevron(chevronUp, 'BehandlingPickerItemContent.Close')}
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
    <VerticalSpacer eightPx />
    <hr className={styles.line} />
    <VerticalSpacer sixteenPx />
    <FlexContainer>
      <FlexRow>
        <FlexColumn className={styles.firstColumnWidth}>
          <Normaltekst><FormattedMessage id="BehandlingPickerItemContent.Behandlingstatus" /></Normaltekst>
        </FlexColumn>
        <FlexColumn>
          <Normaltekst>{behandlingsstatus}</Normaltekst>
        </FlexColumn>
      </FlexRow>
      <FlexRow>
        <FlexColumn className={styles.firstColumnWidth}>
          <Normaltekst><FormattedMessage id="BehandlingPickerItemContent.Resultat" /></Normaltekst>
        </FlexColumn>
        <FlexColumn>
          <Normaltekst>{behandlingsresultatTypeKode ? behandlingsresultatTypeNavn : '-'}</Normaltekst>
        </FlexColumn>
      </FlexRow>
      <VerticalSpacer sixteenPx />
      <FlexRow>
        <FlexColumn className={styles.firstColumnWidth}>
          <Normaltekst><FormattedMessage id="BehandlingPickerItemContent.Opprettet" /></Normaltekst>
        </FlexColumn>
        <FlexColumn>
          <Normaltekst className={styles.inline}><DateLabel dateString={opprettetDato} /></Normaltekst>
          <Undertekst className={classNames(styles.inline, styles.timePadding)}><FormattedMessage id="DateTimeLabel.Kl" /></Undertekst>
          <Undertekst className={styles.inline}><TimeLabel dateTimeString={opprettetDato} /></Undertekst>
        </FlexColumn>
      </FlexRow>
      <FlexRow>
        <FlexColumn className={styles.firstColumnWidth}>
          <Normaltekst><FormattedMessage id="BehandlingPickerItemContent.Avsluttet" /></Normaltekst>
        </FlexColumn>
        <FlexColumn>
          {avsluttetDato && (
            <>
              <Normaltekst className={styles.inline}><DateLabel dateString={avsluttetDato} /></Normaltekst>
              <Undertekst className={classNames(styles.inline, styles.timePadding)}><FormattedMessage id="DateTimeLabel.Kl" /></Undertekst>
              <Undertekst className={styles.inline}><TimeLabel dateTimeString={avsluttetDato} /></Undertekst>
            </>
          )}
        </FlexColumn>
        <FlexColumn className={styles.pushRightCorner}>
          <Normaltekst className={styles.inline}><FormattedMessage id="BehandlingPickerItemContent.Enhet" /></Normaltekst>
          <Tooltip content={behandlendeEnhetNavn} alignLeft>
            <Normaltekst className={styles.inline}>{behandlendeEnhetId}</Normaltekst>
          </Tooltip>
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
    <VerticalSpacer fourPx />
  </Panel>
);

export default BehandlingPickerItemContent;
