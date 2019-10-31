import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import { FormattedMessage, useIntl } from 'react-intl';
import { uttaksresultatAktivitetPropType } from '@fpsak-frontend/prop-types';

import { TimeLineButton, TimeLineDataContainer } from '@fpsak-frontend/tidslinje';
import { FloatRight } from '@fpsak-frontend/shared-components';
import UttakActivity from './UttakActivity';

const UttakMedsokerReadOnly = ({
  readOnly,
  selectedItemData,
  callbackForward,
  callbackBackward,
  callbackUpdateActivity,
  callbackCancelSelectedActivity,
  isApOpen,
  harSoktOmFlerbarnsdager,
  alleKodeverk,
  behandlingId,
  behandlingVersjon,
  behandlingsresultat,
}) => {
  const intl = useIntl();
  return (
    <TimeLineDataContainer>
      <Row>
        <Column xs="3">
          <Element>
            <FormattedMessage id="UttakTimeLineData.PeriodeData.Detaljer" />
          </Element>
        </Column>
        <Column xs="7" />
        <Column xs="2">
          <FloatRight>
            <TimeLineButton text={intl.formatMessage({ id: 'Timeline.prevPeriod' })} type="prev" callback={callbackBackward} />
            <TimeLineButton text={intl.formatMessage({ id: 'Timeline.nextPeriod' })} type="next" callback={callbackForward} />
          </FloatRight>
        </Column>
      </Row>
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
};

UttakMedsokerReadOnly.propTypes = {
  selectedItemData: uttaksresultatAktivitetPropType,
  callbackForward: PropTypes.func.isRequired,
  callbackBackward: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  callbackUpdateActivity: PropTypes.func.isRequired,
  callbackCancelSelectedActivity: PropTypes.func.isRequired,
  isApOpen: PropTypes.bool,
  harSoktOmFlerbarnsdager: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
};

UttakMedsokerReadOnly.defaultProps = {
  selectedItemData: undefined,
  isApOpen: false,
};

export default UttakMedsokerReadOnly;
