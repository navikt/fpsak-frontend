import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { InputField } from '@fpsak-frontend/form';
import { parseCurrencyInput, required } from '@fpsak-frontend/utils';
// import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import styles from '../fellesPaneler/aksjonspunktBehandler.less';

/*
const finnAndelerSomSkalVisesFL = (andeler) => {
  if (!andeler) {
    return [];
  }
  return andeler
    .filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.FRILANSER)
    .filter((andel) => andelErIkkeTilkommetEllerLagtTilAvSBH(andel));
};
*/
const createRowFL = (readOnly) => (
  <Row className={styles.verticalAlignMiddle}>
    <Column xs="7">
      <Normaltekst>
        <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandlerFL" />
      </Normaltekst>
    </Column>
    <Column xs="5">
      <div id="readOnlyWrapper" className={readOnly ? styles.inputPadding : undefined}>
        <InputField
          name="inntektFrilanser"
          validate={[required]}
          readOnly={readOnly}
          parse={parseCurrencyInput}
          bredde="XS"
        />
      </div>
    </Column>
  </Row>
);

const AksjonspunktBehandlerFL = ({
  readOnly,
  alleAndelerIForstePeriode,
}) => {
  // const relevanteAndelerFT = finnAndelerSomSkalVisesFL(alleAndelerIForstePeriode);
  console.log('alleAndeler første periode', alleAndelerIForstePeriode);
  return (
    <>
      {createRowFL(readOnly)}
    </>
  );
};
AksjonspunktBehandlerFL.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  alleAndelerIForstePeriode: PropTypes.arrayOf(PropTypes.shape()),
};

AksjonspunktBehandlerFL.defaultProps = {
};
export default AksjonspunktBehandlerFL;
