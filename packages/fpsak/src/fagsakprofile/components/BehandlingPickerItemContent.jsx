import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import DateLabel from 'sharedComponents/DateLabel';
import Image from 'sharedComponents/Image';
import BorderBox from 'sharedComponents/BorderBox';

import chevronUp from 'images/pil_opp.svg';
import chevronDown from 'images/pil_ned.svg';

import styles from './behandlingPickerItemContent.less';

const renderChevron = (chevron, messageId) => (
  <FormattedMessage id={messageId}>
    {altText => <Image className={styles.image} src={chevron} alt={altText} />}
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
  behandlingType,
  behandlendeEnhetId,
  behandlendeEnhetNavn,
  behandlingId,
  opprettetDato,
  avsluttetDato,
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
        <Column xs="4">
          <Undertekst className={styles.undertekstPaddingBottom}><FormattedMessage id="BehandlingListItem.Opprettet" /></Undertekst>
          <Normaltekst><DateLabel dateString={opprettetDato} /></Normaltekst>
        </Column>
        <Column xs="4">
          <Undertekst className={styles.undertekstPaddingBottom}><FormattedMessage id="BehandlingListItem.Avsluttet" /></Undertekst>
          {avsluttetDato && <Normaltekst><DateLabel dateString={avsluttetDato} /></Normaltekst>}
        </Column>
        <Column xs="4">
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
};

BehandlingPickerItemContent.defaultProps = {
  withChevronDown: false,
  withChevronUp: false,
  avsluttetDato: null,
  behandlendeEnhetId: null,
  behandlendeEnhetNavn: null,
};

export default BehandlingPickerItemContent;
