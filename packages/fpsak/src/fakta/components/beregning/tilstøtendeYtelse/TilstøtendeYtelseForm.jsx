import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/aksjonspunktCodes';
import { FormattedMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import { removeSpacesFromNumber } from '@fpsak-frontend/utils';
import beregningsgrunnlagAndeltyper from '@fpsak-frontend/kodeverk/beregningsgrunnlagAndeltyper';
import { getTilstøtendeYtelse } from 'behandling/behandlingSelectors';
import VerticalSpacer from '@fpsak-frontend/shared-components/VerticalSpacer';
import ElementWrapper from '@fpsak-frontend/shared-components/ElementWrapper';
import BorderBox from '@fpsak-frontend/shared-components/BorderBox';

import YtelsePanel from './YtelsePanel';
import FordelingAvBruttoBeregningsgrunnlagPanel, { fordelingAvBruttoBGFieldArrayName } from './FordelingAvBruttoBeregningsgrunnlagPanel';
import styles from './tilstøtendeYtelseForm.less';

const linkTilBesteberegningRegneark = 'https://navet.adeo.no/ansatt/Fag/Familie/Svangerskap%2C+fodsel%2C+adopsjon';

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


TilstotendeYtelseFormImpl.transformValues = (values, begrunnelseFraForm, faktor) => ({
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
  kode: aksjonspunktCodes.AVKLAR_BEREGNINGSGRUNNLAG_OG_INNTEKTSKATEGORI_FOR_BRUKER_MED_TILSTOTENDE_YTELSE,
  begrunnelse: begrunnelseFraForm === undefined ? null : begrunnelseFraForm,
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
