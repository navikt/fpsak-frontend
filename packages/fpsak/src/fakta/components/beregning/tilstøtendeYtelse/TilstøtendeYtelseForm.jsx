import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import { removeSpacesFromNumber } from 'utils/currencyUtils';
import beregningsgrunnlagAndeltyper from 'kodeverk/beregningsgrunnlagAndeltyper';
import {
  getAksjonspunkter,
  getTilstøtendeYtelse,
  getFaktaOmBeregningTilfellerKoder,
} from 'behandling/behandlingSelectors';
import faktaOmBeregningTilfelle from 'kodeverk/faktaOmBeregningTilfelle';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import BorderBox from 'sharedComponents/BorderBox';

import YtelsePanel from './YtelsePanel';
import FordelingAvBruttoBeregningsgrunnlagPanel, { fordelingAvBruttoBGFieldArrayName } from './FordelingAvBruttoBeregningsgrunnlagPanel';
import styles from './tilstøtendeYtelseForm.less';

const {
  VURDER_FAKTA_FOR_ATFL_SN,
} = aksjonspunktCodes;

const linkTilBesteberegningRegneark = 'https://navet.adeo.no/ansatt/Fag/Familie/Svangerskap%2C+fodsel%2C+adopsjon';

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

export const lagHelpTextsTilstotendeYtelse = (tilstotendeYtelse) => {
  const helpTexts = [];
  if (tilstotendeYtelse.erBesteberegning) {
    helpTexts.push(<FormattedMessage
      key="AvklarBGTilstøtendeYtelseMedBB"
      id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning.TilstøtendeYtelseBesteberegning"
    />);
  } else {
    helpTexts.push(<FormattedMessage
      key="AvklarBGTilstøtendeYtelse"
      id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning.TilstøtendeYtelse"
    />);
  }
  return helpTexts;
};

export const harKunTilstotendeYtelse = aktivertePaneler => (aktivertePaneler && aktivertePaneler.length === 1
  && aktivertePaneler[0] === faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE);

export const getHelpTextsTY = createSelector(
  [getFaktaOmBeregningTilfellerKoder, getTilstøtendeYtelse, getAksjonspunkter],
  (aktivertePaneler, tilstotendeYtelse, aksjonspunkter) => (hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)
    && harKunTilstotendeYtelse(aktivertePaneler) ? lagHelpTextsTilstotendeYtelse(tilstotendeYtelse) : []),
);


/**
 * TilstøtendeYtelseForm
 *
 * Presentasjonskomponent. Behandling av aksjonspunktet for avklaring av beregningsgrunnlag ved tilstøtende ytelse.
 */
export const TilstotendeYtelseFormImpl = ({
  readOnly,
  erBesteberegning,
}) => (
  <ElementWrapper>
    <ElementWrapper>
      <YtelsePanel
        readOnly={readOnly}
      />
      <BorderBox>
        <Row>
          <Column xs="9">
            <Element>
              <FormattedMessage id="BeregningInfoPanel.FordelingBG.FordelingAvBruttoBG" />
            </Element>
            <VerticalSpacer eightPx />
          </Column>
          {erBesteberegning
            && (
            <Column xs="3">
              <a
                className={styles.navetLink}
                href={linkTilBesteberegningRegneark}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FormattedMessage id="BeregningInfoPanel.FastsettBBFodendeKvinne.RegnarkNavet" />
              </a>
            </Column>
            )
          }
        </Row>
        <VerticalSpacer eightPx />
        <FordelingAvBruttoBeregningsgrunnlagPanel readOnly={readOnly} />
      </BorderBox>
    </ElementWrapper>
  </ElementWrapper>
);


TilstotendeYtelseFormImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  erBesteberegning: PropTypes.bool.isRequired,
};


export const getAndelsnr = (andelValues) => {
  if (andelValues.nyAndel === true) {
    if (beregningsgrunnlagAndeltyper[andelValues.andel]) {
      return null;
    }
    return andelValues.andel;
  }
  return andelValues.andelsnr;
};


TilstotendeYtelseFormImpl.transformValues = (values, faktor, gjelderBesteberegning) => ({
  tilstøtendeYtelse: {
    tilstøtendeYtelseAndeler: values[fordelingAvBruttoBGFieldArrayName].map(fieldValue => ({
      andel: fieldValue.andel,
      andelsnr: getAndelsnr(fieldValue),
      arbeidsforholdId: fieldValue.arbeidsforholdId !== '' ? fieldValue.arbeidsforholdId : null,
      reduserendeFaktor: faktor,
      fastsattBeløp: parseInt(removeSpacesFromNumber(fieldValue.fastsattBeløp), 10),
      inntektskategori: fieldValue.inntektskategori,
      nyAndel: fieldValue.nyAndel,
      lagtTilAvSaksbehandler: fieldValue.lagtTilAvSaksbehandler,
    })),
    gjelderBesteberegning,
  },
});


TilstotendeYtelseFormImpl.buildInitialValues = (tilstøtendeYtelse, aktivitetstatuskoder) => {
  if (!tilstøtendeYtelse) {
    return {};
  }
  return FordelingAvBruttoBeregningsgrunnlagPanel.buildInitialValues(tilstøtendeYtelse, aktivitetstatuskoder);
};


const mapStateToProps = (state) => {
  const tilstøtendeYtelse = getTilstøtendeYtelse(state);
  const erBesteberegning = tilstøtendeYtelse ? tilstøtendeYtelse.erBesteberegning : undefined;
  return {
    erBesteberegning,
  };
};


export default connect(mapStateToProps)(TilstotendeYtelseFormImpl);
