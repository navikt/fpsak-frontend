import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Element, EtikettLiten } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import Alertstripe from 'nav-frontend-alertstriper';

import { ReactComponent as PopOutPilSvg } from '@fpsak-frontend/assets/images/pop-out-pil.svg';
import { TextAreaField } from '@fpsak-frontend/form';
import { AvsnittSkiller, VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  getLanguageCodeFromSprakkode, hasValidText, maxLength, minLength, required,
} from '@fpsak-frontend/utils';

import styles from './fritekstBrevPanel.less';

const maxLength200 = maxLength(200);
const maxLength5000 = maxLength(5000);
const minLength3 = minLength(3);

const FritekstBrevPanelImpl = ({
  previewOverstyrtBrev,
  readOnly,
  sprakkode,
  skalViseLink,
}) => (
  <>
    <AvsnittSkiller />
    <VerticalSpacer twentyPx />
    <Row>
      <Column xs="3">
        <Element>
          <FormattedMessage id="FritekstBrevPanel.ManueltVedtaksbrev" />
        </Element>
      </Column>
      <Column xs="2">
        <EtikettLiten>
          <FormattedMessage id={getLanguageCodeFromSprakkode(sprakkode)} />
        </EtikettLiten>
      </Column>
      <Column xs="5">
        {!readOnly && skalViseLink && (
          <>
            <Lenke href="#" onClick={previewOverstyrtBrev}>
              <FormattedMessage id="FritekstBrevPanel.ForhandsvisManueltVedtaksbrev" />
            </Lenke>
            <PopOutPilSvg className={styles.pil} />
          </>
        )}
      </Column>
    </Row>
    <hr className={styles.line} />
    <VerticalSpacer twentyPx />
    {!readOnly && (
      <Alertstripe type="info" form="inline">
        <Element>
          <FormattedMessage id="VedtakFellesPanel.Forklaring" />
        </Element>
      </Alertstripe>
    )}
    <VerticalSpacer sixteenPx />
    <Row>
      <Column xs="8">
        <TextAreaField
          name="overskrift"
          label={{ id: 'VedtakForm.Overskrift' }}
          validate={[required, minLength3, maxLength200, hasValidText]}
          maxLength={200}
          rows={1}
          readOnly={readOnly}
          className={styles.smallTextArea}
        />
      </Column>
    </Row>
    <VerticalSpacer sixteenPx />
    <Row>
      <Column xs="8">
        <TextAreaField
          name="brødtekst"
          label={{ id: 'VedtakForm.Innhold' }}
          validate={[required, minLength3, maxLength5000, hasValidText]}
          maxLength={5000}
          readOnly={readOnly}
          textareaClass={styles.bigTextArea}
        />
      </Column>
    </Row>
  </>
);

FritekstBrevPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  skalViseLink: PropTypes.bool.isRequired,
  previewOverstyrtBrev: PropTypes.func.isRequired,
  sprakkode: PropTypes.shape().isRequired,
};

export default injectIntl(FritekstBrevPanelImpl);
