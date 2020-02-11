import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { FormattedMessage, injectIntl } from 'react-intl';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';

import avslaatIkonUrl from '@fpsak-frontend/assets/images/avslaatt_mini.svg';
import Panel from 'nav-frontend-paneler';
import styles from './beregningsresultatTable_V2.less';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';

import beregningsgrunnlagVilkarPropType from '../../propTypes/beregningsgrunnlagVilkarPropType';


const lagSpesialRaderRad = (visningsObjekt) => {
  if (!visningsObjekt || !visningsObjekt.verdi || visningsObjekt.display === false) return null;
  return (
    <Row key={`SpesialRad_${visningsObjekt.verdi}`}>
      <Column xs="10">
        <Normaltekst>
          {visningsObjekt.ledetekst}
        </Normaltekst>
      </Column>
      <Column xs="2" className={beregningStyles.rightAlignElementNoWrap}>
        <Normaltekst>{formatCurrencyNoKr(visningsObjekt.verdi)}</Normaltekst>
      </Column>
    </Row>

  );
};
const lagDagsatsRad = (dagsatsRad, ikkeVurdert) => {
  if (!dagsatsRad.grunnlag) return null;
  return (
    <React.Fragment key="beregningOppsummeringWrapper">
      <Row key="DagsatsSeparator">
        <Column xs="12">
          <div className={beregningStyles.colDevider} />
        </Column>
      </Row>
      <Row key="beregningOppsummering">
        <Column xs="9" key="beregningOppsummeringLedetekst">
          <Normaltekst>
            <span className={beregningStyles.semiBoldText}>
              { !ikkeVurdert && (
                <FormattedMessage
                  id="Beregningsgrunnlag.BeregningTable.DagsatsNy"
                  values={{ dagSats: dagsatsRad.grunnlag }}
                />
              )}
              { ikkeVurdert && (
                <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Dagsats.ikkeFastsatt" />
              )}
            </span>
          </Normaltekst>
        </Column>
        <Column xs="3" className={beregningStyles.rightAlignElement}>
          <Normaltekst className={beregningStyles.semiBoldText}>{dagsatsRad.verdi || dagsatsRad.verdi === 0 ? dagsatsRad.verdi : '-'}</Normaltekst>
        </Column>
      </Row>
    </React.Fragment>
  );
};
const lineRad = (key) => (
  <Row key={key || 'separator'}>
    <Column xs="12">
      <div className={beregningStyles.colDevider} />
    </Column>
  </Row>
);
const lagForklaringer = (forklaringsListe) => (
  forklaringsListe.map((forklaring, index) => (
    <React.Fragment key={`Forklaring${index + 1}`}>
      <Row>
        <Column xs="12">
          <Normaltekst>
            {forklaring}
          </Normaltekst>
        </Column>
      </Row>
      <VerticalSpacer twentyPx />
    </React.Fragment>
  ))
);

const lagAndelerRader = (listofAndeler, ikkeVurdert) => (listofAndeler.map((entry, index) => (
  <Row key={`indeAx${index + 1}`}>
    <Column xs={ikkeVurdert ? '9' : '10'} key={`indexAl2${index + 1}`}>
      <Normaltekst>
        {entry.ledetekst ? entry.ledetekst : '-'}
      </Normaltekst>
    </Column>
    {!ikkeVurdert && (
    <Column xs="2" key={`indexAt2${index + 2}`} className={beregningStyles.rightAlignElementNoWrap}>
      <Normaltekst>{formatCurrencyNoKr(entry.verdi)}</Normaltekst>
    </Column>
    )}
    {ikkeVurdert && entry.skalFastsetteGrunnlag === true && (
    <Column xs="3" key={`indexAf2${index + 2}`} className={styles.maaFastsettes}>
      <Normaltekst className={beregningStyles.redError}><FormattedMessage id="Beregningsgrunnlag.BeregningTable.MåFastsettes" /></Normaltekst>
    </Column>
    )}
    {ikkeVurdert && !entry.skalFastsetteGrunnlag && (
    <Column xs="3" key={`indexAf2${index + 2}`} className={beregningStyles.rightAlignElementNoWrap}>
      <Normaltekst>{formatCurrencyNoKr(entry.verdi)}</Normaltekst>
    </Column>
    )}
  </Row>
))
);

