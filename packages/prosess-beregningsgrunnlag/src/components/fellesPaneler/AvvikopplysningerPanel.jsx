import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'nav-frontend-paneler';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { VerticalSpacer, FlexContainer } from '@fpsak-frontend/shared-components';
import { Column, Row } from 'nav-frontend-grid';

import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import AvviksopplysningerSN from '../selvstendigNaeringsdrivende/AvvikopplysningerSN';
import AvviksopplysningerAT from '../arbeidstaker/AvvikopplysningerAT';
import AvviksopplysningerFL from '../frilanser/AvvikopplysningerFL';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';
import AvsnittSkiller from '../redesign/AvsnittSkiller';

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

const lagRelevantePaneler = (
  alleAndelerIForstePeriode,
  relevanteStatuser,
  allePerioder,
  harAksjonspunkter,
  sammenligningsgrunnlagPrStatus,
  gjelderBesteberegning,
) => {
  if (gjelderBesteberegning) {
    return (<Normaltekst><FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.Besteberegning" /></Normaltekst>);
  }
  return (
    <FlexContainer>
      {
        relevanteStatuser.isArbeidstaker && (
          <AvviksopplysningerAT
            beregnetAarsinntekt={beregnAarsintektForAktivitetStatus(alleAndelerIForstePeriode, aktivitetStatus.ARBEIDSTAKER)}
            sammenligningsgrunnlagPrStatus={sammenligningsgrunnlagPrStatus}
            relevanteStatuser={relevanteStatuser}
          />
        )
      }
      {relevanteStatuser.isFrilanser && relevanteStatuser.isKombinasjonsstatus && (
        <VerticalSpacer sixteenPx />
      )}
      {
        relevanteStatuser.isFrilanser && (
          <AvviksopplysningerFL
            beregnetAarsinntekt={beregnAarsintektForAktivitetStatus(alleAndelerIForstePeriode, aktivitetStatus.FRILANSER)}
            sammenligningsgrunnlagPrStatus={sammenligningsgrunnlagPrStatus}
            relevanteStatuser={relevanteStatuser}
          />
        )
      }
      {relevanteStatuser.isSelvstendigNaeringsdrivende && relevanteStatuser.isKombinasjonsstatus && (
      <VerticalSpacer sixteenPx />
      )}
      {relevanteStatuser.isSelvstendigNaeringsdrivende && (
      <AvviksopplysningerSN
        alleAndelerIForstePeriode={alleAndelerIForstePeriode}
        harAksjonspunkter={harAksjonspunkter}
        sammenligningsgrunnlagPrStatus={sammenligningsgrunnlagPrStatus}
      />
      )}
      {relevanteStatuser.isAAP && relevanteStatuser.isKombinasjonsstatus && (
        <VerticalSpacer sixteenPx />
      )}
      {
        relevanteStatuser.isAAP && (
          <Row>
            <Column xs="12">
              <Normaltekst>
                <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.AAP" />
              </Normaltekst>
            </Column>
          </Row>
        )
      }
      {relevanteStatuser.isDagpenger && relevanteStatuser.isKombinasjonsstatus && (
        <VerticalSpacer sixteenPx />
      )}
      {
        relevanteStatuser.isDagpenger && (
          <Row>
            <Column xs="12">
              <Normaltekst>
                <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.Dagpenger" />
              </Normaltekst>
            </Column>
          </Row>
        )
      }
      {relevanteStatuser.isMilitaer && relevanteStatuser.isKombinasjonsstatus && (
        <VerticalSpacer sixteenPx />
      )}
      {
        relevanteStatuser.isMilitaer && (
          <Row>
            <Column xs="12">
              <Normaltekst>
                <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.Miletar" />
              </Normaltekst>
            </Column>
          </Row>
        )
}
    </FlexContainer>
  );
};


const harRelevanteStatuserSatt = (relevanteStatuser) => {
  const statuser = relevanteStatuser;
  delete statuser.skalViseBeregningsgrunnlag;
  delete statuser.harAndreTilstotendeYtelser;
  const statusVerdier = Object.values(statuser);
  return statusVerdier.some((verdi) => verdi === true);
};

const AvviksopplysningerPanel = ({
  relevanteStatuser, allePerioder, harAksjonspunkter, sammenligningsgrunnlagPrStatus, gjelderBesteberegning,
}) => {
  const alleAndelerIForstePeriode = finnAlleAndelerIFørstePeriode(allePerioder);

  const skalViseAvviksPanel = harRelevanteStatuserSatt({ ...relevanteStatuser });
  if (!skalViseAvviksPanel) {
    return null;
  }

  return (
    <Panel className={beregningStyles.panelRight}>
      <AvsnittSkiller luftUnder />
      <Element className={beregningStyles.avsnittOverskrift}>
        <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.ApplicationInformation" />
      </Element>
      <VerticalSpacer eightPx />
      {
        lagRelevantePaneler(
          alleAndelerIForstePeriode, relevanteStatuser, allePerioder, harAksjonspunkter, sammenligningsgrunnlagPrStatus, gjelderBesteberegning,
        )
      }

    </Panel>
  );
};


AvviksopplysningerPanel.propTypes = {
  relevanteStatuser: PropTypes.shape().isRequired,
  allePerioder: PropTypes.arrayOf(PropTypes.shape()),
  sammenligningsgrunnlagPrStatus: PropTypes.arrayOf(PropTypes.shape()),
  harAksjonspunkter: PropTypes.bool,
  gjelderBesteberegning: PropTypes.bool.isRequired,
};

AvviksopplysningerPanel.defaultProps = {
  harAksjonspunkter: false,
  sammenligningsgrunnlagPrStatus: undefined,
};
export default AvviksopplysningerPanel;
