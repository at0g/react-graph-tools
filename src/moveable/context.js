import { createContext } from 'react';
import {initialValue } from "./reducer";

const context = createContext(initialValue);

export default context;
