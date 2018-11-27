import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Row, Column } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import { removeSpacesFromNumber } from 'utils/currencyUtils';
import beregningsgrunnlagAndeltyper from 'kodeverk/beregningsgrunnlagAndeltyper';
import {
  getTilstøtendeYtelse,
  getFaktaOmBeregningTilfellerKoder,
} from 'behandling/behandlingSelectors';
import faktaOmBeregningTilfelle from 'kodeverk/faktaOmBeregningTilfelle';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import BorderBox from 'sharedComponents/BorderBox';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import YtelsePanel from './YtelsePanel';
import FordelingAvBruttoBeregningsgrunnlagPanel, { fordelingAvBruttoBGFieldArrayName } from './FordelingAvBruttoBeregningsgrunnlagPanel';
import styles from './tilstøtendeYtelseForm.less';


const linkTilBesteberegningRegneark = 'https://navet.adeo.no/ansatt/Fag/Familie/Svangerskap%2C+fodsel%2C+adopsjon';

export const lagHelpTextsTilstotendeYtelse = (tilstotendeYtelse, notBesteberegningHeader) => {
  if (tilstotendeYtelse.erBesteberegning) {
    return 'BeregningInfoPanel.TilstøtendeYtelseForm.TilstøtendeYtelseBesteberegningHeader';
  }
  return notBesteberegningHeader;
};

export const harKunTilstotendeYtelse = aktivertePaneler => (aktivertePaneler && aktivertePaneler.length === 1
  && aktivertePaneler[0] === faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE);

export const utledOverskrift = createSelector(
  [getFaktaOmBeregningTilfellerKoder, getTilstøtendeYtelse], (tilfeller, tilstotendeYtelse) => (harKunTilstotendeYtelse(tilfeller)
      || (tilfeller.length === 2 && tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG))
    ? lagHelpTextsTilstotendeYtelse(tilstotendeYtelse, 'BeregningInfoPanel.TilstøtendeYtelseForm.TilstøtendeYtelseHeader')
    : lagHelpTextsTilstotendeYtelse(tilstotendeYtelse, 'BeregningInfoPanel.TilstøtendeYtelseForm.TilstøtendeYtelseIKombinasjonHeader')
  ),
);


/**
 * TilstøtendeYtelseForm
 *
 * Presentasjonskomponent. Behandling av aksjonspunktet for avklaring av beregningsgrunnlag ved tilstøtende ytelse.
 */
export const TilstotendeYtelseFormImpl = ({
  readOnly,
  erBesteberegning,
  header,
  periodeHeader,
  skalViseKnapp,
  btnClickCallback,
  formName,
}) => (
  <BorderBox>
    <Row>
      <Column xs="12">
        <Element>
          <FormattedMessage id={header} />
        </Element>
      </Column>
    </Row>
    <VerticalSpacer eightPx />
    <Row>
      <Column xs="12">
        <YtelsePanel
          readOnly={readOnly}
        />
      </Column>
    </Row>
    <VerticalSpacer twentyPx />
    <Row>
      <Column xs="9">
        <Element>
          { periodeHeader }
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
    <Row>
      <Column xs="12">
        <FordelingAvBruttoBeregningsgrunnlagPanel readOnly={readOnly} formName={formName} />
      </Column>
    </Row>
    {skalViseKnapp
    && (
    <ElementWrapper>
      <VerticalSpacer twentyPx />
      <Hovedknapp
        mini
        htmlType="button"
        onClick={btnClickCallback}
      >
        <FormattedMessage id="BeregningInfoPanel.TilstøtendeYtelseForm.Oppdater" />
      </Hovedknapp>
    </ElementWrapper>
    )
    }
  </BorderBox>
);


const periodeHeaderDefault = <FormattedMessage id="BeregningInfoPanel.FordelingBG.FordelingAvBruttoBG" />;


TilstotendeYtelseFormImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  erBesteberegning: PropTypes.bool.isRequired,
  header: PropTypes.string.isRequired,
  periodeHeader: PropTypes.element,
  skalViseKnapp: PropTypes.bool,
  btnClickCallback: PropTypes.func,
  formName: PropTypes.string.isRequired,
};

TilstotendeYtelseFormImpl.defaultProps = {
  periodeHeader: periodeHeaderDefault,
  skalViseKnapp: false,
  btnClickCallback: undefined,
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


TilstotendeYtelseFormImpl.buildInitialValues = (tilstøtendeYtelse, endretBGPerioder) => {
  if (!tilstøtendeYtelse) {
    return {};
  }
  if (endretBGPerioder && endretBGPerioder.length !== 0) {
    return FordelingAvBruttoBeregningsgrunnlagPanel.buildInitialValues(tilstøtendeYtelse, endretBGPerioder[0]);
  }
  return FordelingAvBruttoBeregningsgrunnlagPanel.buildInitialValues(tilstøtendeYtelse, null);
};


TilstotendeYtelseFormImpl.validate = (values, tilfeller) => {
  if (!values || !tilfeller.includes(faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE)) {
    return {};
  }
  return FordelingAvBruttoBeregningsgrunnlagPanel.validate(values);
};


const mapStateToProps = (state) => {
  const tilstøtendeYtelse = getTilstøtendeYtelse(state);
  const erBesteberegning = tilstøtendeYtelse ? tilstøtendeYtelse.erBesteberegning : undefined;
  return {
    erBesteberegning,
    header: utledOverskrift(state),
  };
};


export default connect(mapStateToProps)(TilstotendeYtelseFormImpl);
