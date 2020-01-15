import React from 'react';
import PropTypes from 'prop-types';
import {
  HorizontalBarSeries, FlexibleWidthXYPlot,
} from 'react-vis';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { FormattedMessage } from 'react-intl';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';

import Panel from 'nav-frontend-paneler';
import styles from './sammenligningsgrunnlagAOrdningen.less';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';

const maanedNavn = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];

const finnAlleAndelerIFørstePeriode = (allePerioder) => {
  if (allePerioder && allePerioder.length > 0) {
    return allePerioder[0].beregningsgrunnlagPrStatusOgAndel;
  }
  return undefined;
};

const lagSumRad = (andeler) => {
  const sumATAndeler = andeler.reduce((acc, andel) => acc + andel.atAndel, 0);
  const sumFTAndeler = andeler.reduce((acc, andel) => acc + andel.flAndel, 0);
  return (
    <>
      <Row>
        <Column xs="10" className={beregningStyles.colDevider} />
      </Row>
      <Row>
        <Column xs="7">
          <Normaltekst className={beregningStyles.semiBoldText}>
            <FormattedMessage id="Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.SumTittel" />
          </Normaltekst>
        </Column>
        <Column
          xs="2"
          key="ColBBgMnd"
          className={beregningStyles.colMaanedText}
        >
          <Normaltekst className={beregningStyles.semiBoldText}>{formatCurrencyNoKr(sumATAndeler)}</Normaltekst>
        </Column>
        <Column xs="2" className={beregningStyles.colAarText}>
          <Normaltekst className={beregningStyles.semiBoldText}>{formatCurrencyNoKr(sumFTAndeler)}</Normaltekst>
        </Column>
      </Row>
    </>
  );
};
const lagRad = (andel, maks) => {
  const {
    atAndel, flAndel, maaned, aar,
  } = andel;
  const rest = maks - atAndel - flAndel;
  return (
    <>
      { maaned === '01' && (
      <Row>
        <Column xs="10" className={styles.aarDevider} />
      </Row>
      )}
      <Row>
        <Column xs="1" className={styles.maanedColumn}>
          <Undertekst>{maanedNavn[parseInt(maaned, 10) - 1]}</Undertekst>
        </Column>

        <Column xs="6" className={styles.chartColumn}>

          <FlexibleWidthXYPlot height={10} stackBy="x" yDomain={[1, 1]}>
            <HorizontalBarSeries
              data={[{ y: 1, x: atAndel }]}
              fill={styles.bgColorAT}
              stroke={styles.stroke}
            />
            <HorizontalBarSeries
              data={[{ y: 1, x: flAndel }]}
              fill={styles.bgColorFL}
              stroke={styles.stroke}
            />
            <HorizontalBarSeries
              data={[{ y: 1, x: rest }]}
              fill={styles.bgColorEmpty}
              stroke={styles.bgColorEmpty}
            />
          </FlexibleWidthXYPlot>

        </Column>
        <Column xs="2" className={beregningStyles.colMaanedText}>
          <Undertekst>{formatCurrencyNoKr(atAndel)}</Undertekst>
        </Column>
        <Column xs="2" className={beregningStyles.colAarText}>
          <Undertekst>{formatCurrencyNoKr(flAndel)}</Undertekst>
        </Column>
        <Column xs="1" className={beregningStyles.rightAlignElementNoWrap}>
          { (maaned === '12' || maaned === '01') && (
          <Undertekst>{aar}</Undertekst>
          )}
        </Column>
      </Row>
    </>
  );
};

const SammenlignsgrunnlagAOrdningen = ({
  allePerioder,
}) => {
  const alleAndelerIForstePeriode = finnAlleAndelerIFørstePeriode(allePerioder);
  console.log(alleAndelerIForstePeriode);
  const andeler = [
    {
      atAndel: 31800,
      flAndel: 0,
      maaned: '08',
      aar: 2018,
    },
    {
      atAndel: 33450,
      flAndel: 0,
      maaned: '09',
      aar: 2018,
    },
    {
      atAndel: 33559,
      flAndel: 10000,
      maaned: '10',
      aar: 2018,
    },
    {
      atAndel: 41800,
      flAndel: 0,
      maaned: '11',
      aar: 2018,
    },
    {
      atAndel: 39450,
      flAndel: 0,
      maaned: '12',
      aar: 2018,
    },
    {
      atAndel: 39559,
      flAndel: 0,
      maaned: '01',
      aar: 2019,
    },
    {
      atAndel: 38800,
      flAndel: 0,
      maaned: '02',
      aar: 2019,
    },
    {
      atAndel: 39450,
      flAndel: 0,
      maaned: '03',
      aar: 2019,
    },
    {
      atAndel: 38559,
      flAndel: 0,
      maaned: '04',
      aar: 2019,
    },
    {
      atAndel: 39600,
      flAndel: 64000,
      maaned: '05',
      aar: 2019,
    },
    {
      atAndel: 49993,
      flAndel: 55000,
      maaned: '06',
      aar: 2019,
    },
    {
      atAndel: 48237,
      flAndel: 30000,
      maaned: '07',
      aar: 2019,
    },
  ];
  const maxValue = Math.max(...andeler.map((andel) => andel.atAndel + andel.flAndel), 0);

  return (
    <Panel className={beregningStyles.panelLeft}>
      <Element>
        <FormattedMessage id="Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.Tittel" />
      </Element>
      <Normaltekst>
        <FormattedMessage id="Beregningsgrunnlag.SammenligningsGrunnlaAOrdningen.IngressATFL" />
      </Normaltekst>
      <Row>
        <Column xs="1" className={styles.maanedColumn} />
        <Column xs="6" />
        <Column xs="2" className={beregningStyles.colMaanedText}>
          <Undertekst>Arbeid</Undertekst>
        </Column>
        <Column xs="2" className={beregningStyles.colAarText}>
          <Undertekst>Frilans</Undertekst>
        </Column>
        <Column xs="1" />

      </Row>
      {andeler.map((andel) => (
        lagRad(andel, maxValue)
      ))}
      {lagSumRad(andeler)}
    </Panel>
  );
};

SammenlignsgrunnlagAOrdningen.propTypes = {
  allePerioder: PropTypes.arrayOf(PropTypes.shape()),
};

SammenlignsgrunnlagAOrdningen.defaultProps = {
  allePerioder: undefined,
};


export default SammenlignsgrunnlagAOrdningen;
