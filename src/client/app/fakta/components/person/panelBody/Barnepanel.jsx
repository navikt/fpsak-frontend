import React from 'react';
import { Element, Undertekst, Normaltekst } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';
import Panel from 'nav-frontend-paneler';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';

import navBrukerKjonn from 'kodeverk/navBrukerKjonn';
import Image from 'sharedComponents/Image';
import urlMann from 'images/barn_gutt.svg';
import urlKvinne from 'images/barn_jente.svg';
import opplysningAdresseType from 'kodeverk/opplysningAdresseType';
import getAddresses from 'utils/personUtils';

import styles from './barnepanel.less';

const getChildrenAddresses = (opplysningAdresser) => {
  const addressesIndexedByType = getAddresses(opplysningAdresser);
  return addressesIndexedByType ? addressesIndexedByType[opplysningAdresseType.BOSTEDSADRESSE] : '-';
};

const getAgeFromDate = birthDate => moment().diff(moment(birthDate), 'years');
const erKvinne = genderCode => genderCode === navBrukerKjonn.KVINNE;

/**
 * Barnepanel
 *
 * Presentasjonskomponent. Viser en liste over en persons kjente barn med informasjon om
 * kjønn, navn, personnummer og adresse. Forventer å få inn en liste med personopplysningsobjekter.
 */
const Barnepanel = ({
  barneListe,
}) => {
  if (!barneListe) {
    return null;
  }
  const content = (
    <Row>
      {barneListe.map((barn, index) => (
        <Column xs="6" className={styles.kolonneMedRom} key={`${barn.navn}${index + 1}`}>
          <Column xs="1">
            <Image
              className={styles.icon}
              src={erKvinne(barn.navBrukerKjonn.kode) ? urlKvinne : urlMann}
              altCode="Person.ImageText"
              titleCode={erKvinne(barn.navBrukerKjonn.kode) ? 'Person.Girl' : 'Person.Boy'}
            />
          </Column>
          <Column xs="11">
            <Element>
              {barn.navn}
              {' '}
              <FormattedMessage id="Person.Age" values={{ age: getAgeFromDate(barn.fodselsdato) }} />
            </Element>
            <Undertekst>{barn.fnr}</Undertekst>
            <div className={styles.undertekstMedRom}>
              <Undertekst>
                <FormattedMessage id="Barnepanel.Adresse1" />
              </Undertekst>
            </div>
            {barn.adresser
            && (
            <Normaltekst>
              {getChildrenAddresses(barn.adresser)}
            </Normaltekst>
            )
            }
          </Column>
        </Column>
      ))}
    </Row>
  );
  return <Panel className={styles.panel}>{content}</Panel>;
};
Barnepanel.propTypes = {
  barneListe: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
export default Barnepanel;
