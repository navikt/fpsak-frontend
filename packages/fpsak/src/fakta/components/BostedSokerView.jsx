import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { Row, Column } from 'nav-frontend-grid';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import Etikettfokus from 'nav-frontend-etiketter';

import kodeverkTyper from 'kodeverk/kodeverkTyper';
import kodeverkPropType from 'kodeverk/kodeverkPropType';
import { getKodeverk } from 'kodeverk/duck';
import personopplysningPropType from 'behandling/proptypes/personopplysningPropType';
import opplysningAdresseType from 'kodeverk/opplysningAdresseType';
import getAddresses from 'utils/personUtils';
import personstatusType from 'kodeverk/personstatusType';
import Region from 'kodeverk/region';

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

const getPersonstatus = personopplysning => (personopplysning.avklartPersonstatus && personopplysning.avklartPersonstatus.overstyrtPersonstatus
  ? personopplysning.avklartPersonstatus.overstyrtPersonstatus
  : personopplysning.personstatus);

export const BostedSokerView = ({
  soker,
  typeSoker,
  className,
  intl,
  regionTypes,
  sivilstandTypes,
  personstatusTypes,
}) => (
  <div className={className}>
    <Row>
      <Column xs="8">
        <Undertekst>{typeSoker}</Undertekst>
        <Element>{soker.navn ? soker.navn : '-'}</Element>
        <Normaltekst className={styles.paddingBottom}>
          {getAdresse(soker.adresser)}
        </Normaltekst>
        <Undertekst>
          <FormattedMessage id="BostedSokerView.ForeignAddresse" />
        </Undertekst>
        <Normaltekst>{getUtlandsadresse(soker.adresser)}</Normaltekst>
      </Column>
      <Column xs="4">
        {getPersonstatus(soker)
          && (
          <div className={styles.etikettMargin}>
            <Etikettfokus
              className={getPersonstatus(soker).kode === personstatusType.DOD ? styles.dodEtikett : ''}
              type="fokus"
              typo="undertekst"
              title={intl.formatMessage({ id: 'Personstatus.Hjelpetekst' })}
            >
              {personstatusTypes.find(s => s.kode === getPersonstatus(soker).kode).navn}
            </Etikettfokus>
          </div>
          )
        }
        {soker.sivilstand
          && (
          <div className={styles.etikettMargin}>
            <Etikettfokus
              type="fokus"
              typo="undertekst"
              title={intl.formatMessage({ id: 'Sivilstand.Hjelpetekst' })}
            >
              {sivilstandTypes.find(s => s.kode === soker.sivilstand.kode).navn}
            </Etikettfokus>
          </div>
          )
        }
        {(soker.region && soker.region.kode !== Region.UDEFINERT)
          && (
          <div className={styles.etikettMargin}>
            <Etikettfokus
              type="fokus"
              typo="undertekst"
              title={intl.formatMessage({ id: 'BostedSokerView.Region' })}
            >
              {regionTypes.find(r => r.kode === soker.region.kode).navn}
            </Etikettfokus>
          </div>
          )
        }
      </Column>
    </Row>
  </div>
);

BostedSokerView.propTypes = {
  soker: personopplysningPropType.isRequired,
  typeSoker: PropTypes.node.isRequired,
  intl: intlShape.isRequired,
  className: PropTypes.string,
  regionTypes: kodeverkPropType.isRequired,
  sivilstandTypes: kodeverkPropType.isRequired,
  personstatusTypes: kodeverkPropType.isRequired,
};

BostedSokerView.defaultProps = {
  className: styles.defaultBostedSoker,
};

const mapStateToProps = state => ({
  regionTypes: getKodeverk(kodeverkTyper.REGION)(state),
  sivilstandTypes: getKodeverk(kodeverkTyper.SIVILSTAND_TYPE)(state),
  personstatusTypes: getKodeverk(kodeverkTyper.PERSONSTATUS_TYPE)(state),
});

export default injectIntl(connect(mapStateToProps)(BostedSokerView));
