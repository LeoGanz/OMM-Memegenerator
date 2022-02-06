import {useEffect, useState} from "react";

export function getWindowDimensions() {
    const {innerWidth: width, innerHeight: height} = window;
    return {
        width,
        height
    };
}

export interface SingleData {
    name: string,
    down: number,
    up: number,
}

export interface TemplateData {
    name: string,
    usage: number,
}


export function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}


export function useWidth() {
    const {height, width} = useWindowDimensions();
    return width * (1 - 150 / 1920);
}

export function useHeight() {
    const {height, width} = useWindowDimensions();
    return height * (1 - 250 / 1080)
}

export function useRightMargin() {
    const {height, width} = useWindowDimensions();
    return width * 100 / 1920;
}

export function useTopMargin() {
    const {height, width} = useWindowDimensions();
    return height * 0 / 1080;
}

export function useBottomMargin() {
    const {height, width} = useWindowDimensions();
    return height * 250 / 1080;
}

export function useLeftMargin() {
    const {height, width} = useWindowDimensions();
    return width * 0 / 1920;
}

export function useLegendBottomMargin() {
    const {height, width} = useWindowDimensions();
    return height * 36 / 1080;
}

export function useLegendTopMargin() {
    const {height, width} = useWindowDimensions();
    return height * 0 / 1080;
}

export function useLegendLeftMargin() {
    const {height, width} = useWindowDimensions();
    return width * 0 / 1920;
}

export function useLegendRightMargin() {
    const {height, width} = useWindowDimensions();
    return width * 0 / 1920;
}