import React from 'react';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import Panel from 'nav-frontend-paneler';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import { DateLabel, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';

import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import urlMann from '@fpsak-frontend/assets/images/barn_gutt.svg';
import urlKvinne from '@fpsak-frontend/assets/images/barn_jente.svg';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import { getAddresses } from '@fpsak-frontend/utils';
import { MerkePanel } from '@fpsak-frontend/person-info';

import styles from './barnePanel.less';

const getChildrenAddresses = (opplysningAdresser) => {
  const addressesIndexedByType = getAddresses(opplysningAdresser);
  return addressesIndexedByType ? addressesIndexedByType[opplysningAdresseType.BOSTEDSADRESSE] : '-';
};

const getAgeFromDate = (birthDate) => moment().diff(moment(birthDate), 'years');
const erKvinne = (genderCode) => genderCode === navBrukerKjonn.KVINNE;

/**
 * Barnepanel
 *
 * Presentasjonskomponent. Viser en liste over en persons kjente barn med informasjon om
 * kjønn, navn, personnummer og adresse. Forventer å få inn en liste med personopplysningsobjekter.
 */
const BarnePanel = ({
  barneListe,
  intl,
}) => {
  if (!barneListe) {
    return null;
  }
  const content = (
    <Row>
      {barneListe.map((barn, index) => (
        <Column xs="6" className={styles.kolonneMedRom} key={`${barn.navn}${index + 1}`}>
          <Column xs="1">
            {barn.navBrukerKjonn && (
            <Image
              className={styles.icon}
              src={erKvinne(barn.navBrukerKjonn.kode) ? urlKvinne : urlMann}
              alt={intl.formatMessage({ id: 'Person.ImageText' })}
              title={intl.formatMessage({ id: erKvinne(barn.navBrukerKjonn.kode) ? 'Person.Girl' : 'Person.Boy' })}
            />
            )}
          </Column>
          <Column xs="11">
            {barn.soktForBarn && (<Element><FormattedMessage id="Barnepanel.BarnFraSoknad" /></Element>)}
            <Element>
              {barn.navn ? barn.navn : `Barn ${index + 1}`}
              ,

              <FormattedMessage id="Person.Age" values={{ age: getAgeFromDate(barn.fodselsdato) }} />
              {barn.dodsdato && !(barn.dodsdato === barn.fodselsdato)
              && <div className={styles.erDod}><MerkePanel erDod /></div>}
              {barn.dodsdato && barn.dodsdato === barn.fodselsdato && (
                <div className={styles.erDod}><MerkePanel erDodFodt /></div>
              )}
            </Element>
            <Undertekst>{barn.fnr || <DateLabel dateString={barn.fodselsdato} />}</Undertekst>
            <div className={styles.undertekstMedRom}>
              <Undertekst>
                <FormattedMessage id="Barnepanel.Adresse1" />
              </Undertekst>
            </div>
            {barn.dodsdato && (
            <Normaltekst>
              <FormattedMessage id="Barnepanel.DodsDato" />
              <Element><DateLabel dateString={barn.dodsdato} /></Element>
              <VerticalSpacer eightPx />
            </Normaltekst>
            )}
            {barn.adresser
            && (
            <Normaltekst>
              {getChildrenAddresses(barn.adresser)}
            </Normaltekst>
            )}
          </Column>
        </Column>
      ))}
    </Row>
  );
  return <Panel className={styles.panel}>{content}</Panel>;
};
BarnePanel.propTypes = {
  intl: PropTypes.shape().isRequired,
  barneListe: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
export default injectIntl(BarnePanel);
