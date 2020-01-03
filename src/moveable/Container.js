import React from "react";
import useMouseContainer from "./useMouseContainer";
import context from "./context";

export default function MoveableContainer (props) {
    const { children, ...spread } = props;
    const [setRef, state] = useMouseContainer();
    return (
        <context.Provider value={state}>
            <section {...spread} ref={setRef}>
                {children}
            </section>
        </context.Provider>
    )
}
