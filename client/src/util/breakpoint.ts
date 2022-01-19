interface Breakpoints {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
}

const breakpoints: Breakpoints = {
    xs: '0px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1920px',
}

//Helper functions to achieve responsive behavior
export const up = (breakpoint: keyof Breakpoints): string => `
    @media (min-width: ${breakpoints[breakpoint]})
  `;

export const down = (breakpoint: keyof Breakpoints): string => `
    @media (max-width: ${breakpoints[breakpoint]})
  `;
