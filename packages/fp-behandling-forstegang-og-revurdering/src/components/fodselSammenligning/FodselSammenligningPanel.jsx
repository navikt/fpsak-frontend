import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { Row, Column } from 'nav-frontend-grid';
import { Table, TableRow, TableColumn } from '@fpsak-frontend/shared-components';
import Panel from 'nav-frontend-paneler';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { getAntallDodfodteBarn, getBarnFraTpsRelatertTilSoknad } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import FodselSammenligningOtherPanel from './FodselSammenligningOtherPanel';
import FodselSammenligningRevurderingPanel from './FodselSammenligningRevurderingPanel';

import styles from './fodselSammenligningPanel.less';

const formatDate = date => (date ? moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) : '-');
/**
 * FodselSammenlingningPanel
 *
 * Presentasjonskomponent. Viser sammenligning av fødsel ved ytelsesvedtak/søknad og oppdatert informasjon fra TPS.
 */
export const FodselSammenligningPanel = ({
  intl,
  behandlingsTypeKode,
  antallBarn,
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
    <Panel className={styles.panel} name="tpsFodseldato">
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
        <Column xs="4"><Normaltekst><FormattedMessage id="FodselsammenligningPanel.Fodselsdato" /></Normaltekst></Column>
        <Column xs="4"><Normaltekst><FormattedMessage id="FodselsammenligningPanel.Dodsdato" /></Normaltekst></Column>
      </Row>
      <Row>
        {antallBarn.length > 0
        && (
        <Table>
          {antallBarn.map((barn) => {
          const key = barn.fodselsdato + barn.dodsdato;
          return (
            <TableRow key={key} id={key}>
              <TableColumn>
                <Normaltekst>
                  {formatDate(barn.fodselsdato)}
                </Normaltekst>
              </TableColumn>
              <TableColumn>
                <Normaltekst>
                  {formatDate(barn.dodsdato)}
                </Normaltekst>
              </TableColumn>
              <TableColumn>
                {barn.dodsdato
                && (
                <EtikettInfo className={styles.dodMerke} typo="undertekst" title={intl.formatMessage({ id: 'FodselsammenligningPanel.Dod' })}>
                  <FormattedMessage id="FodselsammenligningPanel.Dod" />
                </EtikettInfo>
)
              }
              </TableColumn>
            </TableRow>
          );
        })
        }
        </Table>
)
      }
        {' '}
        {!antallBarn.length > 0
      && (
      <Row>
        <Column xs="12" className={styles.noChildrenInTps}>
          <Normaltekst>
          -
          </Normaltekst>
        </Column>
      </Row>
)

      }
      </Row>
    </Panel>
  </div>
);

FodselSammenligningPanel.propTypes = {
  intl: intlShape.isRequired,
  behandlingsTypeKode: PropTypes.string.isRequired,
  antallBarn: PropTypes.arrayOf(PropTypes.shape()),
  nrOfDodfodteBarn: PropTypes.number.isRequired,
};

FodselSammenligningPanel.defaultProps = {
  antallBarn: [],
};

const mapStateToProps = state => ({
  antallBarn: getBarnFraTpsRelatertTilSoknad(state),
  nrOfDodfodteBarn: getAntallDodfodteBarn(state),
  behandlingsTypeKode: behandlingSelectors.getBehandlingType(state).kode,
});

export default connect(mapStateToProps)(injectIntl(FodselSammenligningPanel));
