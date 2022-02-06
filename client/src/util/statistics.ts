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
    return height * (1 - 200 / 1080)
}

export function useRightMargin() {
    const {height, width} = useWindowDimensions();
    return width * 100 / 1920;
}

export function useTopMargin() {
    const {height, width} = useWindowDimensions();
    return height * 70 / 1080;
}

export function useBottomMargin() {
    const {height, width} = useWindowDimensions();
    return height * 10 / 1080;
}

export function useLeftMargin() {
    const {height, width} = useWindowDimensions();
    return width * 0 / 1920;
}