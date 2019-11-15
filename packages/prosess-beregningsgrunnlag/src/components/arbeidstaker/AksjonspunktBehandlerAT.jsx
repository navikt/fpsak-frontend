import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import { InputField } from '@fpsak-frontend/form';
import { parseCurrencyInput, required } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { createVisningsnavnForAktivitet } from '../util/visningsnavnHelper';
import styles from '../fellesPaneler/aksjonspunktBehandler.less';


// const alleAndelerIForstePeriode = finnAlleAndelerIFørstePeriode(allePerioder);
const andelErIkkeTilkommetEllerLagtTilAvSBH = (andel) => {
  // Andelen er fastsatt før og må kunne fastsettes igjen
  if (andel.overstyrtPrAar !== null && andel.overstyrtPrAar !== undefined) {
    return true;
  }

  // Andeler som er lagt til av sbh eller tilkom før stp skal ikke kunne endres på
  return andel.erTilkommetAndel === false && andel.lagtTilAvSaksbehandler === false;
};
const finnAndelerSomSkalVisesAT = (andeler) => {
  if (!andeler) {
    return [];
  }
  return andeler
    .filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER)
    .filter((andel) => andelErIkkeTilkommetEllerLagtTilAvSBH(andel));
};
const getKodeverknavn = (alleKodeverk) => {
  getKodeverknavnFn(alleKodeverk, kodeverkTyper);
};
const createRows = (relevanteAndelerAT, alleKodeverk, readOnly) => {
  const rows = relevanteAndelerAT.map((andel, index) => (
    <Row key={`index${index + 1}`} className={styles.verticalAlignMiddle}>
      <Column xs="7">
        <Normaltekst>
          {createVisningsnavnForAktivitet(andel.arbeidsforhold, getKodeverknavn)}
        </Normaltekst>
      </Column>
      <Column xs="5">
        <div id="readOnlyWrapper" className={readOnly ? styles.inputPadding : undefined}>
          <InputField
            name={`inntekt${index}`}
            validate={[required]}
            readOnly={readOnly}
            parse={parseCurrencyInput}
            bredde="XS"
          />
        </div>
      </Column>
    </Row>
  ));

  return rows;
};
const AksjonspunktBehandlerAT = ({
  readOnly,
  alleAndelerIForstePeriode,
  alleKodeverk,
}) => {
  const relevanteAndelerAT = finnAndelerSomSkalVisesAT(alleAndelerIForstePeriode);
  return (
    <>
      { createRows(relevanteAndelerAT, alleKodeverk, readOnly) }
    </>
  );
};

AksjonspunktBehandlerAT.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  alleAndelerIForstePeriode: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

export default AksjonspunktBehandlerAT;
