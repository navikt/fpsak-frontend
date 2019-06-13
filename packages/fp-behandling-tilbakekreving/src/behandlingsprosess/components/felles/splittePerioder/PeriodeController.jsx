import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';

import { Image, EditedIcon } from '@fpsak-frontend/shared-components';
import splitPeriodImageHoverUrl from '@fpsak-frontend/assets/images/splitt_hover.svg';
import splitPeriodImageUrl from '@fpsak-frontend/assets/images/splitt.svg';
import arrowLeftImageUrl from '@fpsak-frontend/assets/images/arrow_left.svg';
import arrowLeftFilledImageUrl from '@fpsak-frontend/assets/images/arrow_left_filled.svg';
import arrowRightImageUrl from '@fpsak-frontend/assets/images/arrow_right.svg';
import arrowRightFilledImageUrl from '@fpsak-frontend/assets/images/arrow_right_filled.svg';

import { beregnBeløp } from 'behandlingTilbakekreving/src/behandlingsprosess/duckBpTilbake';
import { getSelectedBehandlingId } from 'behandlingTilbakekreving/src/duckTilbake';
import DelOppPeriodeModal from './DelOppPeriodeModal';

import styles from './periodeController.less';

const findArrowLeftImg = isHovering => (isHovering ? arrowLeftFilledImageUrl : arrowLeftImageUrl);
const findArrowRightImg = isHovering => (isHovering ? arrowRightFilledImageUrl : arrowRightImageUrl);
const splitPeriodImg = isHovering => (isHovering ? splitPeriodImageHoverUrl : splitPeriodImageUrl);

const isEdited = false;

export class PeriodeControllerImpl extends Component {
  static propTypes = {
    behandlingId: PropTypes.number.isRequired,
    beregnBeløp: PropTypes.func.isRequired,
    oppdaterSplittedePerioder: PropTypes.func.isRequired,
    callbackForward: PropTypes.func.isRequired,
    callbackBackward: PropTypes.func.isRequired,
    periode: PropTypes.shape().isRequired,
    readOnly: PropTypes.bool.isRequired,
  };

  constructor() {
    super();
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.splitPeriod = this.splitPeriod.bind(this);

    this.state = {
      showDelPeriodeModal: false,
    };
  }

  showModal(event) {
    this.setState(state => ({
      ...state,
      showDelPeriodeModal: true,
    }));
    event.preventDefault();
  }

  hideModal() {
    this.setState({
      showDelPeriodeModal: false,
    });
  }

  splitPeriod(formValues) {
    const {
      periode,
      beregnBeløp: callBeregnBeløp,
      behandlingId: selectedBehandlingId,
      oppdaterSplittedePerioder,
    } = this.props;

    const forstePeriode = {
      belop: periode.feilutbetaling,
      fom: formValues.forstePeriode.fom,
      tom: formValues.forstePeriode.tom,
      begrunnelse: periode.begrunnelse ? periode.begrunnelse : ' ',
    };
    const andrePeriode = {
      belop: periode.feilutbetaling,
      fom: formValues.andrePeriode.fom,
      tom: formValues.andrePeriode.tom,
      begrunnelse: periode.begrunnelse ? periode.begrunnelse : ' ',
    };

    const params = {
      behandlingId: selectedBehandlingId,
      perioder: [forstePeriode, andrePeriode],
    };

    callBeregnBeløp(params).then((response) => {
      const forstePeriodeMedBeløp = {
        fom: forstePeriode.fom,
        tom: forstePeriode.tom,
        feilutbetaling: response.perioder[0].belop,
      };
      const andrePeriodeMedBeløp = {
        fom: andrePeriode.fom,
        tom: andrePeriode.tom,
        feilutbetaling: response.perioder[1].belop,
      };
      this.hideModal();
      oppdaterSplittedePerioder([forstePeriodeMedBeløp, andrePeriodeMedBeløp]);
    });
  }

  render() {
    const {
      callbackForward,
      callbackBackward,
      periode,
      readOnly,
    } = this.props;

    const { showDelPeriodeModal } = this.state;

    return (
      <Row>
        <Column xs="3">
          <Element>
            <FormattedMessage id="UttakTimeLineData.PeriodeData.Detaljer" />
            {isEdited && <EditedIcon />}
          </Element>
        </Column>
        <Column xs="7">
          {!readOnly
          && (
            <span className={styles.splitPeriodPosition}>
              <Image
                tabIndex="0"
                className={styles.splitPeriodImage}
                imageSrcFunction={splitPeriodImg}
                altCode="UttakTimeLineData.PeriodeData.DelOppPerioden"
                onMouseDown={this.showModal}
                onKeyDown={e => (e.keyCode === 13 ? this.showModal(e) : null)}
              />

              <FormattedMessage id="UttakTimeLineData.PeriodeData.DelOppPerioden" />
            </span>
          )
          }
          {showDelPeriodeModal
          && (
            <DelOppPeriodeModal
              cancelEvent={this.hideModal}
              showModal={showDelPeriodeModal}
              periodeData={periode}
              splitPeriod={this.splitPeriod}
            />
          )
          }
        </Column>
        <Column xs="2">
          <span className={styles.navigationPosition}>
            <Image
              tabIndex="0"
              className={styles.timeLineButton}
              imageSrcFunction={findArrowLeftImg}
              altCode="Timeline.prevPeriod"
              onMouseDown={callbackBackward}
              onKeyDown={callbackBackward}
            />
            <Image
              tabIndex="0"
              className={styles.timeLineButton}
              imageSrcFunction={findArrowRightImg}
              altCode="Timeline.nextPeriod"
              onMouseDown={callbackForward}
              onKeyDown={callbackForward}
            />
          </span>
        </Column>
      </Row>
    );
  }
}

const mapStateToPros = state => ({
  behandlingId: getSelectedBehandlingId(state),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    beregnBeløp,
  }, dispatch),
});

const PeriodeController = connect(mapStateToPros, mapDispatchToProps)(PeriodeControllerImpl);

export default PeriodeController;
