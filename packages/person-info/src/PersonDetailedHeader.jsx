import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';
import { Element, Undertekst, Undertittel } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import nbKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import { Image } from '@fpsak-frontend/shared-components';
import urlMann from '@fpsak-frontend/assets/images/mann.svg';
import urlKvinne from '@fpsak-frontend/assets/images/kvinne.svg';
import urlUkjent from '@fpsak-frontend/assets/images/ukjent.svg';
import AlderVisning from './Aldervisning';
import MerkePanel from './Merkepanel';

import styles from './personDetailedHeader.less';

const getAgeFromDate = (birthDate) => moment().diff(moment(birthDate), 'years');

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
  const intl = useIntl();
  const content = (
    <>
      <Image
        intl={intl}
        className={styles.icon}
        src={getPersonImage(navBrukerKjonn ? navBrukerKjonn.kode : '')}
        alt={intl.formatMessage({ id: 'Person.ImageText' })}
        title={intl.formatMessage({ id: getTitleCode(navBrukerKjonn ? navBrukerKjonn.kode : '') })}
      />
      <div className={styles.infoPlaceholder}>
        <div>
          {!hasAktorId
            && (
              <>
                <Undertittel>
                  <FormattedMessage id="Person.UkjentNavn" />
                </Undertittel>
                <Undertekst>
                  <FormattedMessage id="Person.HarIkkeNorskFnrEllerDnr" />
                </Undertekst>
              </>
            )}
          {hasAktorId
            && (
              <>
                {isPrimaryParent
                && (
                <Undertittel>
                  {`${navn} `}
                  <AlderVisning erDod={isDod} alder={alder} dodsdato={dodsdato} />
                </Undertittel>
                )}
                {!isPrimaryParent
                && (
                <Element>
                  {`${navn} `}
                  <AlderVisning erDod={isDod} alder={alder} dodsdato={dodsdato} />
                </Element>
                )}
                <Undertekst>
                  {fnr}
                </Undertekst>
              </>
            )}
        </div>
        <MerkePanel erDod={isDod} erVerge={harVerge} diskresjonskode={diskresjonskode ? diskresjonskode.kode : null} />
      </div>
    </>
  );
  return medPanel ? <Panel>{content}</Panel> : content;
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
