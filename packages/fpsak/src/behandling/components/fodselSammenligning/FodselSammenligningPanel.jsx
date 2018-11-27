import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';
import { createSelector } from 'reselect';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { Row, Column } from 'nav-frontend-grid';
import Panel from 'nav-frontend-paneler';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { getAntallDodfodteBarn, getBarnFraTpsRelatertTilSoknad, getBehandlingType } from 'behandling/behandlingSelectors';
import behandlingType from 'kodeverk/behandlingType';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from 'utils/formats';
import FodselSammenligningOtherPanel from './FodselSammenligningOtherPanel';
import FodselSammenligningRevurderingPanel from './FodselSammenligningRevurderingPanel';

import styles from './fodselSammenligningPanel.less';

/**
 * FodselSammenlingningPanel
 *
 * Presentasjonskomponent. Viser sammenligning av fødsel ved ytelsesvedtak/søknad og oppdatert informasjon fra TPS.
 */
export const FodselSammenligningPanel = ({
  intl,
  behandlingsTypeKode,
  antallBarn,
  fodselDato,
  nrOfDodfodteBarn,
}) => (
  <div className={styles.panelWrapper}>
    <Panel className={styles.panel}>
      {behandlingsTypeKode !== behandlingType.REVURDERING
        && <FodselSammenligningOtherPanel />
      }
      {behandlingsTypeKode === behandlingType.REVURDERING
        && <FodselSammenligningRevurderingPanel />
      }
    </Panel>
    <Panel className={styles.panel}>
      <Row>
        <Column xs="9">
          <Element><FormattedMessage id="FodselsammenligningPanel.OpplysningerTPS" /></Element>
        </Column>
        {nrOfDodfodteBarn > 0
          && (
          <Column xs="3">
            <EtikettInfo className={styles.dodMerke} typo="undertekst" title={intl.formatMessage({ id: 'FodselsammenligningPanel.Dodfodt' })}>
              <FormattedMessage id="FodselsammenligningPanel.Dodfodt" />
            </EtikettInfo>
          </Column>
          )
        }
      </Row>
      <Row>
        <Column xs="6"><Normaltekst><FormattedMessage id="FodselsammenligningPanel.Fodselsdato" /></Normaltekst></Column>
        <Column xs="6"><Normaltekst><FormattedMessage id="FodselsammenligningPanel.AntallBarn" /></Normaltekst></Column>
      </Row>
      <Row>
        <Column xs="6" name="tpsFodseldato">
          <Normaltekst>{fodselDato}</Normaltekst>
        </Column>
        <Column xs="6" name="tpsAntallBarn">
          <Normaltekst>{antallBarn}</Normaltekst>
        </Column>
      </Row>
    </Panel>
  </div>
);

FodselSammenligningPanel.propTypes = {
  intl: intlShape.isRequired,
  behandlingsTypeKode: PropTypes.string.isRequired,
  antallBarn: PropTypes.number.isRequired,
  fodselDato: PropTypes.string.isRequired,
  nrOfDodfodteBarn: PropTypes.number.isRequired,
};

const formatDate = date => (date ? moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) : '-');

const getFodselDate = createSelector(
  [getBarnFraTpsRelatertTilSoknad], barnFraTpsRelatertTilSoknad => (barnFraTpsRelatertTilSoknad.length > 0
    ? formatDate(barnFraTpsRelatertTilSoknad[0].fodselsdato) : '-'),
);

const mapStateToProps = state => ({
  antallBarn: getBarnFraTpsRelatertTilSoknad(state).length,
  fodselDato: getFodselDate(state),
  nrOfDodfodteBarn: getAntallDodfodteBarn(state),
  behandlingsTypeKode: getBehandlingType(state).kode,
});

export default connect(mapStateToProps)(injectIntl(FodselSammenligningPanel));
