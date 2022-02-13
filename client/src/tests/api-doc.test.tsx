import React from 'react';
import 'jest-styled-components';
import {APIDoc} from '../pages/api-doc';
import {render} from '@testing-library/react';
import {BrowserRouter} from "react-router-dom";

let mockedNavigate = jest.fn();
let mockedHref = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom') as any,
    useNavigate: () => mockedHref, useHref: () => mockedNavigate,
}));

test('Displayed login properly except Submit', () => {
    const {getByText} = render(<BrowserRouter><APIDoc/></BrowserRouter>);
    const title = getByText("Documentation - API");
    expect(title).toBeDefined();
    const backButton = getByText("Back to Overview Page");
    expect(backButton).toBeDefined();
});