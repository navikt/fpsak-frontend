import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'nav-frontend-paneler';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Column, Row } from 'nav-frontend-grid';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { dateFormat, formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';
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
    <EkspanderbartpanelBase
      className={styles.lesMer}
      apen
      heading={(
        <>
          <div className={styles.lesMer__heading}>
            <Normaltekst>
              <FormattedMessage id="Beregningsgrunnlag.NaeringsOpplysningsPanel.Begrunnelse" values={{ endringsDato: naringsAndel.endringsdato }} />
            </Normaltekst>
          </div>
          <Normaltekst className={styles.lesMer_Mer}>Skjul beskrivelse</Normaltekst>
        </>
      )}
    >
      <Normaltekst className={styles.beskrivelse}>
        {naringsAndel.begrunnelse}
      </Normaltekst>
      <div />
    </EkspanderbartpanelBase>
    <Lesmerpanel
      intro={(
        <Normaltekst>
          <FormattedMessage id="Beregningsgrunnlag.NaeringsOpplysningsPanel.Begrunnelse" values={{ endringsDato: naringsAndel.endringsdato }} />
        </Normaltekst>
)}
      lukkTekst={(
        <Normaltekst>
          <span>Skjul beskrivelse</span>
        </Normaltekst>
      )}
      apneTekst={(
        <Normaltekst>
          <span>Vis beskrivelse</span>
        </Normaltekst>
      )}
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
  console.log('alleAndelerIForstePeriode', alleAndelerIForstePeriode);
  const snAndel = alleAndelerIForstePeriode.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
  console.log('næringer', snAndel.næringer);
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
        <>
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
        </>
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
