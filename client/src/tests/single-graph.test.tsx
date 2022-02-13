import React from 'react';
import 'jest-styled-components';
import {SingleGraph} from '../pages/single-graph';
import {render} from '@testing-library/react';
import {BrowserRouter} from "react-router-dom";

test('Displayed login properly except Submit', () => {
    const {getByText} = render(<BrowserRouter><SingleGraph/></BrowserRouter>);
    const title = getByText("Up- and DownVotes of Memes");
    expect(title).toBeDefined();
    const backButton = getByText("Back to Overview Page");
    expect(backButton).toBeDefined();
});