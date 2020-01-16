import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl } from 'react-intl';

import { EditedIcon, Image, FloatRight } from '@fpsak-frontend/shared-components';
import splitPeriodImageHoverUrl from '@fpsak-frontend/assets/images/splitt_hover.svg';
import splitPeriodImageUrl from '@fpsak-frontend/assets/images/splitt.svg';
import { TimeLineButton } from '@fpsak-frontend/tidslinje';

import DelOppPeriodeModal from './DelOppPeriodeModal';

import styles from './periodeController.less';

const isEdited = false;

export class PeriodeController extends Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    behandlingId: PropTypes.number.isRequired,
    behandlingVersjon: PropTypes.number.isRequired,
    beregnBelop: PropTypes.func.isRequired,
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
      finnesBelopMed0Verdi: false,
    };
  }

  showModal(event) {
    this.setState((state) => ({
      ...state,
      showDelPeriodeModal: true,
    }));
    event.preventDefault();
  }

  hideModal() {
    this.setState((state) => ({
      ...state,
      showDelPeriodeModal: false,
    }));
  }

  splitPeriod(formValues) {
    this.setState((state) => ({
      ...state,
      finnesBelopMed0Verdi: false,
    }));

    const {
      periode,
      beregnBelop: callBeregnBelop,
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

    callBeregnBelop(params).then((response) => {
      const { perioder } = response.payload;
      const harPeriodeMedBelop0 = perioder.some((p) => p.belop === 0);
      if (harPeriodeMedBelop0) {
        this.setState((state) => ({
          ...state,
          finnesBelopMed0Verdi: true,
        }));
      } else {
        const forstePeriodeMedBeløp = {
          fom: forstePeriode.fom,
          tom: forstePeriode.tom,
          feilutbetaling: perioder[0].belop,
        };
        const andrePeriodeMedBeløp = {
          fom: andrePeriode.fom,
          tom: andrePeriode.tom,
          feilutbetaling: perioder[1].belop,
        };
        this.hideModal();
        oppdaterSplittedePerioder([forstePeriodeMedBeløp, andrePeriodeMedBeløp]);
      }
    });
  }

  render() {
    const {
      intl,
      callbackForward,
      callbackBackward,
      periode,
      readOnly,
      behandlingId,
      behandlingVersjon,
    } = this.props;

    const { showDelPeriodeModal, finnesBelopMed0Verdi } = this.state;

    return (
      <Row>
        <Column xs="3">
          <Element>
            <FormattedMessage id="PeriodeController.Detaljer" />
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
                src={splitPeriodImageUrl}
                srcHover={splitPeriodImageHoverUrl}
                alt={intl.formatMessage({ id: 'PeriodeController.DelOppPerioden' })}
                onMouseDown={this.showModal}
                onKeyDown={(e) => (e.keyCode === 13 ? this.showModal(e) : null)}
              />
              <FormattedMessage id="PeriodeController.DelOppPerioden" />
            </span>
          )}
          {showDelPeriodeModal
          && (
            <DelOppPeriodeModal
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              cancelEvent={this.hideModal}
              showModal={showDelPeriodeModal}
              periodeData={periode}
              splitPeriod={this.splitPeriod}
              finnesBelopMed0Verdi={finnesBelopMed0Verdi}
            />
          )}
        </Column>
        <Column xs="2">
          <FloatRight>
            <TimeLineButton text={intl.formatMessage({ id: 'PeriodeController.ForrigePeriode' })} type="prev" callback={callbackBackward} />
            <TimeLineButton text={intl.formatMessage({ id: 'PeriodeController.NestePeriode' })} type="next" callback={callbackForward} />
          </FloatRight>
        </Column>
      </Row>
    );
  }
}

export default injectIntl(PeriodeController);
