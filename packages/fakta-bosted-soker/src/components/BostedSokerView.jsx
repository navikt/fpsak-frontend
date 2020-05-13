import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import Etikettfokus from 'nav-frontend-etiketter';

import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import { getAddresses } from '@fpsak-frontend/utils';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import Region from '@fpsak-frontend/kodeverk/src/region';
import { Tooltip } from '@fpsak-frontend/shared-components';

import bostedSokerPersonopplysningerPropType from '../propTypes/bostedSokerPersonopplysningerPropType';

import styles from './bostedSokerView.less';

const getAdresse = (adresser) => {
  const adresseListe = getAddresses(adresser);
  const adresse = adresseListe[opplysningAdresseType.POSTADRESSE] || adresseListe[opplysningAdresseType.BOSTEDSADRESSE];
  return adresse || '-';
};

const getUtlandsadresse = (adresser) => {
  const adresseListe = getAddresses(adresser);
  const utlandsAdresse = adresseListe[opplysningAdresseType.UTENLANDSK_POSTADRESSE] || adresseListe[opplysningAdresseType.UTENLANDSK_NAV_TILLEGSADRESSE];
  return utlandsAdresse || '-';
};

const getPersonstatus = (personopplysning) => (personopplysning.avklartPersonstatus && personopplysning.avklartPersonstatus.overstyrtPersonstatus
  ? personopplysning.avklartPersonstatus.overstyrtPersonstatus
  : personopplysning.personstatus);

export const BostedSokerView = ({
  intl,
  personopplysninger,
  sokerTypeTextId,
  regionTypes,
  sivilstandTypes,
  personstatusTypes,
}) => (
  <div className={styles.defaultBostedSoker}>
    <Row>
      <Column xs="8">
        <Undertekst><FormattedMessage id={sokerTypeTextId} /></Undertekst>
        <Element>{personopplysninger.navn ? personopplysninger.navn : '-'}</Element>
        <Normaltekst className={styles.paddingBottom}>
          {getAdresse(personopplysninger.adresser)}
        </Normaltekst>
        <Undertekst>
          <FormattedMessage id="BostedSokerView.ForeignAddresse" />
        </Undertekst>
        <Normaltekst>{getUtlandsadresse(personopplysninger.adresser)}</Normaltekst>
      </Column>
      <Column xs="4">
        {getPersonstatus(personopplysninger)
          && (
          <div className={styles.etikettMargin}>
            <Tooltip content={intl.formatMessage({ id: 'Personstatus.Hjelpetekst' })} alignBottom>
              <Etikettfokus
                className={getPersonstatus(personopplysninger).kode === personstatusType.DOD ? styles.dodEtikett : ''}
                type="fokus"
                typo="undertekst"
              >
                {getPersonstatus(personopplysninger).kode === personstatusType.UDEFINERT ? intl.formatMessage({ id: 'Personstatus.Ukjent' })
                  : personstatusTypes.find((s) => s.kode === getPersonstatus(personopplysninger).kode).navn}
              </Etikettfokus>
            </Tooltip>
          </div>
          )}
        {personopplysninger.sivilstand
          && (
          <div className={styles.etikettMargin}>
            <Tooltip content={intl.formatMessage({ id: 'Sivilstand.Hjelpetekst' })} alignBottom>
              <Etikettfokus
                type="fokus"
                typo="undertekst"
              >
                {sivilstandTypes.find((s) => s.kode === personopplysninger.sivilstand.kode).navn}
              </Etikettfokus>
            </Tooltip>
          </div>
          )}
        {(personopplysninger.region && personopplysninger.region.kode !== Region.UDEFINERT)
          && (
          <div className={styles.etikettMargin}>
            <Tooltip content={intl.formatMessage({ id: 'BostedSokerView.Region' })} alignBottom>
              <Etikettfokus
                type="fokus"
                typo="undertekst"
              >
                {regionTypes.find((r) => r.kode === personopplysninger.region.kode).navn}
              </Etikettfokus>
            </Tooltip>
          </div>
          )}
      </Column>
    </Row>
  </div>
);

BostedSokerView.propTypes = {
  personopplysninger: bostedSokerPersonopplysningerPropType.isRequired,
  sokerTypeTextId: PropTypes.string.isRequired,
  intl: PropTypes.shape().isRequired,
  regionTypes: kodeverkPropType.isRequired,
  sivilstandTypes: kodeverkPropType.isRequired,
  personstatusTypes: kodeverkPropType.isRequired,
};

export default injectIntl(BostedSokerView);
