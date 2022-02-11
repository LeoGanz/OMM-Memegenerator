import React from 'react';
import 'jest-styled-components';
import {Login} from '../pages/login';
import {render} from '@testing-library/react';


let mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom') as any,
    useNavigate: () => mockedNavigate,
}));

test('Displayed login properly except Submit', () => {
    const {getByText, getAllByText} = render(<Login/>);
    const title = getByText("Log In");
    expect(title).toBeDefined();
    const textInputs = getAllByText("");
    expect(textInputs[0]).toBeDefined();
    expect(textInputs[1]).toBeDefined();
});