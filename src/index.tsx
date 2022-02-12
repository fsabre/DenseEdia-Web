import { Text } from "@fluentui/react";
import { initializeIcons } from '@fluentui/react/lib/Icons';
import React from 'react';
import ReactDOM from 'react-dom';

import { EdiaList } from "./components/EdiaList";
import { EdiumCreator } from "./components/EdiumCreator";


initializeIcons();

ReactDOM.render(
  <React.StrictMode>
    <Text variant={"large"}>DenseEdia Web</Text>
    <EdiaList />
    <EdiumCreator />
  </React.StrictMode>,
  document.getElementById('root')
);
