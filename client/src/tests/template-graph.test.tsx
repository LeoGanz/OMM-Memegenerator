import React from 'react';
import 'jest-styled-components';
import {TemplateGraph} from '../pages/template-graph';
import {render} from '@testing-library/react';

let mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom') as any,
    useNavigate: () => mockedNavigate,
}));

test('Displayed login properly except Submit', () => {
    const {getByText} = render(<TemplateGraph/>);
    const title = getByText("Usages of Templates");
    expect(title).toBeDefined();
    const backButton = getByText("Back to Overview Page");
    expect(backButton).toBeDefined();
});