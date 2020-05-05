import React, {
  useRef, useEffect, useState, useCallback, FunctionComponent,
} from 'react';
import {
  FormattedMessage, createIntl, createIntlCache, RawIntlProvider,
} from 'react-intl';
import Popover from '@navikt/nap-popover';
import { Knapp } from 'nav-frontend-knapper';
import BoxedListWithSelection from '@navikt/boxed-list-with-selection';

import { Image } from '@fpsak-frontend/shared-components';
import openImage from '@fpsak-frontend/assets/images/pil_opp.svg';
import closedImage from '@fpsak-frontend/assets/images/pil_ned.svg';

import messages from '../i18n/nb_NO.json';
import MenyInnslagData from './MenyInnslagData';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

interface OwnProps {
  data: MenyInnslagData[];
}

const MenySakIndex: FunctionComponent<OwnProps> = ({
  data,
}) => {
  const filtrertData = data.filter((d) => d.erSynlig);

  const [visMenyModal, setVisMenyModal] = useState(false);
  const [valgtModal, setValgtModal] = useState(-1);
  const toggleMenyModal = useCallback(() => setVisMenyModal(!visMenyModal), [visMenyModal]);

  const menyRef = useRef(null);
  const handleClickOutside = (event) => {
    if (menyRef.current && !menyRef.current.contains(event.target)) {
      toggleMenyModal();
    }
  };
  useEffect(() => {
    if (visMenyModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return (
    <RawIntlProvider value={intl}>
      <div ref={menyRef}>
        <Popover
          popperIsVisible={visMenyModal}
          renderArrowElement
          customPopperStyles={{ top: '4px', zIndex: 1 }}
          popperProps={{
            children: () => (
              <BoxedListWithSelection
                items={filtrertData.map((d) => ({
                  name: d.tekst,
                }))}
                onClick={(index) => { setValgtModal(index); toggleMenyModal(); }}
              />
            ),
            placement: 'bottom-start',
            positionFixed: true,
          }}
          referenceProps={{
            children: ({ ref }) => (
              <div ref={ref}>
                <Knapp mini kompakt onClick={toggleMenyModal}>
                  <FormattedMessage id="MenySakIndex.Behandlingsmeny" />
                  <span style={{ marginLeft: '5px' }}>
                    <Image src={visMenyModal ? openImage : closedImage} />
                  </span>
                </Knapp>
              </div>
            ),
          }}
        />
      </div>
      {valgtModal !== -1 && filtrertData[valgtModal].modal(() => setValgtModal(-1))}
    </RawIntlProvider>
  );
};

export default MenySakIndex;
