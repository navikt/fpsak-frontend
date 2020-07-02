import React, {
  FunctionComponent, useState, useMemo, useCallback, useEffect, useRef,
} from 'react';
import BoxedListWithLinks from '@navikt/boxed-list-with-links';
import Header from '@navikt/nap-header';
import Popover from '@navikt/nap-popover';
import SystemButton from '@navikt/nap-system-button';
import UserPanel from '@navikt/nap-user-panel';

import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import ErrorMessagePanel from './ErrorMessagePanel';

import messages from '../i18n/nb_NO.json';

import styles from './headerWithErrorPanel.less';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const useOutsideClickEvent = (erLenkepanelApent, setLenkePanelApent) => {
  const wrapperRef = useRef(null);
  const handleClickOutside = useCallback((event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setLenkePanelApent(false);
    }
  }, [wrapperRef.current]);

  useEffect(() => {
    if (erLenkepanelApent) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [erLenkepanelApent]);

  return wrapperRef;
};

interface OwnProps {
  iconLinks: {
    text: string;
    url: string;
  }[];
  systemTittel: string;
  queryStrings: any;
  navAnsattName: string;
  removeErrorMessage: () => void;
  showDetailedErrorMessages?: boolean;
  errorMessages?: any[];
  setSiteHeight: (height: number) => void;
}

/**
 * HeaderWithErrorPanel
 *
 * Presentasjonskomponent. Definerer header-linjen som alltid vises øverst nettleservinduet.
 * Denne viser lenke tilbake til hovedsiden, nettside-navnet, NAV-ansatt navn og lenke til rettskildene og systemrutinen.
 * I tillegg vil den vise potensielle feilmeldinger i ErrorMessagePanel.
 */
const HeaderWithErrorPanel: FunctionComponent<OwnProps> = ({
  iconLinks,
  systemTittel,
  navAnsattName,
  removeErrorMessage,
  queryStrings,
  showDetailedErrorMessages = false,
  errorMessages = [],
  setSiteHeight,
}) => {
  const [erLenkepanelApent, setLenkePanelApent] = useState(false);
  const wrapperRef = useOutsideClickEvent(erLenkepanelApent, setLenkePanelApent);

  const fixedHeaderRef = useRef<any>();
  useEffect(() => {
    setSiteHeight(fixedHeaderRef.current.clientHeight);
  }, [errorMessages.length]);

  const lenkerFormatertForBoxedList = useMemo(() => iconLinks.map((link) => ({
    name: link.text,
    href: link.url,
    isExternal: true,
  })), []);
  const popperPropsChildren = useCallback(() => (
    <BoxedListWithLinks
      items={lenkerFormatertForBoxedList}
      onClick={() => {
        setLenkePanelApent(false);
      }}
    />
  ), []);
  const referencePropsChildren = useCallback(({ ref }) => (
    <div ref={ref}>
      <SystemButton
        onClick={() => {
          setLenkePanelApent(!erLenkepanelApent);
        }}
        isToggled={erLenkepanelApent}
      />
    </div>
  ), [erLenkepanelApent]);

  return (
    <header ref={fixedHeaderRef} className={styles.container}>
      <RawIntlProvider value={intl}>
        <div ref={wrapperRef}>
          <Header title={systemTittel} titleHref="/fpsak">
            <Popover
              popperIsVisible={erLenkepanelApent}
              renderArrowElement
              customPopperStyles={{ top: '11px', zIndex: 1 }}
              popperProps={{
                children: popperPropsChildren,
                placement: 'bottom-start',
                positionFixed: true,
              }}
              referenceProps={{
                children: referencePropsChildren,
              }}
            />
            <UserPanel name={navAnsattName} />
          </Header>
        </div>
        <ErrorMessagePanel
          queryStrings={queryStrings}
          removeErrorMessage={removeErrorMessage}
          showDetailedErrorMessages={showDetailedErrorMessages}
          errorMessages={errorMessages}
        />
      </RawIntlProvider>
    </header>
  );
};

export default HeaderWithErrorPanel;
