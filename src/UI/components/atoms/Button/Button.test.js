import React from 'react';
import renderer from 'react-test-renderer';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import Button from './index';

configure({ adapter: new Adapter() });

describe('Test Button component', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<Button text="Button Title" />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('has a working onClick', () => {
        const mockCallBack = jest.fn();
        const button = mount(<Button text="Button with onClick" onClick={mockCallBack} />);
        button.find('button').simulate('click');
        expect(mockCallBack.mock.calls.length).toEqual(1);
    });
});