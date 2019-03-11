import { configure as configureEnzyme } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configure from '@commercetools/enzyme-extensions';
import ShallowWrapper from 'enzyme/ShallowWrapper';

configureEnzyme({ adapter: new Adapter() });

configure(ShallowWrapper);
