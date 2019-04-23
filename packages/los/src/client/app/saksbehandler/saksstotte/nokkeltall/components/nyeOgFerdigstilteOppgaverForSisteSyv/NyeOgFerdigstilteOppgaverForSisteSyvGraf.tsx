import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { createSelector } from 'reselect';
import {
  XYPlot, XAxis, YAxis, HorizontalGridLines, AreaSeries, DiscreteColorLegend, Crosshair,
} from 'react-vis';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Panel from 'nav-frontend-paneler';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { DDMMYYYY_DATE_FORMAT } from 'utils/formats';


import 'react-vis/dist/style.css';
import styles from './nyeOgFerdigstilteOppgaverForSisteSyvGraf.less';

const cssText = {
  fontFamily: 'Source Sans Pro, Arial, sans-serif',
  fontSize: '1rem',
  lineHeight: '1.375rem',
  fontWeight: 400,
};

interface Koordinat {
  x: Date;
  y: number;
}

interface TsProps {
  intl: any;
  width: number;
  height: number;
  ferdigstilteOppgaver: Koordinat[];
  nyeOppgaver: Koordinat[];
  isEmpty: boolean;
}

interface CrosshairValue {
  x: Date;
  y: number;
}

interface StateTsProps {
  crosshairValues: CrosshairValue[];
}

/**
 * NyeOgFerdigstilteOppgaverForSisteSyvGraf
 */
export class NyeOgFerdigstilteOppgaverForSisteSyvGraf extends Component<TsProps, StateTsProps> {
  static propTypes = {
    intl: intlShape.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    ferdigstilteOppgaver: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.instanceOf(Date).isRequired,
      y: PropTypes.number.isRequired,
    })).isRequired,
    nyeOppgaver: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.instanceOf(Date).isRequired,
      y: PropTypes.number.isRequired,
    })).isRequired,
    isEmpty: PropTypes.bool.isRequired,
  };

  constructor(props: TsProps) {
    super(props);

    this.state = {
      crosshairValues: [],
    };
  }

  onMouseLeave = () => this.setState({ crosshairValues: [] });

  onNearestX = (value: {x: Date; y: number}) => {
    this.setState({
      crosshairValues: [value],
    });
  }

  getAntall = (oppgaver: Koordinat[]) => {
    const {
      crosshairValues,
    } = this.state;
    const oppgave = oppgaver.find(o => o.x.getTime() === crosshairValues[0].x.getTime());
    return oppgave ? oppgave.y : '';
  }

  render = () => {
    const {
      width, height, ferdigstilteOppgaver, nyeOppgaver, isEmpty,
    } = this.props;
    const {
      crosshairValues,
    } = this.state;

    const plotPropsWhenEmpty = isEmpty ? {
      yDomain: [0, 50],
      xDomain: [moment().subtract(7, 'd').startOf('day').toDate(), moment().subtract(1, 'd').startOf('day').toDate()],
    } : {};

    return (
      <Panel>
        <XYPlot
          dontCheckIfEmpty={isEmpty}
          margin={{
            left: 40, right: 60, top: 10, bottom: 30,
          }}
          width={width}
          height={height}
          xType="time"
          onMouseLeave={this.onMouseLeave}
          {...plotPropsWhenEmpty}
        >
          <HorizontalGridLines />
          <XAxis
            tickTotal={3}
            tickFormat={t => moment(t).format(DDMMYYYY_DATE_FORMAT)}
            style={{ text: cssText }}
          />
          <YAxis style={{ text: cssText }} />
          <AreaSeries
            data={ferdigstilteOppgaver}
            fill="#38a161"
            stroke="#38a161"
            opacity={0.5}
            onNearestX={this.onNearestX}
          />
          <AreaSeries
            data={nyeOppgaver}
            fill="#337c9b"
            stroke="#337c9b"
            opacity={0.5}
          />
          {crosshairValues.length > 0 && (
            <Crosshair
              values={crosshairValues}
              style={{
                line: {
                  background: '#3e3832',
                },
              }}
            >
              <div className={styles.crosshair}>
                <Normaltekst>{`${moment(crosshairValues[0].x).format(DDMMYYYY_DATE_FORMAT)}`}</Normaltekst>
                <Undertekst>
                  <FormattedMessage
                    id="NyeOgFerdigstilteOppgaverForSisteSyvGraf.FerdigstiltAntall"
                    values={{ antall: this.getAntall(ferdigstilteOppgaver) }}
                  />
                </Undertekst>
                <Undertekst>
                  <FormattedMessage id="NyeOgFerdigstilteOppgaverForSisteSyvGraf.NyeAntall" values={{ antall: this.getAntall(nyeOppgaver) }} />
                </Undertekst>
              </div>
            </Crosshair>
          )}
        </XYPlot>
        <div className={styles.center}>
          <DiscreteColorLegend
            orientation="horizontal"
            colors={['#38a161', '#337c9b']}
            items={[
              <Normaltekst className={styles.displayInline}>
                <FormattedMessage id="NyeOgFerdigstilteOppgaverForSisteSyvGraf.Ferdigstilte" />
              </Normaltekst>,
              <Normaltekst className={styles.displayInline}>
                <FormattedMessage id="NyeOgFerdigstilteOppgaverForSisteSyvGraf.Nye" />
              </Normaltekst>,
            ]}
          />
        </div>
      </Panel>
    );
  }
}

export const slaSammenBehandlingstyperOgFyllInnTomme = createSelector([(state, ownProps) => ownProps], (ownProps) => {
  const oppgaver = [];
  const { nyeOgFerdigstilteOppgaver } = ownProps;

  if (nyeOgFerdigstilteOppgaver.length > 0) {
    const iDag = moment().startOf('day');
    const atteDagerSiden = moment().subtract(7, 'days').startOf('day');

    for (let dato = atteDagerSiden; dato.isBefore(iDag); dato = dato.add(1, 'days')) {
      const dataForDato = nyeOgFerdigstilteOppgaver.filter(o => moment(o.dato).startOf('day').isSame(dato));
      if (dataForDato.length === 0) {
        oppgaver.push({
          antallNye: 0,
          antallFerdigstilte: 0,
          dato: dato.toDate(),
        });
      } else {
        oppgaver.push({
          antallNye: dataForDato.reduce((acc, d) => acc + d.antallNye, 0),
          antallFerdigstilte: dataForDato.reduce((acc, d) => acc + d.antallFerdigstilte, 0),
          dato: dato.toDate(),
        });
      }
    }
  }

  return oppgaver;
});

export const lagDatastrukturForFerdigstilte = createSelector([slaSammenBehandlingstyperOgFyllInnTomme], oppgaver => oppgaver.map(o => ({
  x: o.dato,
  y: o.antallFerdigstilte,
})));

export const lagDatastrukturForNye = createSelector([slaSammenBehandlingstyperOgFyllInnTomme], oppgaver => oppgaver.map(o => ({
  x: o.dato,
  y: o.antallNye,
})));

export const isEmpty = createSelector([(state, ownProps) => ownProps], ownProps => ownProps.nyeOgFerdigstilteOppgaver.length === 0);

const mapStateToProps = (state, ownProps) => ({
  isEmpty: isEmpty(state, ownProps),
  ferdigstilteOppgaver: lagDatastrukturForFerdigstilte(state, ownProps),
  nyeOppgaver: lagDatastrukturForNye(state, ownProps),
});

export default connect(mapStateToProps)(injectIntl(NyeOgFerdigstilteOppgaverForSisteSyvGraf));
