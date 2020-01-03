export const initialValue = { isDown: false, position: { x: 0, y: 0 }, offset: {x: 0, y: 0} };

export default function reducer(state, action) {
    switch (action.type) {
        case 'mouseup': {
            return { ...state, isDown: false };
        }

        case 'mousedown': {
            return {
                ...state,
                isDown: true,
                offset: action.payload
            }
        }

        case 'mousemove': {
            return {
                ...state,
                position: action.payload
            }
        }


        default: {
            return state
        }
    }
}
