import React from 'react';
import 'jest-styled-components';
import {SingleGraph} from '../pages/single-graph';
import {render} from '@testing-library/react';

let mockedNavigate = jest.fn();
let mockedHref = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom') as any,
    useNavigate: () => mockedNavigate, useHref: () => mockedHref,
}));

test('Displayed login properly except Submit', () => {
    const {getByText} = render(<SingleGraph/>);
    const title = getByText("Up- and DownVotes of Memes");
    expect(title).toBeDefined();
    const backButton = getByText("Back to Overview Page");
    expect(backButton).toBeDefined();
});