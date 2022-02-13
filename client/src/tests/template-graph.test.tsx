import React from 'react';
import 'jest-styled-components';
import {TemplateGraph} from '../pages/template-graph';
import {render} from '@testing-library/react';
import {BrowserRouter} from "react-router-dom";

test('Displayed login properly except Submit', () => {
    const {getByText} = render(<BrowserRouter><TemplateGraph/></BrowserRouter>);
    const title = getByText("Usages of Templates");
    expect(title).toBeDefined();
    const backButton = getByText("Back to Overview Page");
    expect(backButton).toBeDefined();
});