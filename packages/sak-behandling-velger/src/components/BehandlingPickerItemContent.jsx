import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import classNames from 'classnames';

import {
  FlexContainer, FlexRow, FlexColumn,
  BorderBox, DateLabel, TimeLabel, Image, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

import chevronUp from '@fpsak-frontend/assets/images/pil_opp.svg';
import chevronDown from '@fpsak-frontend/assets/images/pil_ned.svg';
import stjerneImg from '@fpsak-frontend/assets/images/stjerne.svg';

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

const renderChevron = (chevron, messageId) => (
  <FormattedMessage id={messageId}>
    {(altText) => <Image src={chevron} alt={altText} />}
  </FormattedMessage>
);

/**
 * BehandlingPickerItemContent
 *
 * Presentasjonskomponent. Håndterer formatering av innholdet i den enkelte behandling i behandlingsvelgeren.
 */
const BehandlingPickerItemContent = ({
  withChevronDown,
  withChevronUp,
  behandlendeEnhetId,
  behandlendeEnhetNavn,
  opprettetDato,
  avsluttetDato,
  behandlingsstatus,
  behandlingTypeNavn,
  erGjeldendeVedtak,
  isSelected,
  behandlingsresultatTypeKode,
  behandlingsresultatTypeNavn,
  førsteÅrsak,
  behandlingTypeKode,
}) => (
  <BorderBox className={isSelected ? styles.boxPaddingWithSelected : styles.boxPadding}>
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
        <FlexColumn className={styles.pushRight}>
          {erGjeldendeVedtak && (
            <Image
              className={styles.starImage}
              src={stjerneImg}
              tooltip={{ header: <Normaltekst><FormattedMessage id="BehandlingPickerItemContent.GjeldendeVedtak" /></Normaltekst> }}
              tabIndex="0"
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
          <Normaltekst className={styles.inline} title={behandlendeEnhetNavn}>{behandlendeEnhetId}</Normaltekst>
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
    <VerticalSpacer fourPx />
  </BorderBox>
);

BehandlingPickerItemContent.propTypes = {
  withChevronDown: PropTypes.bool,
  withChevronUp: PropTypes.bool,
  behandlendeEnhetId: PropTypes.string,
  behandlendeEnhetNavn: PropTypes.string,
  opprettetDato: PropTypes.string.isRequired,
  avsluttetDato: PropTypes.string,
  behandlingsstatus: PropTypes.string.isRequired,
  behandlingTypeKode: PropTypes.string.isRequired,
  behandlingTypeNavn: PropTypes.string.isRequired,
  førsteÅrsak: PropTypes.shape({
    behandlingArsakType: kodeverkObjektPropType,
    erAutomatiskRevurdering: PropTypes.bool,
    manueltOpprettet: PropTypes.bool,
  }),
  erGjeldendeVedtak: PropTypes.bool,
  isSelected: PropTypes.bool.isRequired,
  behandlingsresultatTypeKode: PropTypes.string,
  behandlingsresultatTypeNavn: PropTypes.string,
};

BehandlingPickerItemContent.defaultProps = {
  withChevronDown: false,
  withChevronUp: false,
  avsluttetDato: null,
  behandlendeEnhetId: null,
  behandlendeEnhetNavn: null,
  førsteÅrsak: {
    behandlingArsakType: {
      kode: '-',
    },
  },
  erGjeldendeVedtak: false,
  behandlingsresultatTypeKode: undefined,
  behandlingsresultatTypeNavn: undefined,
};

export default BehandlingPickerItemContent;
