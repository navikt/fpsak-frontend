import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { Undertekst, Normaltekst } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';
import { Row, Column } from 'nav-frontend-grid';
import { EtikettFokus } from 'nav-frontend-etiketter';

import kodeverkTyper from 'kodeverk/kodeverkTyper';
import kodeverkPropType from 'kodeverk/kodeverkPropType';
import { getKodeverk } from 'kodeverk/duck';
import { getLanguageCodeFromSprakkode } from 'utils/languageUtils';

import styles from './adressePanel.less';

/**
 * AdressePanel
 *
 * Presentasjonskomponent. Har ansvar for å vise de kjente adressene til en person. Viser tilhørende labels hvis
 * en person er: bosatt, norsk statsborger eller skilt. Viser også label for foretrukket målform eller engelsk.
 */
export const AdressePanel = ({
  intl,
  bostedsadresse,
  midlertidigAdresse,
  postAdresseNorge,
  postadresseUtland,
  region,
  personstatus,
  sivilstandtype,
  sprakkode,
  sivilstandTypes,
  personstatusTypes,
  isPrimaryParent,
}) => {
  const malformTekstKode = getLanguageCodeFromSprakkode(sprakkode);
  const content = (
    <div>
      <Row>
        <div className={styles.etikettPanel}>
          {region
          && (
          <EtikettFokus
            type="fokus"
            typo="undertekst"
            title={intl.formatMessage({ id: 'Statsborgerskap.Hjelpetekst' })}
          >
            {region}
          </EtikettFokus>
          )
          }
          <EtikettFokus
            type="fokus"
            typo="undertekst"
            title={intl.formatMessage({ id: 'Personstatus.Hjelpetekst' })}
          >
            {personstatusTypes.find(s => s.kode === personstatus.kode).navn}
          </EtikettFokus>
          {sivilstandtype
          && (
          <EtikettFokus
            type="fokus"
            typo="undertekst"
            title={intl.formatMessage({ id: 'Sivilstand.Hjelpetekst' })}
          >
            {sivilstandTypes.find(s => s.kode === sivilstandtype.kode).navn}
          </EtikettFokus>
          )
          }
          {isPrimaryParent
          && (
          <EtikettFokus
            type="fokus"
            typo="undertekst"
            title={intl.formatMessage({ id: 'Malform.Beskrivelse' })}
          >
            {intl.formatMessage({ id: malformTekstKode })}
          </EtikettFokus>
          )
          }
        </div>
      </Row>
      <Row>
        <Column xs="4">
          <Undertekst>
            {intl.formatMessage({ id: 'AdressePanel.bostedsadresse' })}
          </Undertekst>
          <Normaltekst>
            {bostedsadresse}
          </Normaltekst>
          <div className={styles.undertekstMedRom}>
            <Undertekst>
              {intl.formatMessage({ id: 'AdressePanel.postadresseNorge' })}
            </Undertekst>
          </div>
          <Normaltekst>
            {postAdresseNorge}
          </Normaltekst>
        </Column>
        <Column xs="4">
          <Undertekst>
            {intl.formatMessage({ id: 'AdressePanel.midlertidigAdresse' })}
          </Undertekst>
          <Normaltekst>
            {midlertidigAdresse}
          </Normaltekst>
          <div className={styles.undertekstMedRom}>
            <Undertekst className={styles.undertekstMedRom}>
              {intl.formatMessage({ id: 'AdressePanel.postadresseUtland' })}
            </Undertekst>
          </div>
          <Normaltekst>
            {postadresseUtland}
          </Normaltekst>
        </Column>
      </Row>
    </div>);
  return <Panel className={styles.panel}>{content}</Panel>;
};

AdressePanel.propTypes = {
  intl: intlShape.isRequired,
  bostedsadresse: PropTypes.string,
  midlertidigAdresse: PropTypes.string,
  postAdresseNorge: PropTypes.string,
  postadresseUtland: PropTypes.string,
  sprakkode: PropTypes.shape().isRequired,
  region: PropTypes.string,
  personstatus: PropTypes.shape().isRequired,
  sivilstandtype: PropTypes.shape(),
  sivilstandTypes: kodeverkPropType.isRequired,
  personstatusTypes: kodeverkPropType.isRequired,
  isPrimaryParent: PropTypes.bool.isRequired,
};

AdressePanel.defaultProps = {
  bostedsadresse: '-',
  midlertidigAdresse: '-',
  postAdresseNorge: '-',
  postadresseUtland: '-',
  region: undefined,
  sivilstandtype: undefined,
};

const mapStateToProps = state => ({
  sivilstandTypes: getKodeverk(kodeverkTyper.SIVILSTAND_TYPE)(state),
  personstatusTypes: getKodeverk(kodeverkTyper.PERSONSTATUS_TYPE)(state),
});

export default injectIntl(connect(mapStateToProps)(AdressePanel));
