import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Element, Normaltekst, EtikettLiten,
} from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';

import Panel from 'nav-frontend-paneler';
import { Column, Row } from 'nav-frontend-grid';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';


const createHeaderRow = () => (
  <Row key="SNInntektHeader">
    <Column xs="9">
      <EtikettLiten className={beregningStyles.etikettLiten}>
        <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.AarHeader" />
      </EtikettLiten>
    </Column>
    <Column xs="2" className={beregningStyles.rightAlignElement}>

      <EtikettLiten className={beregningStyles.etikettLiten}>
        <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.TotalPensjonsGivende" />
      </EtikettLiten>
    </Column>
  </Row>
);
const createSumRow = (pgiSnitt, erNyIArbeidslivet) => (
  <>
    {pgiSnitt !== undefined && !erNyIArbeidslivet && (
      <>
        <Row key="grunnlagAarsinntektSNLine">
          <Column xs="11">
            <hr />
          </Column>
        </Row>
        <Row key="grunnlagAarsinntektSN">
          <Column xs="9" className={beregningStyles.rightAlignTextInDiv}>
            <Element>
              <FormattedMessage
                id="Beregningsgrunnlag.AarsinntektPanel.SnittPensjonsGivende"
              />
            </Element>
          </Column>
          <Column xs="2" className={beregningStyles.rightAlignElement}>
            <Element>
              {formatCurrencyNoKr(pgiSnitt)}
            </Element>
          </Column>
        </Row>
      </>
    )}
  </>
);
const createInntektRows = (pgiVerdier) => (
  <>
    {pgiVerdier.map((element) => (
      <Row key={element.årstall}>
        <Column xs="7">
          <EtikettLiten>
            {element.årstall}
          </EtikettLiten>
        </Column>
        <Column xs="4" className={beregningStyles.rightAlignElement}>
          <EtikettLiten>
            {formatCurrencyNoKr(element.beløp)}
          </EtikettLiten>
        </Column>
      </Row>
    ))}
  </>
);


/**
 * GrunnlagForAarsinntektPanelSN
 *
 * Presentasjonskomponent. Viser PGI-verdier for selvstendig næringsdrivende.
 * Vises også hvis status er en kombinasjonsstatus som inkluderer selvstendig næringsdrivende.
 */
export const GrunnlagForAarsinntektPanelSN2 = ({
  alleAndeler,
}) => {
  const snAndel = alleAndeler.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
  if (!snAndel) {
    return null;
  }
  const { pgiVerdier, pgiSnitt, erNyIArbeidslivet } = snAndel;
  return (
    <Panel className={beregningStyles.panel}>
      <Element className={beregningStyles.semiBoldText}>
        <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Pensjonsgivendeinntekt" />
      </Element>
      <VerticalSpacer fourPx />
      <Row key="SNInntektIngress">
        <Column xs="8">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.SN.sisteTreAar" />
          </Normaltekst>
        </Column>
      </Row>
      <VerticalSpacer fourPx />
      {createHeaderRow(pgiVerdier)}
      {createInntektRows(pgiVerdier)}
      {createSumRow(pgiSnitt, erNyIArbeidslivet)}

    </Panel>
  );
};

GrunnlagForAarsinntektPanelSN2.propTypes = {
  alleAndeler: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default GrunnlagForAarsinntektPanelSN2;
