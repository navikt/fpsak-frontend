import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import { BorderBox, DateLabel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import dekningsgrad from '@fpsak-frontend/kodeverk/src/dekningsgrad';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import ElementWrapper from '@fpsak-frontend/shared-components/src/ElementWrapper';
import beregningsgrunnlagAksjonspunkterPropType from '../../propTypes/beregningsgrunnlagAksjonspunkterPropType';

import styles from './skjeringspunktOgStatusPanel.less';

export const RADIO_GROUP_FIELD_DEKNINGSGRAD_NAVN = 'dekningsgrad';
const { VURDER_DEKNINGSGRAD } = aksjonspunktCodes;

const createAktivitetstatusString = (listeMedStatuser, getKodeverknavn) => {
  const tekstList = [];
  const listeMedKoder = listeMedStatuser.map((status) => status.kode);
  if (listeMedKoder.includes(aktivitetStatus.DAGPENGER)) {
    tekstList.push('Tilstøtende ytelse dagpenger');
  }
  if (listeMedKoder.includes(aktivitetStatus.ARBEIDSAVKLARINGSPENGER)) {
    tekstList.push('Tilstøtende ytelse AAP');
  }
  if (listeMedKoder.includes(aktivitetStatus.MILITAER_ELLER_SIVIL)) {
    tekstList.push('Militær eller sivilforsvarstjeneste');
  }
  const statuserMedEgneNavn = listeMedStatuser.filter((status) => status.kode !== aktivitetStatus.ARBEIDSAVKLARINGSPENGER
    && status.kode !== aktivitetStatus.DAGPENGER
    && status.kode !== aktivitetStatus.MILITAER_ELLER_SIVIL);
  statuserMedEgneNavn.forEach((status) => {
    tekstList.push(getKodeverknavn(status));
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
  }
  if (tekstList.length === 2) {
    tekstString = `${tekstList[0]} og ${tekstList[1].toLowerCase()}`;
    return tekstString;
  }
  if (tekstList.length > 2) {
    const sisteElement = tekstList.splice(tekstList.length - 1, 1);
    tekstString = tekstList.join(',');
    tekstString = `${tekstString} og ${sisteElement[0].toLowerCase()}`;
    return tekstString;
  }
  return tekstString;
};

const erVurderDekningsgradAksjonspunktLukket = (aksjonspunkter) => {
  const aksjonspunkt = aksjonspunkter && aksjonspunkter.find((ap) => ap.definisjon.kode === VURDER_DEKNINGSGRAD);
  return aksjonspunkt ? !isAksjonspunktOpen(aksjonspunkt.status.kode) : false;
};

const harVurderDekningsgradAksjonspunkt = (gjeldendeAksjonspunkter) => !!gjeldendeAksjonspunkter
  && gjeldendeAksjonspunkter.some((ap) => ap.definisjon.kode === VURDER_DEKNINGSGRAD);

const lagVurderDekningsgradElementer = (readOnly, gjeldendeAksjonspunkter, gjeldendeDekningsgrad) => {
  if (harVurderDekningsgradAksjonspunkt(gjeldendeAksjonspunkter)) {
    return (
      <RadioGroupField
        name={RADIO_GROUP_FIELD_DEKNINGSGRAD_NAVN}
        validate={[required]}
        readOnly={readOnly}
        isEdited={erVurderDekningsgradAksjonspunktLukket(gjeldendeAksjonspunkter)}
      >
        <RadioOption
          disabled
          key="vurder_dekningsgrad_80"
          label={<FormattedMessage id="Beregningsgrunnlag.Skjeringstidspunkt.Prosent80" />}
          value={dekningsgrad.ATTI}
        />
        <RadioOption
          key="vurder_dekningsgrad_100"
          label={<FormattedMessage id="Beregningsgrunnlag.Skjeringstidspunkt.Prosent100" />}
          value={dekningsgrad.HUNDRE}
        />
      </RadioGroupField>
    );
  }
  return (
    <Normaltekst>
      { `${gjeldendeDekningsgrad} %` }
    </Normaltekst>
  );
};

/**
 * SkjeringspunktOgStatusPanel
 *
 * Viser faktagruppe med skjæringstidspunkt for beregningen og en liste med aktivitetsstatuser.
 */

export const SkjeringspunktOgStatusPanelImpl = ({
  readOnly,
  skjeringstidspunktDato,
  aktivitetStatusList,
  gjeldendeAksjonspunkter,
  gjeldendeDekningsgrad,
  getKodeverknavn,
}) => (
  <BorderBox className={styles.setBoxHeight}>
    <Element>
      {!!gjeldendeDekningsgrad && <FormattedMessage id="Beregningsgrunnlag.Skjeringstidspunkt.ApplicationInformation" /> }
      {!gjeldendeDekningsgrad && <FormattedMessage id="Beregningsgrunnlag.Skjeringstidspunkt.ApplicationInformationUtenDekningsgrad" />}
    </Element>
    <VerticalSpacer sixteenPx />
    <Row>
      <Column xs="7">
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
            {createAktivitetstatusString(aktivitetStatusList, getKodeverknavn)}
          </Normaltekst>
        </div>
      </Column>
      {!!gjeldendeDekningsgrad
        && (
        <Column xs="5">
          <Undertekst>
            <FormattedMessage id="Beregningsgrunnlag.Skjeringstidspunkt.Dekningsgrad" />
          </Undertekst>
          <VerticalSpacer eightPx />
          <ElementWrapper>
            { lagVurderDekningsgradElementer(readOnly, gjeldendeAksjonspunkter, gjeldendeDekningsgrad) }
          </ElementWrapper>
        </Column>
        )}
    </Row>
  </BorderBox>
);

SkjeringspunktOgStatusPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  skjeringstidspunktDato: PropTypes.string.isRequired,
  aktivitetStatusList: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  gjeldendeAksjonspunkter: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
  gjeldendeDekningsgrad: PropTypes.number,
  getKodeverknavn: PropTypes.func.isRequired,
};

SkjeringspunktOgStatusPanelImpl.defaultProps = {
  gjeldendeDekningsgrad: undefined,
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
