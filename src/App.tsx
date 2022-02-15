import { mergeStyleSets, Separator, Stack } from "@fluentui/react";
import React from "react";

import { getAllEdia } from "./api/actions";
import { IEdium } from "./api/types";
import { EdiaList } from "./components/EdiaList";
import { EdiumCreator } from "./components/EdiumCreator";


export const App: React.FC = () => {
  const [allEdia, setAllEdia] = React.useState<IEdium[]>([]);

  function fetchEdia() {
    getAllEdia().then(
      edia => {
        setAllEdia(edia);
      },
      err => undefined,
    );
  }

  React.useEffect(() => {
    fetchEdia();
  }, []);

  return (
    <Stack horizontal tokens={{childrenGap: 10}}>
      <Stack className={classes.half}>
        <EdiaList edia={allEdia} />
      </Stack>
      <Separator vertical />
      <Stack className={classes.half}>
        <EdiumCreator onCreate={() => fetchEdia()} />
      </Stack>
    </Stack>
  );
};

const classes = mergeStyleSets({
  half: {
    maxWidth: "50%",
  },
});