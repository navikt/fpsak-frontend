import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import { DateLabel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import Panel from 'nav-frontend-paneler';
import { EtikettInfo } from 'nav-frontend-etiketter';


import styles from './skjeringspunktOgStatusPanel_V2.less';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';


export const RADIO_GROUP_FIELD_DEKNINGSGRAD_NAVN = 'dekningsgrad';


const createStatusEtiketter = (listeMedStatuser, getKodeverknavn) => {
  const statusList = [];
  const unikeStatuser = listeMedStatuser.filter((status, index, self) => index === self.findIndex((t) => (
    t.kode === status.kode)));
  console.log('unike statuser', unikeStatuser);
  const statuserMedEgneNavn = unikeStatuser.filter((status) => status.kode !== aktivitetStatus.ARBEIDSAVKLARINGSPENGER
    && status.kode !== aktivitetStatus.DAGPENGER
    && status.kode !== aktivitetStatus.MILITAER_ELLER_SIVIL);

  statuserMedEgneNavn.forEach((status) => {
    const statusName = getKodeverknavn(status);

    statusList.push({ visningsNavn: statusName, kode: status.kode, className: `statusFarge${status.kode}` });
  });
  statusList.sort((a, b) => ((a.visningsNavn > b.visningsNavn) ? 1 : -1));
  return (
    <>
      {statusList.map((status) => (
        <EtikettInfo className={styles[status.className]} title={status.visningsNavn}>{status.visningsNavn}</EtikettInfo>
      ))}
    </>
  );
};

/**
 * SkjeringspunktOgStatusPanel
 *
 * Viser skjæringstidspunkt for beregningen og en liste med aktivitetsstatuser.
 */

export const SkjeringspunktOgStatusPanelImpl = ({
  skjeringstidspunktDato,
  aktivitetStatusList,
  getKodeverknavn,
}) => (
  <Panel>
    <Element>
      {createStatusEtiketter(aktivitetStatusList, getKodeverknavn)}
    </Element>
    <VerticalSpacer sixteenPx />
    <Row>
      <Column xs="7">
        <Normaltekst>
          <FormattedMessage id="Beregningsgrunnlag.Skjeringstidspunkt.SkjeringForBeregning" />
        </Normaltekst>
      </Column>

      <Column xs="5">
        <Normaltekst className={beregningStyles.semiBoldText}>
          <DateLabel dateString={skjeringstidspunktDato} />
        </Normaltekst>
      </Column>

    </Row>
  </Panel>
);

SkjeringspunktOgStatusPanelImpl.propTypes = {
  skjeringstidspunktDato: PropTypes.string.isRequired,
  aktivitetStatusList: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

SkjeringspunktOgStatusPanelImpl.defaultProps = {

};

const mapStateToProps = (state, ownProps) => {
  const getKodeverknavn = getKodeverknavnFn(ownProps.alleKodeverk, kodeverkTyper);
  return {
    getKodeverknavn,
  };
};

const SkjeringspunktOgStatusPanel = connect(mapStateToProps)(SkjeringspunktOgStatusPanelImpl);

SkjeringspunktOgStatusPanel.buildInitialValues = (gjeldendeDekningsgrad, gjeldendeAksjonspunkter) => {
  const aksjonspunkt = gjeldendeAksjonspunkter && gjeldendeAksjonspunkter.find((ap) => ap.definisjon.kode === aksjonspunktCodes.VURDER_DEKNINGSGRAD);
  const initialDekningsgrad = aksjonspunkt && gjeldendeDekningsgrad === 100 ? gjeldendeDekningsgrad : undefined;
  return { [RADIO_GROUP_FIELD_DEKNINGSGRAD_NAVN]: initialDekningsgrad };
};

export default SkjeringspunktOgStatusPanel;
