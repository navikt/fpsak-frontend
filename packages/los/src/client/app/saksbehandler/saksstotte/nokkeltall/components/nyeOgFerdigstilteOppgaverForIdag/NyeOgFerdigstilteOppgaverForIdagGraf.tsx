import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import {
  XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalRectSeries, Hint, DiscreteColorLegend,
} from 'react-vis';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';

import { Kodeverk } from 'kodeverk/kodeverkTsType';
import behandlingType from 'kodeverk/behandlingType';
import kodeverkPropType from 'kodeverk/kodeverkPropType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { getKodeverk } from 'kodeverk/duck';

import 'react-vis/dist/style.css';
import styles from './nyeOgFerdigstilteOppgaverForIdagGraf.less';

const behandlingstypeOrder = [behandlingType.DOKUMENTINNSYN, behandlingType.KLAGE, behandlingType.REVURDERING, behandlingType.FORSTEGANGSSOKNAD];

const cssText = {
  fontFamily: 'Source Sans Pro, Arial, sans-serif',
  fontSize: '1rem',
  lineHeight: '1.375rem',
  fontWeight: 400,
};

interface Koordinat {
  x: number;
  y: number;
}

interface TsProps {
  intl: any;
  width: number;
  height: number;
  behandlingTyper: Kodeverk[];
  ferdigstilteOppgaver: Koordinat[];
  nyeOppgaver: Koordinat[];
  isEmpty: boolean;
}

interface StateTsProps {
  hintVerdi: any;
}

/**
 * NyeOgFerdigstilteOppgaverForIdagGraf
 */
export class NyeOgFerdigstilteOppgaverForIdagGraf extends Component<TsProps, StateTsProps> {
  static propTypes = {
    intl: intlShape.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    behandlingTyper: PropTypes.arrayOf(kodeverkPropType).isRequired,
    ferdigstilteOppgaver: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    })).isRequired,
    nyeOppgaver: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    })).isRequired,
    isEmpty: PropTypes.bool.isRequired,
  };

  constructor(props: TsProps) {
    super(props);

    this.state = {
      hintVerdi: undefined,
    };
  }

  leggTilHintVerdi = (hintVerdi: {x: number; x0: number; y: number}) => {
    this.setState(prevState => ({ ...prevState, hintVerdi }));
  };

  fjernHintVerdi = () => {
    this.setState(prevState => ({ ...prevState, hintVerdi: undefined }));
  };

  getHintAntall = (verdi: Koordinat) => {
    const {
      intl, ferdigstilteOppgaver,
    } = this.props;
    const isFerdigstiltVerdi = ferdigstilteOppgaver.find(b => b.y === verdi.y);
    return isFerdigstiltVerdi
      ? intl.formatMessage({ id: 'NyeOgFerdigstilteOppgaverForIdagGraf.FerdigstiltAntall' }, { antall: verdi.x })
      : intl.formatMessage({ id: 'NyeOgFerdigstilteOppgaverForIdagGraf.NyeAntall' }, { antall: verdi.x });
  };

  finnBehandlingTypeNavn = (behandlingTypeKode: string, intl: any) => {
    const {
      behandlingTyper,
    } = this.props;
    if (behandlingTypeKode === behandlingType.FORSTEGANGSSOKNAD) {
      return intl.formatMessage({ id: 'NyeOgFerdigstilteOppgaverForIdagGraf.Førstegangsbehandling' });
    }

    const type = behandlingTyper.find(bt => bt.kode === behandlingTypeKode);
    return type ? type.navn : '';
  }

  render = () => {
    const {
      width, height, ferdigstilteOppgaver, nyeOppgaver, isEmpty, intl,
    } = this.props;
    const {
      hintVerdi,
    } = this.state;

    const maxXValue = Math.max(...ferdigstilteOppgaver.map(b => b.x).concat(nyeOppgaver.map(b => b.x))) + 2;

    return (
      <Panel>
        <XYPlot
          dontCheckIfEmpty={isEmpty}
          margin={{
            left: 127, right: 30, top: 0, bottom: 30,
          }}
          width={width}
          height={height}
          yDomain={[0, 5]}
          xDomain={[0, isEmpty ? 10 : maxXValue]}
        >
          <VerticalGridLines />
          <XAxis style={{ text: cssText }} />
          <YAxis
            style={{ text: cssText }}
            tickFormat={(v, i) => this.finnBehandlingTypeNavn(behandlingstypeOrder[i], intl)}
            tickValues={[1, 2, 3, 4]}
          />
          <HorizontalRectSeries
            data={ferdigstilteOppgaver}
            onValueMouseOver={this.leggTilHintVerdi}
            onValueMouseOut={this.fjernHintVerdi}
            fill="#38a161"
            stroke="#38a161"
            opacity={0.5}
          />
          <HorizontalRectSeries
            data={nyeOppgaver}
            onValueMouseOver={this.leggTilHintVerdi}
            onValueMouseOut={this.fjernHintVerdi}
            fill="#337c9b"
            stroke="#337c9b"
            opacity={0.5}
          />
          {hintVerdi && (
          <Hint value={hintVerdi}>
            <div className={styles.hint}>
              {this.getHintAntall(hintVerdi)}
            </div>
          </Hint>
          )}
        </XYPlot>
        <div className={styles.center}>
          <DiscreteColorLegend
            orientation="horizontal"
            colors={['#38a161', '#337c9b']}
            items={[
              <Normaltekst className={styles.displayInline}>
                <FormattedMessage id="NyeOgFerdigstilteOppgaverForIdagGraf.Ferdigstilte" />
              </Normaltekst>,
              <Normaltekst className={styles.displayInline}>
                <FormattedMessage id="NyeOgFerdigstilteOppgaverForIdagGraf.Nye" />
              </Normaltekst>,
            ]}
          />
        </div>
      </Panel>
    );
  }
}

const settCustomHoydePaSoylene = (data, over) => {
  const transformert = data.map(el => ({
    ...el,
    y0: el.y + (over ? 0.41 : -0.03),
    y: el.y - (over ? -0.03 : -0.35),
  }));
  transformert.unshift({ x: 0, y: 0.5 });
  transformert.push({ x: 0, y: 4.5 });
  return transformert;
};

export const lagDatastrukturForFerdigstilte = createSelector([(state, ownProps) => ownProps],
  ownProps => settCustomHoydePaSoylene(ownProps.nyeOgFerdigstilteOppgaver.map(value => ({
    x: value.antallFerdigstilte,
    y: behandlingstypeOrder.indexOf(value.behandlingType.kode) + 1,
  })), true));

export const lagDatastrukturForNye = createSelector([(state, ownProps) => ownProps],
  ownProps => settCustomHoydePaSoylene(ownProps.nyeOgFerdigstilteOppgaver.map(value => ({
    x: value.antallNye,
    y: behandlingstypeOrder.indexOf(value.behandlingType.kode) + 1,
  })), false));

export const isEmpty = createSelector([(state, ownProps) => ownProps], ownProps => ownProps.nyeOgFerdigstilteOppgaver.length === 0);

const mapStateToProps = (state, ownProps) => ({
  isEmpty: isEmpty(state, ownProps),
  ferdigstilteOppgaver: lagDatastrukturForFerdigstilte(state, ownProps),
  nyeOppgaver: lagDatastrukturForNye(state, ownProps),
  behandlingTyper: getKodeverk(kodeverkTyper.BEHANDLING_TYPE)(state),
});

export default connect(mapStateToProps)(injectIntl(NyeOgFerdigstilteOppgaverForIdagGraf));
