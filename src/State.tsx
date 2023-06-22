import React, { createContext, useReducer } from 'react';

interface InitialAppState {
  title: string;
  settings: object;
  changedSetting: { settingName: string, value: any };
  reloadStudents: boolean;
  students: any[];
  controls: any[];
  documents: any[];
  users: any[];
}

const initialState: InitialAppState = {
  title: '',
  settings: {},
  changedSetting: { settingName: '', value: '' },
  reloadStudents: false,
  students: [],
  controls: [],
  documents: [],
  users: []
};

const AppContext = createContext(initialState as any);

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'clean': {
      return { ...initialState };
    }
    case 'setTitle':
      return { ...state, title: action.title };

    case 'setSettings':
      return { ...state, settings: action.settings };

    case 'setChangedSetting':
      return { ...state, changedSetting: action.changedSetting };

    case 'setStudents':
      return { ...state, students: action.students };

    case 'setReloadStudents':
      return { ...state, reloadStudents: action.reloadStudents };

    case 'setDocuments':
      return { ...state, documents: action.documents };

    case 'setUsers':
      return { ...state, users: action.users };
    
    case 'setControls':
      return { ...state, controls: action.controls };
  }

  return state;
};

function AppContextProvider(props: any) {
  const fullInitialState = {
    ...initialState
  };

  const [state, dispatch] = useReducer(reducer, fullInitialState);
  const value = { state, dispatch };

  return (
    <AppContext.Provider value={[state, dispatch]}>{props.children}</AppContext.Provider>
  );
}

const AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };
