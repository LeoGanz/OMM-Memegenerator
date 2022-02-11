import React from 'react';
import 'jest-styled-components';
import {Overview} from '../pages/overview';
import {render} from '@testing-library/react';


let mockedNavigate = jest.fn();
let mockedHref = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom') as any,
    useNavigate: () => mockedNavigate, useHref: () => mockedHref,
}));


test('Displayed overview properly except Submit', () => {
    const {getByText, getAllByText, getByPlaceholderText} = render(<Overview/>);
    const title = getByText("Overview");
    expect(title).toBeDefined();
    const apiDoc = getByText("Go to API documentation");
    expect(apiDoc).toBeDefined();
    const singleGraph = getByText("Show some statistics for single memes");
    expect(singleGraph).toBeDefined();
    const templateGraph = getByText("Show some template statistics");
    expect(templateGraph).toBeDefined();
    const username = getByPlaceholderText("Username");
    expect(username).toBeDefined();
    const asc = getAllByText("Asc");
    expect(asc[0]).toBeDefined();
    expect(asc[1]).toBeDefined();
    const dsc = getAllByText("Dsc");
    expect(dsc[0]).toBeDefined();
    expect(dsc[1]).toBeDefined();
});