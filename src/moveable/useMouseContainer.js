import {useEffect, useMemo, useReducer, useState} from "react";
import reducer, { initialValue } from "./reducer";


export default function useMouseContainer() {
    const [ref, setRef] = useState(null);
    const [state, dispatch] = useReducer(reducer, initialValue);

    const listen = useMemo(() => () => {
        if (ref) {
            const onMouseMove = (evt) => {
                dispatch({ type: 'mousemove', payload: { x: evt.clientX, y: evt.clientY } });
            };
            const onMouseUp = () => {
                ref.removeEventListener('mousemove', onMouseMove);
                ref.removeEventListener('mouseup', onMouseUp);
                dispatch({ type: 'mouseup' });
            };
            const onMouseDown = (evt) => {
                ref.addEventListener('mouseup', onMouseUp);
                ref.addEventListener('mousemove', onMouseMove);
                dispatch({ type: 'mousedown', payload: { x: evt.clientX, y: evt.clientY } });
            };
            ref.addEventListener('mousedown', onMouseDown);

            return function unlisten() {
                ref.removeEventListener('mousedown', onMouseDown);
                ref.removeEventListener('mousemove', onMouseMove);
                ref.removeEventListener('mouseup', onMouseUp);
            }
        }

    }, [ref, dispatch]);

    useEffect(() => {
        return listen()
    }, [listen]);

    return [setRef, state];
}
