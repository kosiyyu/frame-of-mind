import React from 'react';
import * as SQLite from "expo-sqlite";

const Context = React.createContext<SQLite.SQLiteDatabase | unknown>(null);

export default Context;