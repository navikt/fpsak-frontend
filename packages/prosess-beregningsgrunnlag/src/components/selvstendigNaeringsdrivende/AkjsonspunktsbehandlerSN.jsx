import React from 'react';
import PropTypes from 'prop-types';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import beregningsgrunnlagAksjonspunkterPropType from '../../propTypes/beregningsgrunnlagAksjonspunkterPropType';
import VurderOgFastsettSN from './VurderOgFastsettSN';

const {
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
} = aksjonspunktCodes;


const skalFastsetteSN = (aksjonspunkter) => aksjonspunkter && aksjonspunkter.some(
  (ap) => ap.definisjon.kode === VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE
    || ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
);

/*
const finnSnAksjonspunkt = (aksjonspunkter) => aksjonspunkter && aksjonspunkter.find(
  (ap) => ap.definisjon.kode === VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE
    || ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
);
const createRowVarig = (readOnly, isAksjonspunktClosed) => (
  <>
    <Row>
      <Column xs="12">
        <RadioGroupField
          name={varigEndringRadioname}
          validate={[required]}
          direction="horizontal"
          readOnly={readOnly}
          isEdited={isAksjonspunktClosed}
        >
          <RadioOption
            label={<FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.IngenEndring" />}
            value={false}
          />
          <RadioOption
            label={<FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.EndretNaering" />}
            value
          />
        </RadioGroupField>
      </Column>
    </Row>
  </>

);
const createRow = (readOnly, isAksjonspunktClosed) => (
  <Row>
    <Column xs="12" className={styles.rightAlignInput}>
      <InputField
        name={fastsettInntektFieldname}
        label={{ id: 'Beregningsgrunnlag.FastsettSelvstendigNaeringForm.BruttoBerGr' }}
        bredde="S"
        validate={[required]}
        parse={parseCurrencyInput}
        isEdited={isAksjonspunktClosed}
        readOnly={readOnly}
      />
    </Column>
  </Row>
);

 */
const AksjonspunktBehandlerSN = ({
  readOnly,
  alleAndelerIForstePeriode,
  aksjonspunkter,
  behandlingId,
  behandlingVersjon,
}) => {
  // const relevanteAndelerFT = finnAndelerSomSkalVisesFL(alleAndelerIForstePeriode);
  console.log('alleAndeler første periode', alleAndelerIForstePeriode, readOnly);
  // const aksjonspunkt = finnSnAksjonspunkt(aksjonspunkter);
  // const isAksjonspunktClosed = !isAksjonspunktOpen(aksjonspunkt.status.kode);

  return (
    <>
      { skalFastsetteSN(aksjonspunkter)
      && (
        <VurderOgFastsettSN
          gjeldendeAksjonspunkter={aksjonspunkter}
          readOnly={readOnly}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
        />
      )}
    </>
  );
};
AksjonspunktBehandlerSN.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  alleAndelerIForstePeriode: PropTypes.arrayOf(PropTypes.shape()),
  aksjonspunkter: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
};

AksjonspunktBehandlerSN.defaultProps = {
};
export default AksjonspunktBehandlerSN;
