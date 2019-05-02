import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import { DateLabel, Image, BorderBox } from '@fpsak-frontend/shared-components';
import chevronUp from '@fpsak-frontend/assets/images/pil_opp.svg';
import chevronDown from '@fpsak-frontend/assets/images/pil_ned.svg';

import styles from './behandlingPickerItemContent.less';

const renderChevron = (chevron, messageId) => (
  <FormattedMessage id={messageId}>
    {altText => <Image className={styles.image} src={chevron} alt={altText} />}
  </FormattedMessage>
);


// TODO hente de forksjellige kodeverkene man trenger
const getÅrsak = (årsak) => {
  if (årsak.manueltOpprettet) {
    return 'Manuell behandling';
  }
  switch (årsak.behandlingArsakType) {
    case 'RE-END-INNTEKTSMELD':
      return 'Inntektsmelding';
    case 'RE-HENDELSE-FØDSEL':
      return 'Fødsel';
    case 'RE-HENDELSE-DØD-F':
    case 'RE-HENDELSE-DØD-B':
    case 'RE-HENDELSE-DØDFØDSEL':
      return 'Død';
    case 'RE-FRIST':
    case 'RE-END-FRA-BRUKER':
      return 'Søknad';
    default:
      return null;
  }
};

/**
 * BehandlingPickerItemContent
 *
 * Presentasjonskomponent. Håndterer formatering av innholdet i den enkelte behandling i behandlingsvelgeren.
 */
const BehandlingPickerItemContent = ({
  withChevronDown,
  withChevronUp,
  behandlingType,
  behandlendeEnhetId,
  behandlendeEnhetNavn,
  behandlingId,
  opprettetDato,
  avsluttetDato,
  førsteÅrsak,
  behandlingsstatus,
}) => (
  <BorderBox className={styles.boxPadding}>
    <div>
      {withChevronDown && renderChevron(chevronDown, 'BehandlingListItem.Open')}
      {withChevronUp && renderChevron(chevronUp, 'BehandlingListItem.Close')}
      <div>
        <Element className={styles.smallMarginBottom}>
          {behandlingType}
        </Element>
        <Normaltekst className={styles.paddingBottom}>
          {behandlendeEnhetId}
          {' '}
          {behandlendeEnhetNavn}
        </Normaltekst>
      </div>
    </div>
    <div>
      <Row value={behandlingId}>
        <Column xs="3">
          <Undertekst className={styles.undertekstPaddingBottom}><FormattedMessage id="BehandlingListItem.Opprettet" /></Undertekst>
          <Normaltekst><DateLabel dateString={opprettetDato} /></Normaltekst>
        </Column>
        <Column xs="3">
          <Undertekst className={styles.undertekstPaddingBottom}><FormattedMessage id="BehandlingListItem.Avsluttet" /></Undertekst>
          {avsluttetDato && <Normaltekst><DateLabel dateString={avsluttetDato} /></Normaltekst>}
        </Column>
        <Column xs="3">
          <Undertekst className={styles.undertekstPaddingBottom}><FormattedMessage id="BehandlingListItem.Årsak" /></Undertekst>
          {(førsteÅrsak.erAutomatiskRevurdering || førsteÅrsak.manueltOpprettet) && <Normaltekst>{getÅrsak(førsteÅrsak)}</Normaltekst>}
        </Column>
        <Column xs="3">
          <Undertekst className={styles.undertekstPaddingBottom}><FormattedMessage id="BehandlingListItem.Behandlingsstatus" /></Undertekst>
          <Normaltekst>{behandlingsstatus}</Normaltekst>
        </Column>
      </Row>
    </div>
  </BorderBox>
);

BehandlingPickerItemContent.propTypes = {
  withChevronDown: PropTypes.bool,
  withChevronUp: PropTypes.bool,
  behandlingType: PropTypes.string.isRequired,
  behandlendeEnhetId: PropTypes.string,
  behandlendeEnhetNavn: PropTypes.string,
  behandlingId: PropTypes.number.isRequired,
  opprettetDato: PropTypes.string.isRequired,
  avsluttetDato: PropTypes.string,
  behandlingsstatus: PropTypes.string.isRequired,
  førsteÅrsak: PropTypes.shape({
    behandlingArsakType: kodeverkObjektPropType.isRequired,
    erAutomatiskRevurdering: PropTypes.bool.isRequired,
    manueltOpprettet: PropTypes.bool.isRequired,
  }).isRequired,
};

BehandlingPickerItemContent.defaultProps = {
  withChevronDown: false,
  withChevronUp: false,
  avsluttetDato: null,
  behandlendeEnhetId: null,
  behandlendeEnhetNavn: null,
};

export default BehandlingPickerItemContent;
