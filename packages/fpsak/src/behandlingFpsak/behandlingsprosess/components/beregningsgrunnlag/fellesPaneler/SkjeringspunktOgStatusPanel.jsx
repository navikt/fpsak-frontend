import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { BorderBox, DateLabel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  getAktivitetStatuser,
  getSkjæringstidspunktBeregning,
  getTilstøtendeYtelse,
} from 'behandlingFpsak/behandlingSelectors';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';

import styles from './skjeringspunktOgStatusPanel.less';

const createAktivitetstatusString = (listeMedStatuser, tilstøtendeYtelseType) => {
  const tekstList = [];
  const listeMedKoder = listeMedStatuser.map(status => status.kode);
  if (listeMedKoder.includes(aktivitetStatus.DAGPENGER)) {
    tekstList.push('Tilstøtende ytelse dagpenger');
  }
  if (listeMedKoder.includes(aktivitetStatus.ARBEIDSAVKLARINGSPENGER)) {
    tekstList.push('Tilstøtende ytelse AAP');
  }
  if (listeMedKoder.includes(aktivitetStatus.TILSTOTENDE_YTELSE)) {
    tekstList.push(`Tilstøtende ytelse ${tilstøtendeYtelseType}`);
  }
  if (listeMedKoder.includes(aktivitetStatus.MILITAER_ELLER_SIVIL)) {
    tekstList.push('Militær eller sivilforsvarstjeneste');
  }
  const statuserMedEgneNavn = listeMedStatuser.filter(status => status.kode !== aktivitetStatus.ARBEIDSAVKLARINGSPENGER
    && status.kode !== aktivitetStatus.DAGPENGER
    && status.kode !== aktivitetStatus.TILSTOTENDE_YTELSE
    && status.kode !== aktivitetStatus.MILITAER_ELLER_SIVIL);
  statuserMedEgneNavn.forEach((status) => {
    tekstList.push(status.navn);
  });
  let tekstString = '';
  if (tekstList.length > 2) {
    const sisteElement = tekstList.splice(tekstList.length - 1, 1);
    tekstString = tekstList.join(', ');
    tekstString = `${tekstString} og ${sisteElement[0].toLowerCase()}`;
    return tekstString;
  }

  if (tekstList.length === 1) {
    return tekstList[0];
  } if (tekstList.length === 2) {
    tekstString = `${tekstList[0]} og ${tekstList[1].toLowerCase()}`;
    return tekstString;
  } if (tekstList.length > 2) {
    const sisteElement = tekstList.splice(tekstList.length - 1, 1);
    tekstString = tekstList.join(',');
    tekstString = `${tekstString} og ${sisteElement[0].toLowerCase()}`;
    return tekstString;
  }
  return tekstString;
};

/**
 * SkjeringspunktOgStatusPanel
 *
 * Viser faktagruppe med skjæringstidspunkt for beregningen og en liste med aktivitetsstatuser.
 */

export const SkjeringspunktOgStatusPanelImpl = ({
  skjeringstidspunktDato,
  aktivitetStatusList,
  tilstøtendeYtelseType,
}) => (
  <BorderBox className={styles.setBoxHeight}>
    <Element>
      <FormattedMessage id="Beregningsgrunnlag.Skjeringstidspunkt.ApplicationInformation" />
    </Element>
    <VerticalSpacer sixteenPx />
    <Undertekst>
      <FormattedMessage id="Beregningsgrunnlag.Skjeringstidspunkt.SkjeringForBeregning" />
    </Undertekst>
    <Normaltekst>
      <DateLabel dateString={skjeringstidspunktDato} />
    </Normaltekst>
    <div className={styles.bottomText}>
      <Undertekst>
        <FormattedMessage id="Beregningsgrunnlag.Skjeringstidspunkt.Status" />
      </Undertekst>
      <Normaltekst>
        {createAktivitetstatusString(aktivitetStatusList, tilstøtendeYtelseType)}
      </Normaltekst>
    </div>
  </BorderBox>
);

SkjeringspunktOgStatusPanelImpl.propTypes = {
  skjeringstidspunktDato: PropTypes.string.isRequired,
  aktivitetStatusList: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  tilstøtendeYtelseType: PropTypes.string,
};

SkjeringspunktOgStatusPanelImpl.defaultProps = {
  tilstøtendeYtelseType: '',
};


const mapStateToProps = (state) => {
  const tilstøtendeYtelse = getTilstøtendeYtelse(state);
  const skjeringstidspunktDato = getSkjæringstidspunktBeregning(state);
  const aktivitetStatusList = getAktivitetStatuser(state);
  const ytelseType = tilstøtendeYtelse ? getKodeverk(kodeverkTyper.RELATERT_YTELSE_TYPE)(state)
    .filter(ik => ik.kode === tilstøtendeYtelse.ytelseType.kode)[0].navn : '';
  return {
    skjeringstidspunktDato,
    aktivitetStatusList,
    tilstøtendeYtelseType: ytelseType,
  };
};

export default connect(mapStateToProps)(SkjeringspunktOgStatusPanelImpl);