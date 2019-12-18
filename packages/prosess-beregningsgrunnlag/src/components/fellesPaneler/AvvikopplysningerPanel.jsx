import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'nav-frontend-paneler';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Column, Row } from 'nav-frontend-grid';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import AvviksopplysningerSN from '../selvstendigNaeringsdrivende/AvvikopplysningerSN';
import AvviksopplysningerAT from '../arbeidstaker/AvvikopplysningerAT';
import AvviksopplysningerFL from '../frilanser/AvvikopplysningerFL';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';

const finnAlleAndelerIFørstePeriode = (allePerioder) => {
  if (allePerioder && allePerioder.length > 0) {
    return allePerioder[0].beregningsgrunnlagPrStatusOgAndel;
  }
  return undefined;
};
const andelErIkkeTilkommetEllerLagtTilAvSBH = (andel) => {
  // Andelen er fastsatt før og må kunne fastsettes igjen
  if (andel.overstyrtPrAar !== null && andel.overstyrtPrAar !== undefined) {
    return true;
  }
  // Andeler som er lagt til av sbh eller tilkom før stp skal ikke kunne endres på
  return andel.erTilkommetAndel === false && andel.lagtTilAvSaksbehandler === false;
};
const finnAndelerSomSkalVises = (andeler, status) => {
  if (!andeler) {
    return [];
  }

  return andeler
    .filter((andel) => andel.aktivitetStatus.kode === status)
    .filter((andel) => andelErIkkeTilkommetEllerLagtTilAvSBH(andel));
};
const beregnAarsintektForAktivitetStatus = (alleAndelerIForstePeriode, status) => {
  const relevanteAndeler = finnAndelerSomSkalVises(alleAndelerIForstePeriode, status);
  if (relevanteAndeler) {
    return relevanteAndeler.reduce((acc, andel) => acc + andel.beregnetPrAar, 0);
  }
  return null;
};
const AvviksopplysningerPanel = ({
  relevanteStatuser, allePerioder, harAksjonspunkter, sammenligningsgrunnlagPrStatus,
}) => {
  const alleAndelerIForstePeriode = finnAlleAndelerIFørstePeriode(allePerioder);
  return (
    <Panel className={beregningStyles.panelRight}>
      <Element>
        <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.ApplicationInformation" />
      </Element>
      <VerticalSpacer eightPx />
      {relevanteStatuser.isArbeidstaker && (
      <AvviksopplysningerAT
        beregnetAarsinntekt={beregnAarsintektForAktivitetStatus(alleAndelerIForstePeriode, aktivitetStatus.ARBEIDSTAKER)}
        sammenligningsgrunnlagPrStatus={sammenligningsgrunnlagPrStatus}
        relevanteStatuser={relevanteStatuser}
      />
      )}
      {relevanteStatuser.isKombinasjonsstatus && (
      <VerticalSpacer sixteenPx />
      )}
      {relevanteStatuser.isFrilanser && (
      <AvviksopplysningerFL
        beregnetAarsinntekt={beregnAarsintektForAktivitetStatus(alleAndelerIForstePeriode, aktivitetStatus.FRILANSER)}
        sammenligningsgrunnlagPrStatus={sammenligningsgrunnlagPrStatus}
        relevanteStatuser={relevanteStatuser}
      />
      )}
      {relevanteStatuser.isKombinasjonsstatus && (
      <VerticalSpacer sixteenPx />
      )}
      {relevanteStatuser.isSelvstendigNaeringsdrivende && (
      <AvviksopplysningerSN
        alleAndelerIForstePeriode={alleAndelerIForstePeriode}
        harAksjonspunkter={harAksjonspunkter}
        sammenligningsgrunnlagPrStatus={sammenligningsgrunnlagPrStatus}
      />
      )}
      {relevanteStatuser.isAAP && (
      <Row>
        <Column xs="12">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.AAP" />
          </Normaltekst>
        </Column>
      </Row>
      )}
      {relevanteStatuser.isDagpenger && (
      <Row>
        <Column xs="12">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.Dagpenger" />
          </Normaltekst>
        </Column>
      </Row>
      )}
      {relevanteStatuser.isMilitaer && (
        <Row>
          <Column xs="12">
            <Normaltekst>
              <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.Miletar" />
            </Normaltekst>
          </Column>
        </Row>
      )}

    </Panel>
  );
};


AvviksopplysningerPanel.propTypes = {
  relevanteStatuser: PropTypes.shape().isRequired,
  allePerioder: PropTypes.arrayOf(PropTypes.shape()),
  sammenligningsgrunnlagPrStatus: PropTypes.arrayOf(PropTypes.shape()),
  harAksjonspunkter: PropTypes.bool,
};

AvviksopplysningerPanel.defaultProps = {
  harAksjonspunkter: false,
  sammenligningsgrunnlagPrStatus: undefined,
};
export default AvviksopplysningerPanel;
