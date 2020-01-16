import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';

import { calcDays } from '@fpsak-frontend/utils';
import {
  AksjonspunktHelpText, EditedIcon, ElementWrapper, Image, VerticalSpacer, FloatRight,
} from '@fpsak-frontend/shared-components';
import splitPeriodImageHoverUrl from '@fpsak-frontend/assets/images/splitt_hover.svg';
import splitPeriodImageUrl from '@fpsak-frontend/assets/images/splitt.svg';
import { uttaksresultatAktivitetPropType } from '@fpsak-frontend/prop-types';
import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import { TimeLineButton, TimeLineDataContainer } from '@fpsak-frontend/tidslinje';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import UttakActivity from './UttakActivity';
import DelOppPeriodeModal from './DelOppPeriodeModal';

import styles from './uttakTimeLineData.less';

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
    const nyId = periodeId + 1;

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
      id: nyId,
      fom: andrePeriode.fom,
      tom: andrePeriode.tom,
      begrunnelse: periodeSomSkalSplittes.begrunnelse ? periodeSomSkalSplittes.begrunnelse : ' ',
      aktiviteter: oppdaterteAktiviteterPeriode2,
      hovedsoker,
    };

    alleAndrePerioder.forEach((p) => {
      if (p.id >= nyId) {
        // eslint-disable-next-line no-param-reassign
        p.id += 1;
      }
    });

    const sorterteAktiviteter = alleAndrePerioder.concat(nyPeriode1, nyPeriode2);
    sorterteAktiviteter.sort((a, b) => a.id - b.id);

    this.setFormField(activityPanelName, sorterteAktiviteter);
    this.hideModal();
    setSelected(nyPeriode1);
  }

  render() {
    const {
      callbackBackward,
      callbackCancelSelectedActivity,
      callbackForward,
      callbackUpdateActivity,
      harSoktOmFlerbarnsdager,
      alleKodeverk,
      behandlingId,
      behandlingVersjon,
      behandlingsresultat,
      intl,
      isApOpen,
      readOnly,
      selectedItemData,
      stonadskonto,
    } = this.props;
    const { showDelPeriodeModal } = this.state;
    const isEdited = !!selectedItemData.begrunnelse && !isApOpen;
    const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);

    return (
      <TimeLineDataContainer key={`selectedItemData_${selectedItemData.id}`}>
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
                    src={splitPeriodImageUrl}
                    srcHover={splitPeriodImageHoverUrl}
                    alt={intl.formatMessage({ id: 'UttakTimeLineData.PeriodeData.DelOppPerioden' })}
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
                  behandlingId={behandlingId}
                  behandlingVersjon={behandlingVersjon}
                />
              )}
          </Column>
          <Column xs="2">
            <FloatRight>
              <TimeLineButton text={intl.formatMessage({ id: 'Timeline.prevPeriod' })} type="prev" callback={callbackBackward} />
              <TimeLineButton text={intl.formatMessage({ id: 'Timeline.nextPeriod' })} type="next" callback={callbackForward} />
            </FloatRight>
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
          alleKodeverk={alleKodeverk}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          behandlingsresultat={behandlingsresultat}
        />
      </TimeLineDataContainer>
    );
  }
}

UttakTimeLineData.propTypes = {
  activityPanelName: PropTypes.string.isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  callbackBackward: PropTypes.func.isRequired,
  callbackCancelSelectedActivity: PropTypes.func.isRequired,
  callbackForward: PropTypes.func.isRequired,
  callbackSetSelected: PropTypes.func.isRequired,
  callbackUpdateActivity: PropTypes.func.isRequired,
  formName: PropTypes.string.isRequired,
  harSoktOmFlerbarnsdager: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
  isApOpen: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  selectedItemData: uttaksresultatAktivitetPropType,
  stonadskonto: PropTypes.shape(),
  uttaksresultatActivity: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
};

UttakTimeLineData.defaultProps = {
  isApOpen: false,
  selectedItemData: undefined,
  stonadskonto: {},
};

export default injectIntl(UttakTimeLineData);
