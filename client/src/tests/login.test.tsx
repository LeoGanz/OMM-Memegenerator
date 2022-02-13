import React from 'react';
import 'jest-styled-components';
import {Login} from '../pages/login';
import {render} from '@testing-library/react';
import {BrowserRouter} from "react-router-dom";

test('Displayed login properly except Submit', () => {
    const {getByText, getAllByText} = render(<BrowserRouter><Login/></BrowserRouter>);
    const title = getByText("Log In");
    expect(title).toBeDefined();
    const textInputs = getAllByText("");
    expect(textInputs[0]).toBeDefined();
    expect(textInputs[1]).toBeDefined();
});