import {useEffect, useState} from "react";

export function getWindowDimensions() {
    const {innerWidth: width, innerHeight: height} = window;
    return {
        width,
        height
    };
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


export function getWidth() {
    const {height, width} = useWindowDimensions();
    return width * (1 - 150 / 1920);
}

export function getHeight() {
    const {height, width} = useWindowDimensions();
    return height * (1 - 200 / 1080)
}

export function getRightMargin() {
    const {height, width} = useWindowDimensions();
    return width * 100 / 1920;
}

export function getTopMargin() {
    const {height, width} = useWindowDimensions();
    return height * 150 / 1080;
}

export function getBottomMargin() {
    const {height, width} = useWindowDimensions();
    return height * 10 / 1080;
}