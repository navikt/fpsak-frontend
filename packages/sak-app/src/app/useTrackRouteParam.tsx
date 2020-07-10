import { useState, useEffect, useRef } from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';

import { parseQueryString } from '@fpsak-frontend/utils';

const defaultConfig = {
  paramName: '',
  parse: (a) => a,
  isQueryParam: false,
  paramsAreEqual: (paramFromUrl, paramFromStore) => paramFromUrl === paramFromStore,
};

interface Config {
  paramName?: string,
  parse?: (a: any) => any,
  isQueryParam?: boolean,
  paramsAreEqual?: (paramFromUrl: string, paramFromStore: string) => boolean,
}

const mapMatchToParam = (match, location, trackingConfig) => {
  const params = trackingConfig.isQueryParam ? parseQueryString(location.search) : match.params;
  return trackingConfig.parse(params[trackingConfig.paramName]);
};

function useTrackRouteParam(config: Config) {
  const [selected, setSelected] = useState<string>();

  const trackingConfig = { ...defaultConfig, ...config };

  const location = useLocation();
  const match = useRouteMatch();

  const paramFromUrl = mapMatchToParam(match, location, trackingConfig);
  const { paramsAreEqual } = trackingConfig;

  const ref = useRef();

  useEffect(() => {
    if (ref.current && !paramsAreEqual(paramFromUrl, ref.current)) {
      setSelected(paramFromUrl);
    } else if (!paramsAreEqual(paramFromUrl, undefined)) {
      setSelected(paramFromUrl);
    }

    ref.current = paramFromUrl;
    return () => {
      setSelected(undefined);
    };
  }, [paramFromUrl]);

  return {
    location,
    selected,
  };
}

export default useTrackRouteParam;
