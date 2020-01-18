import React from 'react';
import renderer from 'react-test-renderer';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import Loot from './index';

configure({ adapter: new Adapter() });

describe('Test Loot component', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<Loot />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('has a working onClick', () => {
        const mockCallBack = jest.fn();
        const loot = mount(<Loot setSelected={mockCallBack} />);
        loot.find('.loot-icon').simulate('click');
        expect(mockCallBack.mock.calls.length).toEqual(1);
    });
});