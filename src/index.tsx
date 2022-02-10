import { Text } from "@fluentui/react";
import { initializeIcons } from '@fluentui/react/lib/Icons';
import React from 'react';
import ReactDOM from 'react-dom';

import { EdiaList } from "./components/EdiaList";


initializeIcons();

ReactDOM.render(
  <React.StrictMode>
    <Text variant={"large"}>DenseEdia Web</Text>
    <EdiaList />
  </React.StrictMode>,
  document.getElementById('root')
);
