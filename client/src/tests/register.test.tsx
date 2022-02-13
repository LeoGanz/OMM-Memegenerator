import React from 'react';
import 'jest-styled-components';
import {SignUp} from '../pages/sign-up';
import {render} from '@testing-library/react';
import {BrowserRouter} from "react-router-dom";

test('Displayed register properly except Submit', () => {
    const {getByText, getAllByText} = render(<BrowserRouter><SignUp/></BrowserRouter>);
    const title = getByText("Sign Up");
    expect(title).toBeDefined();
    const textInputs = getAllByText("");
    expect(textInputs[0]).toBeDefined();
    expect(textInputs[1]).toBeDefined();
    expect(textInputs[2]).toBeDefined();
    expect(textInputs[3]).toBeDefined();
});