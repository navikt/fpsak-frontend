import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import { InputField } from '@fpsak-frontend/form';
import { parseCurrencyInput, removeSpacesFromNumber, required } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { getKodeverknavnFn, createVisningsnavnForAktivitet } from '@fpsak-frontend/fp-felles';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import styles from '../fellesPaneler/aksjonspunktBehandler.less';


const andelErIkkeTilkommetEllerLagtTilAvSBH = (andel) => {
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
    .filter((andel) => andel.skalFastsetteGrunnlag === true)
    .filter((andel) => andelErIkkeTilkommetEllerLagtTilAvSBH(andel));
};


const createRows = (relevanteAndelerAT, getKodeverknavn, readOnly) => {
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
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  const relevanteAndelerAT = finnAndelerSomSkalVisesAT(alleAndelerIForstePeriode);
  return (
    <>
      { createRows(relevanteAndelerAT, getKodeverknavn, readOnly) }
    </>
  );
};

AksjonspunktBehandlerAT.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  alleAndelerIForstePeriode: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

AksjonspunktBehandlerAT.transformValues = (values, relevanteStatuser, alleAndelerIForstePeriode) => {
  let inntektPrAndelList = null;
  let frilansInntekt = null;
  if (relevanteStatuser.isArbeidstaker) {
    inntektPrAndelList = finnAndelerSomSkalVisesAT(alleAndelerIForstePeriode)
      .map(({ andelsnr }, index) => {
        const overstyrtInntekt = values[`inntekt${index}`];
        return {
          inntekt: (overstyrtInntekt === undefined || overstyrtInntekt === '') ? 0 : removeSpacesFromNumber(overstyrtInntekt),
          andelsnr,
        };
      });
  }
  if (relevanteStatuser.isFrilanser) {
    frilansInntekt = removeSpacesFromNumber(values.inntektFrilanser);
  }
  return {
    kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
    begrunnelse: values.ATFLVurdering,
    inntektFrilanser: frilansInntekt,
    inntektPrAndelList,
  };
};

AksjonspunktBehandlerAT.transformValuesForAT = (values, alleAndelerIForstePeriode) => {
  const inntektPrAndelList = finnAndelerSomSkalVisesAT(alleAndelerIForstePeriode)
    .map(({ andelsnr }, index) => {
      const overstyrtInntekt = values[`inntekt${index}`];
      return {
        inntekt: (overstyrtInntekt === undefined || overstyrtInntekt === '') ? 0 : removeSpacesFromNumber(overstyrtInntekt),
        andelsnr,
      };
    });
  return inntektPrAndelList;
};


export default AksjonspunktBehandlerAT;
