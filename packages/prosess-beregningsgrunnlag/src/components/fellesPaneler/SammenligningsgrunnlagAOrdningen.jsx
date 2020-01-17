import React from 'react';
import PropTypes from 'prop-types';
import {
  HorizontalRectSeries, FlexibleWidthXYPlot,
} from 'react-vis';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { FormattedMessage } from 'react-intl';
import { formatCurrencyNoKr, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import {
  FlexColumn, FlexRow,
} from '@fpsak-frontend/shared-components';
import moment from 'moment';
import LinkTilEksterntSystem from '../redesign/LinkTilEksterntSystem';
import styles from './sammenligningsgrunnlagAOrdningen.less';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';

const grafFargeAT = '#99bdcd';
const grafFargeFL = '#c1b5d0';
const grafBorderFarge = '#0c5472';

const finnAndelerStatus = (relevanteStatuser) => {
  if (relevanteStatuser.isFrilanser && relevanteStatuser.isArbeidstaker) return 'AT_FL';
  if (relevanteStatuser.isFrilanser) return 'FL';
  if (relevanteStatuser.isArbeidstaker) return 'AT';
  return null;
};
const finnMaksVerdienFraRelevanteAndeler = (andeler, relevanteStatuser) => {
  if (relevanteStatuser.isFrilanser && relevanteStatuser.isArbeidstaker) return Math.max(...andeler.map((andel) => andel.atAndel + andel.flAndel), 0);
  if (relevanteStatuser.isArbeidstaker) return Math.max(...andeler.map((andel) => andel.atAndel), 0);
  if (relevanteStatuser.isFrilanser) return Math.max(...andeler.map((andel) => andel.flAndel), 0);
  return null;
};
const finnRestVerdienFraRelevanteAndeler = (relevanteStatuser, maks, atAndel, flAndel) => {
  if (relevanteStatuser.isFrilanser && relevanteStatuser.isArbeidstaker) return maks - atAndel - flAndel;
  if (relevanteStatuser.isArbeidstaker) return maks - atAndel;
  if (relevanteStatuser.isFrilanser) return maks - flAndel;
  return null;
};

const lagSumRad = (andeler, relevanteStatuser) => {
  const sumATAndeler = andeler.reduce((acc, andel) => acc + andel.atAndel, 0);
  const sumFLAndeler = andeler.reduce((acc, andel) => acc + andel.flAndel, 0);
  return (
    <>
      <Row>
        <Column xs={relevanteStatuser.isArbeidstaker && relevanteStatuser.isFrilanser ? '11' : '9'} className={beregningStyles.noPaddingRight}>
          <div className={beregningStyles.colDevider} />
        </Column>
      </Row>
      <Row>
        <Column xs="7">
          <Normaltekst className={beregningStyles.semiBoldText}>
            <FormattedMessage id="Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.SumTittel" />
          </Normaltekst>
        </Column>
        {relevanteStatuser.isArbeidstaker && (
        <Column xs="2" className={beregningStyles.colMaanedText}>
          <Element className={beregningStyles.semiBoldText}>{formatCurrencyNoKr(sumATAndeler)}</Element>
        </Column>
        )}
        {relevanteStatuser.isFrilanser && (
        <Column xs="2" className={beregningStyles.colMaanedText}>
          <Element>{formatCurrencyNoKr(sumFLAndeler)}</Element>
        </Column>
        )}
        <Column xs="1" className={beregningStyles.rightAlignElementNoWrap} />
      </Row>
    </>
  );
};
const lagRad = (andel, maks, relevanteStatuser) => {
  const {
    atAndel, flAndel, dato,
  } = andel;
  const rest = finnRestVerdienFraRelevanteAndeler(relevanteStatuser, maks, atAndel, flAndel);
  const maanedNavn = moment(dato, ISO_DATE_FORMAT).format('MMM');
  const formattedMaaned = (maanedNavn.charAt(0).toUpperCase() + maanedNavn.slice(1, 3));
  const maaned = moment(dato, ISO_DATE_FORMAT).format('MM');
  const aar = moment(dato, ISO_DATE_FORMAT).format('YYYY');
  return (
    <React.Fragment key={`${dato}wrapper`}>
      { maaned === '01' && (
      <Row>
        <Column xs={relevanteStatuser.isArbeidstaker && relevanteStatuser.isFrilanser ? '12' : '10'} className={styles.aarDevider} />
      </Row>
      )}
      <Row>
        <Column xs="1" className={styles.maanedColumn}>
          <Undertekst>{formattedMaaned}</Undertekst>
        </Column>
        <Column xs="6" className={styles.chartColumn}>
          <FlexibleWidthXYPlot height={10} stackBy="x" yDomain={[1, 1]}>
            {relevanteStatuser.isArbeidstaker && (
            <HorizontalRectSeries
              data={[{ y0: 0.5, y: 1, x: atAndel }]}
              fill={grafFargeAT}
              stroke={grafBorderFarge}
            />
            )}
            {relevanteStatuser.isFrilanser && (
            <HorizontalRectSeries
              data={[{ y0: 0.5, y: 1, x: flAndel }]}
              fill={grafFargeFL}
              stroke={grafBorderFarge}
            />
            )}
            <HorizontalRectSeries
              data={[{ y0: 0.5, y: 1, x: rest }]}
              fill="transparent"
              stroke="transparent"
            />
          </FlexibleWidthXYPlot>

        </Column>
        {relevanteStatuser.isArbeidstaker && (
        <Column xs="2" className={beregningStyles.colMaanedText}>
          <Undertekst>{formatCurrencyNoKr(atAndel)}</Undertekst>
        </Column>
        )}
        {relevanteStatuser.isFrilanser && (
        <Column xs="2" className={relevanteStatuser.isArbeidstaker ? beregningStyles.colAarText : beregningStyles.colMaanedText}>
          <Undertekst>{formatCurrencyNoKr(flAndel)}</Undertekst>
        </Column>
        )}
        <Column xs="1" className={beregningStyles.rightAlignElementNoWrap}>
          { (maaned === '12' || maaned === '01') && (
          <Undertekst>{aar}</Undertekst>
          )}
        </Column>
      </Row>
    </React.Fragment>
  );
};


const SammenligningsgrunnlagAOrdningen = ({
  sammenligningsGrunnlagInntekter,
  relevanteStatuser,
}) => {
  const andeler = sammenligningsGrunnlagInntekter;
  if (!andeler) return null;
  const maxValue = finnMaksVerdienFraRelevanteAndeler(andeler, relevanteStatuser);
  const andelStatus = finnAndelerStatus(relevanteStatuser);
  const userIdent = '123'; // TODO denne må hentes fra brukerID enten fra brukerObjectet eller på beregningsgrunnlag må avklares
  return (
    <>
      <FlexRow key="SNNareingOverskrift">
        <FlexColumn>
          <Element className={beregningStyles.semiBoldText}>
            <FormattedMessage id="Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.Tittel" />
          </Element>
        </FlexColumn>
        <FlexColumn>
          <LinkTilEksterntSystem linkText="AI" userIdent={userIdent} uniqeReactId="AILink" type="AI" />
        </FlexColumn>
      </FlexRow>
      <FlexRow>
        <FlexColumn>
          <Normaltekst>
            <FormattedMessage id={`Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.Ingress.${andelStatus}`} />
          </Normaltekst>
        </FlexColumn>
      </FlexRow>
      <Row>
        <Column xs="1" className={styles.maanedColumn} />
        <Column xs="6" />
        {relevanteStatuser.isArbeidstaker && relevanteStatuser.isFrilanser && (
          <>
            <Column xs="2" className={beregningStyles.colMaanedText}>
              <Undertekst>Arbeid</Undertekst>
            </Column>
            <Column xs="2" className={beregningStyles.colAarText}>
              <Undertekst>Frilans</Undertekst>
            </Column>
          </>
        )}
        {!relevanteStatuser.isFrilanser && relevanteStatuser.isArbeidstaker && (
          <>
            <Column xs="2" className={beregningStyles.colMaanedText}>
              <Undertekst>Arbeid</Undertekst>
            </Column>
          </>
        )}
        {!relevanteStatuser.isArbeidstaker && relevanteStatuser.isFrilanser && (
          <>
            <Column xs="2" className={beregningStyles.colMaanedText}>
              <Undertekst>Frilans</Undertekst>
            </Column>
          </>
        )}
        <Column xs="1" />

      </Row>
      {andeler.map((andel) => (
        lagRad(andel, maxValue, relevanteStatuser)
      ))}
      {lagSumRad(andeler, relevanteStatuser)}
    </>
  );
};

SammenligningsgrunnlagAOrdningen.propTypes = {
  sammenligningsGrunnlagInntekter: PropTypes.arrayOf(PropTypes.shape()),
  relevanteStatuser: PropTypes.shape().isRequired,
};

SammenligningsgrunnlagAOrdningen.defaultProps = {
  sammenligningsGrunnlagInntekter: undefined,
};


export default SammenligningsgrunnlagAOrdningen;