const lagTabellRader = (periodeData, ikkeVurdert) => {
  const {
    rowsAndeler,
    avkortetRad,
    redusertRad,
    bruttoRad,
    dagsatser,
    rowsForklaringer,
  } = periodeData;
  const rows = [];
  if (rowsForklaringer && rowsForklaringer.length > 0) {
    rows.push(lagForklaringer(rowsForklaringer));
  }
  if (rowsAndeler && rowsAndeler.length > 0) {
    rows.push(lagAndelerRader(rowsAndeler, ikkeVurdert));
  }
  if (!ikkeVurdert) {
    if (rowsAndeler.length > 1) {
      rows.push(lineRad('andelLinje'));
      rows.push(lagSpesialRaderRad(bruttoRad));
    }
    rows.push(lagSpesialRaderRad(avkortetRad));
    rows.push(lagSpesialRaderRad(redusertRad));
  }
  rows.push(lagDagsatsRad(dagsatser, ikkeVurdert));
  return rows;
};
const lagTabellRaderIkkeOppfylt = (listofAndeler, intl, halvGVerdi, key) => (
  <React.Fragment key={`IVR2${key}`}>
    {lagAndelerRader(listofAndeler)}
    <VerticalSpacer twentyPx />
    <Normaltekst className={beregningStyles.redError}>
      <Image
        className={styles.avslaat_icon}
        alt={intl.formatMessage({ id: 'Beregningsgrunnlag.BeregningTable.VilkarIkkeOppfylt2' })}
        src={avslaatIkonUrl}
      />
      <FormattedMessage
        id="Beregningsgrunnlag.BeregningTable.VilkarIkkeOppfylt2"
        values={{ halvG: formatCurrencyNoKr(halvGVerdi) }}
      />
    </Normaltekst>
  </React.Fragment>
);


const lagPeriodeOverskrift = (header, periodeIndex) => (
  <>
    {periodeIndex > 0 && (
    <VerticalSpacer twentyPx />
    )}
    <Normaltekst className={beregningStyles.semiBoldText}>{header}</Normaltekst>
  </>
);

const lagKeyForPeriode = (dagsats, header) => {
  if (dagsats) {
    return dagsats;
  }
  if (header && header.key) {
    return header.key;
  }
  return 'key';
};


const createPeriodeResultat = (vilkaarBG, periodeData, lagPeriodeHeaders, intl, halvGVerdi, periodeIndex) => {
  const key = lagKeyForPeriode(periodeData.dagsatser[0], periodeData.headers[0]);
  const ikkeOppfylt = !!(vilkaarBG && vilkaarBG.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT);
  const ikkeVurdert = !!(vilkaarBG && vilkaarBG.vilkarStatus.kode === vilkarUtfallType.IKKE_VURDERT);

  return (
    <React.Fragment key={`Wr${key}`}>
      {periodeData && lagPeriodeHeaders && lagPeriodeOverskrift(periodeData.headers, periodeIndex)}
      {!ikkeOppfylt && lagTabellRader(periodeData, ikkeVurdert)}
      {ikkeOppfylt && lagTabellRaderIkkeOppfylt(periodeData.rowsAndeler, intl, halvGVerdi, key)}
    </React.Fragment>
  );
};
const BeregningsresutatPanel = ({
  intl,
  vilkaarBG,
  periodeResultatTabeller,
  halvGVerdi,
}) => {
  const skalLagePeriodeHeaders = periodeResultatTabeller.length > 1;
  return (
    <Panel className={beregningStyles.panelRight}>
      <Element className={beregningStyles.avsnittOverskrift}>
        <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Tittel" />
      </Element>
      <VerticalSpacer eightPx />
      {periodeResultatTabeller.map((periodeData, index) => createPeriodeResultat(vilkaarBG, periodeData, skalLagePeriodeHeaders, intl, halvGVerdi, index))}
    </Panel>
  );
};
BeregningsresutatPanel.propTypes = {
  intl: PropTypes.shape().isRequired,
  halvGVerdi: PropTypes.number.isRequired,
  vilkaarBG: beregningsgrunnlagVilkarPropType.isRequired,
  periodeResultatTabeller: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
export default (injectIntl(BeregningsresutatPanel));
