import React from 'react';
import 'jest-styled-components';
import {MemeDetails} from "../pages/meme-details";
import {render} from '@testing-library/react';
import {BrowserRouter} from "react-router-dom";

test('Displayed overview properly except Submit', () => {
    const {getByText} = render(
        <BrowserRouter><MemeDetails/></BrowserRouter>);
    const right = getByText(">");
    expect(right).toBeDefined();
    const left = getByText(">");
    expect(left).toBeDefined();
    const copyId = getByText("CopyMemeId");
    expect(copyId).toBeDefined();
    const share = getByText("Share");
    expect(share).toBeDefined();
    const download = getByText("Download");
    expect(download).toBeDefined();
    const random = getByText("Go to random Image");
    expect(random).toBeDefined();
});