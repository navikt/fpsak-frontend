import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

/**
 * MilitaerPanel
 *
 * Presentasjonskomponent. Viser beregningsgrunnlag for militær og sivilforsvarstjeneste.
 */
export const MilitaerPanel = ({
  alleAndeler,
}) => {
  const relevanteAndeler = alleAndeler.filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.MILITAER_ELLER_SIVIL);
  const beregnetAarsinntekt = relevanteAndeler && relevanteAndeler.length > 0 ? relevanteAndeler[0].beregnetPrAar : '';
  return (
    <div>
      <Row>
        <Column xs="12">
          <Normaltekst><FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Militær" /></Normaltekst>
          <VerticalSpacer eightPx />
        </Column>
      </Row>
      <Row>
        <Column xs="12">
          <Element>{formatCurrencyNoKr(beregnetAarsinntekt)}</Element>
        </Column>
      </Row>
    </div>
  );
};
MilitaerPanel.propTypes = {
  alleAndeler: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default MilitaerPanel;
