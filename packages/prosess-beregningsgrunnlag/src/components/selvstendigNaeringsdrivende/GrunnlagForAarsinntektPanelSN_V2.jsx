import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';

import Panel from 'nav-frontend-paneler';
import { Column, Row } from 'nav-frontend-grid';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';


const createHeaderRow = (pgiVerdier) => (
  <Row key="SNInntektHeader">
    <Column xs="8">
      <Undertekst>
        <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.AarHeader" />
      </Undertekst>
    </Column>
    {pgiVerdier && Object.prototype.hasOwnProperty.call(pgiVerdier[0], 'gJustert') && (
      <>
        <Column xs="2">
          <Undertekst>
            <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.TotalPensjonsGivende" />
          </Undertekst>
        </Column>
        <Column xs="2">
          <Undertekst>
            <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.TotalGJustert" />
          </Undertekst>
        </Column>
      </>
    )}
    {pgiVerdier && !Object.prototype.hasOwnProperty.call(pgiVerdier[0], 'gJustert') && (
      <>
        <Column xs="2" className={beregningStyles.rightAlignElement}>
          <Undertekst>
            <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.TotalPensjonsGivende" />
          </Undertekst>
        </Column>
      </>
    )}
  </Row>
);
const createSumRow = (pgiSnitt, erNyIArbeidslivet) => (
  <>
    {pgiSnitt !== undefined && !erNyIArbeidslivet && (
      <>
        <Row key="grunnlagAarsinntektSNLine">
          <Column xs="10">
            <hr />
          </Column>
        </Row>
        <Row key="grunnlagAarsinntektSN">
          <Column xs="8" className={beregningStyles.rightAlignTextInDiv}>
            <FormattedMessage
              id="Beregningsgrunnlag.AarsinntektPanel.SnittPensjonsGivende"
            />
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
        <Column xs="6">
          <Normaltekst>
            {element.årstall}
          </Normaltekst>
        </Column>
        {Object.prototype.hasOwnProperty.call(element, 'gJustert') && (
          <>
            <Column xs="2" className={beregningStyles.rightAlignElement}>
              <Normaltekst>
                {formatCurrencyNoKr(element.gJustert)}
              </Normaltekst>
            </Column>
            <Column xs="2" className={beregningStyles.rightAlignElement}>
              <Normaltekst>
                {formatCurrencyNoKr(element.beløp)}
              </Normaltekst>
            </Column>
          </>
        )}
        {!Object.prototype.hasOwnProperty.call(element, 'gJustert') && (
          <>
            <Column xs="4" className={beregningStyles.rightAlignElement}>
              <Normaltekst>
                {formatCurrencyNoKr(element.beløp)}
              </Normaltekst>
            </Column>
          </>
        )}
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
      <VerticalSpacer eightPx />
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
