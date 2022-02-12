import { Separator, Stack } from "@fluentui/react";
import { initializeIcons } from '@fluentui/react/lib/Icons';
import React from 'react';
import ReactDOM from 'react-dom';

import { EdiaList } from "./components/EdiaList";
import { EdiumCreator } from "./components/EdiumCreator";


initializeIcons();

ReactDOM.render(
  <React.StrictMode>
    <Stack tokens={{childrenGap: 10}}>
      <EdiaList />
      <Separator />
      <EdiumCreator />
    </Stack>
  </React.StrictMode>,
  document.getElementById('root')
);
