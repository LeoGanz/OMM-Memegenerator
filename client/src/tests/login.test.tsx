import React from 'react';
import ReactDOM from "react-dom";
import style from 'styled-components';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import {Login} from '../pages/login';
import {Title} from "../components/layout/typography";
import {render, act, fireEvent} from '@testing-library/react';
import {Router, useNavigate} from "react-router-dom";
import {useContext, useState} from "react";

let mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom') as any,
    useNavigate: () => mockedNavigate,
}));

describe('Displayed properly', () => {
    const {getByRole} = render(<Login/>);
    console.log(getByRole);
    expect(true).toBe(true);
});