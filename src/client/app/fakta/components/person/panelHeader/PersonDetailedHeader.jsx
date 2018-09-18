import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { Element, Undertittel, Undertekst } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';

import personstatusType from 'kodeverk/personstatusType';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import nbKjonn from 'kodeverk/navBrukerKjonn';
import Image from 'sharedComponents/Image';
import urlMann from 'images/mann.svg';
import urlKvinne from 'images/kvinne.svg';
import urlUkjent from 'images/ukjent.svg';
import AlderVisning from './Aldervisning';
import MerkePanel from './Merkepanel';
import styles from './personDetailedHeader.less';

const getAgeFromDate = birthDate => moment().diff(moment(birthDate), 'years');

const getPersonImage = (navBrukerKjonnKode) => {
  if (navBrukerKjonnKode === nbKjonn.KVINNE) {
    return urlKvinne;
  }
  return navBrukerKjonnKode === nbKjonn.MANN ? urlMann : urlUkjent;
};

const getTitleCode = (navBrukerKjonnKode) => {
  if (navBrukerKjonnKode === nbKjonn.KVINNE) {
    return 'Person.Woman';
  }
  return navBrukerKjonnKode === nbKjonn.MANN ? 'Person.Man' : 'Person.Unknown';
};

const getCurrentPersonstatus = (personstatus, avklartPersonstatus) => {
  if (avklartPersonstatus && avklartPersonstatus.overstyrtPersonstatus) {
    return avklartPersonstatus.overstyrtPersonstatus;
  }
  return personstatus;
};

/**
 * PersonDetailedHeader
 *
 * Presentasjonskomponent. Definerer visning av personen relatert til fagsak. (Søker)
 *
 * Eksempel:
 * ```html
 * <PersonDetailedHeader personopplysninger={} isPrimaryParent medPanel />
 * ```
 */
const PersonDetailedHeader = ({
  personopplysninger,
  hasAktorId,
  isPrimaryParent,
  medPanel,
}) => {
  const {
    navn, fodselsdato, fnr, navBrukerKjonn, diskresjonskode, personstatus, avklartPersonstatus, dodsdato, harVerge,
  } = personopplysninger;
  const alder = getAgeFromDate(fodselsdato);
  const currentPersonstatus = getCurrentPersonstatus(personstatus, avklartPersonstatus);
  const isDod = currentPersonstatus ? currentPersonstatus.kode === personstatusType.DOD : false;

  const content = (
    <div>
      <Image
        className={styles.icon}
        src={getPersonImage(navBrukerKjonn.kode)}
        altCode="Person.ImageText"
        titleCode={getTitleCode(navBrukerKjonn.kode)}
      />
      <div className={styles.infoPlaceholder}>
        <div>
          {!hasAktorId
            && (
            <ElementWrapper>
              <Undertittel>
                <FormattedMessage id="Person.UkjentNavn" />
              </Undertittel>
              <Undertekst>
                <FormattedMessage id="Person.HarIkkeNorskFnrEllerDnr" />
              </Undertekst>
            </ElementWrapper>
            )
          }
          {hasAktorId
            && (
            <ElementWrapper>
              {isPrimaryParent
                && (
                <Undertittel>
                  {navn}
                  {' '}
                  <AlderVisning erDod={isDod} alder={alder} dodsdato={dodsdato} />
                </Undertittel>
                )
              }
              {!isPrimaryParent
                && (
                <Element>
                  {navn}
                  {' '}
                  <AlderVisning erDod={isDod} alder={alder} dodsdato={dodsdato} />
                </Element>
                )
              }
              <Undertekst>
                {fnr}
              </Undertekst>
            </ElementWrapper>
            )
          }
        </div>
        <div>
          <MerkePanel erDod={isDod} erVerge={harVerge} diskresjonskode={diskresjonskode ? diskresjonskode.kode : null} />
        </div>
      </div>
    </div>);
  return medPanel ? <Panel className={styles.padding}>{content}</Panel> : content;
};

PersonDetailedHeader.propTypes = {
  personopplysninger: PropTypes.shape().isRequired,
  medPanel: PropTypes.bool,
  isPrimaryParent: PropTypes.bool,
  hasAktorId: PropTypes.bool,
};

PersonDetailedHeader.defaultProps = {
  medPanel: false,
  isPrimaryParent: false,
  hasAktorId: true,
};

export default PersonDetailedHeader;
