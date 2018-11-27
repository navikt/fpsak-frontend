const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
import configure from '@commercetools/enzyme-extensions';
import ShallowWrapper from 'enzyme/ShallowWrapper';

enzyme.configure({ adapter: new Adapter() });

configure(ShallowWrapper);
