import { configure as configureEnzyme } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configure from '@commercetools/enzyme-extensions';
import ShallowWrapper from 'enzyme/ShallowWrapper';
import { switchOnTestMode } from '@fpsak-frontend/rest-api-new';

configureEnzyme({ adapter: new Adapter() });

configure(ShallowWrapper);

switchOnTestMode();
