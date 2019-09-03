import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';

import { calcDays } from '@fpsak-frontend/utils';
import {
  AksjonspunktHelpText, EditedIcon, ElementWrapper, Image, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import splitPeriodImageHoverUrl from '@fpsak-frontend/assets/images/splitt_hover.svg';
import splitPeriodImageUrl from '@fpsak-frontend/assets/images/splitt.svg';
import arrowLeftImageUrl from '@fpsak-frontend/assets/images/arrow_left.svg';
import arrowLeftFilledImageUrl from '@fpsak-frontend/assets/images/arrow_left_filled.svg';
import arrowRightImageUrl from '@fpsak-frontend/assets/images/arrow_right.svg';
import arrowRightFilledImageUrl from '@fpsak-frontend/assets/images/arrow_right_filled.svg';
import { uttaksresultatAktivitetPropType } from '@fpsak-frontend/prop-types';
import { injectKodeverk } from '@fpsak-frontend/fp-felles';

import { getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import UttakActivity from './UttakActivity';
import DelOppPeriodeModal from './DelOppPeriodeModal';

import styles from './uttakTimeLineData.less';

const findArrowLeftImg = (isHovering) => (isHovering ? arrowLeftFilledImageUrl : arrowLeftImageUrl);
const findArrowRightImg = (isHovering) => (isHovering ? arrowRightFilledImageUrl : arrowRightImageUrl);
const splitPeriodImg = (isHovering) => (isHovering ? splitPeriodImageHoverUrl : splitPeriodImageUrl);

const getCorrectEmptyArbeidsForhold = (preiodeTypeKode, arbeidsForhold, getKodeverknavn) => {
  const arbeidsForholdMedNullDagerIgjenArray = [];
  let arbeidsforholdMedPositivSaldoFinnes = false;
  if (arbeidsForhold.stonadskontoer[preiodeTypeKode] && arbeidsForhold.stonadskontoer[preiodeTypeKode].aktivitetSaldoDtoList) {
    arbeidsForhold.stonadskontoer[preiodeTypeKode].aktivitetSaldoDtoList.forEach((item) => {
      if (item.saldo === 0) {
        if (item.aktivitetIdentifikator.arbeidsgiver) {
          arbeidsForholdMedNullDagerIgjenArray.push(item.aktivitetIdentifikator.arbeidsgiver.navn);
        } else {
          arbeidsForholdMedNullDagerIgjenArray.push(getKodeverknavn(item.aktivitetIdentifikator.uttakArbeidType));
        }
      } else {
        arbeidsforholdMedPositivSaldoFinnes = true;
      }
    });
  }
  if (arbeidsforholdMedPositivSaldoFinnes) {
    return arbeidsForholdMedNullDagerIgjenArray;
  }
  return [];
};

const hentApTekst = (manuellBehandlingÅrsak, stonadskonto, getKodeverknavn, aktiviteter) => {
  const texts = [];

  // TODO: Fix - ta bort 5001 med verdi fra kodeverk
  if (manuellBehandlingÅrsak.kode === '5001') {
    const arbeidsForhold = getCorrectEmptyArbeidsForhold(aktiviteter, stonadskonto, getKodeverknavn);
    const arbeidsForholdMedNullDagerIgjen = arbeidsForhold.join();
    if (arbeidsForhold.length > 1) {
      texts.push(
        <FormattedMessage
          key="manuellÅrsak"
          id="UttakPanel.manuellBehandlingÅrsakArbeidsforhold"
          values={{ arbeidsforhold: arbeidsForholdMedNullDagerIgjen }}
        />,
      );
    } else if (arbeidsForhold.length === 1) {
      texts.push(
        <FormattedMessage
          key="manuellÅrsak"
          id="UttakPanel.manuellBehandlingÅrsakEnskiltArbeidsforhold"
          values={{ arbeidsforhold: arbeidsForhold }}
        />,
      );
    } else {
      texts.push(
        <React.Fragment key={`kode-${manuellBehandlingÅrsak.kode}`}>
          {getKodeverknavn(manuellBehandlingÅrsak)}
        </React.Fragment>,
      );
    }
  } else {
    texts.push(<React.Fragment key={`kode-${manuellBehandlingÅrsak.kode}`}>{getKodeverknavn(manuellBehandlingÅrsak)}</React.Fragment>);
  }

  return texts;
};

export const kalkulerTrekkdager = (aktivitet, samtidigUttak, samtidigUttaksprosent, virkedager) => {
  let uttaksgrad = aktivitet.gradering ? (100 - aktivitet.prosentArbeid) / 100 : 1;
  uttaksgrad = samtidigUttak ? samtidigUttaksprosent / 100 : uttaksgrad;

  const trekkdager = uttaksgrad * virkedager;

  return {
    weeks: Math.trunc(trekkdager / 5),
    days: (trekkdager % 5).toFixed(1),
    trekkdagerDesimaler: trekkdager,
  };
};

export class UttakTimeLineData extends Component {
  constructor() {
    super();
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.splitPeriod = this.splitPeriod.bind(this);

    this.state = {
      showDelPeriodeModal: false,
    };
  }

  setFormField(fieldName, fieldValue) {
    const { behandlingFormPrefix, formName, reduxFormChange: formChange } = this.props;
    formChange(`${behandlingFormPrefix}.${formName}`, fieldName, fieldValue);
  }

  showModal(event) {
    event.preventDefault();
    this.setState({
      showDelPeriodeModal: true,
    });
    const { behandlingFormPrefix, reduxFormChange: formChange } = this.props;
    formChange(`${behandlingFormPrefix}.${'DelOppPeriode'}`, 'ForstePeriodeTomDato', null);
  }

  hideModal() {
    this.setState({
      showDelPeriodeModal: false,
    });
  }

  splitPeriod(formValues) {
    const { uttaksresultatActivity, activityPanelName, callbackSetSelected: setSelected } = this.props;
    const {
      periodeId, forstePeriode, andrePeriode, hovedsoker,
    } = formValues;

    const periodeSomSkalSplittes = uttaksresultatActivity.find((o) => o.id === periodeId);
    const alleAndrePerioder = uttaksresultatActivity.filter((o) => o.id !== periodeId);

    const virkedagerForPeriode1 = calcDays(forstePeriode.fom, forstePeriode.tom);
    const virkedagerForPeriode2 = calcDays(andrePeriode.fom, andrePeriode.tom);

    const { samtidigUttak, samtidigUttaksprosent } = periodeSomSkalSplittes;
    const oppdaterteAktiviteterPeriode1 = periodeSomSkalSplittes.aktiviteter
      .map((aktivitet) => ({ ...aktivitet, ...kalkulerTrekkdager(aktivitet, samtidigUttak, samtidigUttaksprosent, virkedagerForPeriode1) }));
    const oppdaterteAktiviteterPeriode2 = periodeSomSkalSplittes.aktiviteter
      .map((aktivitet) => ({ ...aktivitet, ...kalkulerTrekkdager(aktivitet, samtidigUttak, samtidigUttaksprosent, virkedagerForPeriode2) }));

    const nyPeriode1 = {
      ...periodeSomSkalSplittes,
      fom: forstePeriode.fom,
      tom: forstePeriode.tom,
      begrunnelse: periodeSomSkalSplittes.begrunnelse ? periodeSomSkalSplittes.begrunnelse : ' ',
      aktiviteter: oppdaterteAktiviteterPeriode1,
      hovedsoker,
    };
    const nyPeriode2 = {
      ...periodeSomSkalSplittes,
      fom: andrePeriode.fom,
      tom: andrePeriode.tom,
      begrunnelse: periodeSomSkalSplittes.begrunnelse ? periodeSomSkalSplittes.begrunnelse : ' ',
      aktiviteter: oppdaterteAktiviteterPeriode2,
      hovedsoker,
    };

    const sorterteAktiviteter = alleAndrePerioder.concat(nyPeriode1, nyPeriode2);
    sorterteAktiviteter.sort((a, b) => a.id - b.id);

    this.setFormField(activityPanelName, sorterteAktiviteter);
    this.hideModal();
    setSelected(nyPeriode1);
  }

  render() {
    const {
      readOnly,
      selectedItemData,
      callbackForward,
      callbackBackward,
      callbackUpdateActivity,
      callbackCancelSelectedActivity,
      isApOpen,
      stonadskonto,
      harSoktOmFlerbarnsdager,
      getKodeverknavn,
    } = this.props;
    const { showDelPeriodeModal } = this.state;
    const isEdited = !!selectedItemData.begrunnelse && !isApOpen;
    return (
      <Row key={`selectedItemData_${selectedItemData.id}`}>
        <Column xs="12">
          <div className={styles.showDataContainer}>
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
                      onKeyDown={(e) => (e.keyCode === 13 ? this.showModal(e) : null)}
                    />

                    <FormattedMessage id="UttakTimeLineData.PeriodeData.DelOppPerioden" />
                  </span>
                )}
                {showDelPeriodeModal
                && (
                  <DelOppPeriodeModal
                    cancelEvent={this.hideModal}
                    showModal={showDelPeriodeModal}
                    periodeData={selectedItemData}
                    splitPeriod={this.splitPeriod}
                  />
                )}
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
            {selectedItemData.manuellBehandlingÅrsak && selectedItemData.manuellBehandlingÅrsak.kode !== '-' && (
            <ElementWrapper>
              <AksjonspunktHelpText isAksjonspunktOpen={selectedItemData.manuellBehandlingÅrsak !== null}>
                {selectedItemData.periodeType
                  ? hentApTekst(selectedItemData.manuellBehandlingÅrsak, stonadskonto, getKodeverknavn, selectedItemData.periodeType.kode)
                  : hentApTekst(selectedItemData.manuellBehandlingÅrsak, stonadskonto, getKodeverknavn)}
              </AksjonspunktHelpText>
              <VerticalSpacer twentyPx />
            </ElementWrapper>
            )}
            <UttakActivity
              cancelSelectedActivity={callbackCancelSelectedActivity}
              updateActivity={callbackUpdateActivity}
              selectedItemData={selectedItemData}
              readOnly={readOnly}
              isApOpen={isApOpen}
              harSoktOmFlerbarnsdager={harSoktOmFlerbarnsdager}
            />
          </div>
        </Column>
      </Row>
    );
  }
}

UttakTimeLineData.propTypes = {
  selectedItemData: uttaksresultatAktivitetPropType,
  callbackForward: PropTypes.func.isRequired,
  callbackSetSelected: PropTypes.func.isRequired,
  callbackBackward: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  callbackUpdateActivity: PropTypes.func.isRequired,
  callbackCancelSelectedActivity: PropTypes.func.isRequired,
  uttaksresultatActivity: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
  activityPanelName: PropTypes.string.isRequired,
  isApOpen: PropTypes.bool,
  stonadskonto: PropTypes.shape(),
  harSoktOmFlerbarnsdager: PropTypes.bool.isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

UttakTimeLineData.defaultProps = {
  selectedItemData: undefined,
  isApOpen: false,
  stonadskonto: {},
};

export default injectKodeverk(getAlleKodeverk)(UttakTimeLineData);
