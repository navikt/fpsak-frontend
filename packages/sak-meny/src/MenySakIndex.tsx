import React, {
  useRef, useEffect, useState, useCallback, FunctionComponent,
} from 'react';
import {
  FormattedMessage, createIntl, createIntlCache, RawIntlProvider,
} from 'react-intl';
import Popover from '@navikt/nap-popover';
import BoxedListWithSelection from '@navikt/boxed-list-with-selection';
import { Knapp } from 'nav-frontend-knapper';

import { Image } from '@fpsak-frontend/shared-components';
import openImage from '@fpsak-frontend/assets/images/pil_opp.svg';
import closedImage from '@fpsak-frontend/assets/images/pil_ned.svg';

import MenyData from './MenyData';

import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

interface OwnProps {
  data: MenyData[];
}

const MenySakIndex: FunctionComponent<OwnProps> = ({
  data,
}) => {
  const filtrertData = data.filter((d) => d.erSynlig);

  const [visMenySomApen, setVisMenyTilApen] = useState(false);
  const toggleMenyVisning = useCallback(() => setVisMenyTilApen(!visMenySomApen), [visMenySomApen]);

  const [valgtModal, setValgtModal] = useState(-1);

  const menyRef = useRef(null);
  const handleClickOutside = (event) => {
    if (menyRef.current && !menyRef.current.contains(event.target)) {
      toggleMenyVisning();
    }
  };
  useEffect(() => {
    if (visMenySomApen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visMenySomApen]);

  return (
    <RawIntlProvider value={intl}>
      <div ref={menyRef}>
        <Popover
          popperIsVisible={visMenySomApen}
          renderArrowElement={false}
          customPopperStyles={{ top: '2px', zIndex: 1 }}
          popperProps={{
            children: () => (
              <BoxedListWithSelection
                items={filtrertData.map((d) => ({
                  name: d.tekst,
                }))}
                onClick={(index) => { setValgtModal(index); toggleMenyVisning(); }}
              />
            ),
            placement: 'bottom-start',
            positionFixed: false,
          }}
          referenceProps={{
            children: ({ ref }) => (
              <div ref={ref}>
                <Knapp mini kompakt onClick={toggleMenyVisning}>
                  <FormattedMessage id="MenySakIndex.Behandlingsmeny" />
                  <span style={{ marginLeft: '5px' }}>
                    <Image src={visMenySomApen ? openImage : closedImage} />
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
