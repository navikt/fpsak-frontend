import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'nav-frontend-paneler';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import {
  DateLabel, FlexColumn, FlexContainer, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { Column, Row } from 'nav-frontend-grid';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { dateFormat, formatCurrencyNoKr } from '@fpsak-frontend/utils';
import Lesmerpanel from 'nav-frontend-lesmerpanel';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';
import styles from './naeringsOpplysningsPanel.less';


const virksomhetsDatoer = (naringsAndel) => {
  const datoArr = [];
  if (Object.prototype.hasOwnProperty.call(naringsAndel, 'oppstartsdato') && naringsAndel.oppstartsdato) {
    datoArr.push(dateFormat(naringsAndel.oppstartsdato));
  }
  if (Object.prototype.hasOwnProperty.call(naringsAndel, 'opphoersdato') && naringsAndel.opphoersdato) {
    datoArr.push(' - ');
    datoArr.push(dateFormat(naringsAndel.opphoersdato));
  }
  return datoArr.join(' ');
};
const revisorDetaljer = (naringsAndel) => {
  let detaljer = '';
  if (Object.prototype.hasOwnProperty.call(naringsAndel, 'regnskapsførerNavn') && naringsAndel.regnskapsførerNavn) {
    detaljer += naringsAndel.regnskapsførerNavn;
  }
  if (Object.prototype.hasOwnProperty.call(naringsAndel, 'regnskapsførerTlf') && naringsAndel.regnskapsførerTlf) {
    detaljer += ` ${naringsAndel.regnskapsførerTlf}`;
  }
  if (Object.prototype.hasOwnProperty.call(naringsAndel, 'kanRegnskapsførerKontaktes')) {
    detaljer = (
      <span>
        {detaljer}
        {' '}
        <FormattedMessage
          id={`Beregningsgrunnlag.NaeringsOpplysningsPanel.${naringsAndel.kanRegnskapsførerKontaktes ? 'RevisorKanKontaktes' : 'RevisorKanIkkeKontaktes'}`}
        />
      </span>
    );
  }
  return detaljer;
};


const lagBeskrivelsePanel = (naringsAndel) => (
  <>
    <Lesmerpanel
      intro={(
        <>
          <FlexContainer>
            <FlexRow>
              <FlexColumn>
                <Normaltekst>
                  <FormattedMessage id="Beregningsgrunnlag.NaeringsOpplysningsPanel.Begrunnelse" />
                </Normaltekst>
              </FlexColumn>
              <FlexColumn>
                <Normaltekst className={beregningStyles.semiBoldText}>
                  <DateLabel dateString={naringsAndel.endringsdato} />
                </Normaltekst>
              </FlexColumn>
            </FlexRow>
          </FlexContainer>
        </>
)}
      lukkTekst="Skjul beskrivelse"
      apneTekst="Vis beskrivelse"
      defaultApen
    >
      <Normaltekst className={styles.beskrivelse}>
        {naringsAndel.begrunnelse}
      </Normaltekst>
    </Lesmerpanel>

  </>
);

export const NaeringsopplysningsPanel = ({
  alleAndelerIForstePeriode,
}) => {
  const snAndel = alleAndelerIForstePeriode.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
  return (
    <Panel className={beregningStyles.panel}>
      <Element className={beregningStyles.semiBoldText}>
        <FormattedMessage id="Beregningsgrunnlag.NaeringsOpplysningsPanel.Overskrift" />
      </Element>
      <Row key="SNInntektIngress">
        <Column xs="8" />
        <Column xs="4">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.NaeringsOpplysningsPanel.OppgittAar" />
          </Normaltekst>
        </Column>
      </Row>
      <VerticalSpacer fourPx />
      {snAndel.næringer.map((naring, index) => (
        <React.Fragment key={`NaringsWrapper${index + 1}`}>
          <Row key={`NaringsNavn${index + 1}`}>
            <Column xs="6">
              <Normaltekst>
                <span>Bedriftsnavn</span>
              </Normaltekst>
            </Column>
            <Column xs="2">
              <Normaltekst>
                {naring.virksomhetType && naring.virksomhetType.kode ? naring.virksomhetType.kode : ''}
              </Normaltekst>
            </Column>
            <Column xs="4">
              <Normaltekst>
                {formatCurrencyNoKr(naring.oppgittInntekt)}
              </Normaltekst>
            </Column>
          </Row>
          <Row key={`NaringsDetaljer${index + 1}`}>
            <Column xs="2">
              <Normaltekst>
                {naring && naring.orgnr ? naring.orgnr : ''}
              </Normaltekst>
            </Column>
            <Column xs="2">
              <Normaltekst>
                {virksomhetsDatoer(naring)}
              </Normaltekst>
            </Column>
          </Row>
          <Row key={`RevisorRad${index + 1}`}>
            <Column xs="10">
              <Normaltekst>
                {revisorDetaljer(naring)}
              </Normaltekst>
            </Column>
          </Row>
          <Row>
            {lagBeskrivelsePanel(naring)}
          </Row>
        </React.Fragment>
      ))}
    </Panel>
  );
};

NaeringsopplysningsPanel.propTypes = {
  alleAndelerIForstePeriode: PropTypes.arrayOf(PropTypes.shape()),
};
NaeringsopplysningsPanel.defaultProps = {
  alleAndelerIForstePeriode: undefined,
};


export default NaeringsopplysningsPanel;
