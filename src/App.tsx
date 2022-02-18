import { mergeStyleSets, Separator, Stack } from "@fluentui/react";
import React from "react";

import { getAllEdia, getAllElementsFromEdium } from "./api/actions";
import { IEdium, IElement } from "./api/types";
import { EdiaList } from "./components/EdiaList";
import { EdiumCreator } from "./components/EdiumCreator";
import { ElementsDisplay } from "./components/ElementsDisplay";


export const App: React.FC = () => {
  const [allEdia, setAllEdia] = React.useState<IEdium[]>([]);
  const [isLoadingEdia, setIsLoadingEdia] = React.useState(true);
  const [selectedEdiumId, setSelectedEdiumId] = React.useState<number>(); // Undefined if nothing is selected

  const [allElements, setAllElements] = React.useState<IElement[]>([]);

  function fetchEdia() {
    setIsLoadingEdia(true);
    getAllEdia().then(
      edia => {
        setIsLoadingEdia(false);
        setAllEdia(edia);
      },
      err => {
        setIsLoadingEdia(false);
      },
    );
  }

  const fetchElements: () => void = React.useCallback(() => {
    if (selectedEdiumId === undefined) {
      setAllElements([]);
      return;
    }
    getAllElementsFromEdium(selectedEdiumId).then(
      elements => {
        setAllElements(elements);
      },
      err => undefined,
    );
  }, [selectedEdiumId]);

  React.useEffect(() => {
    fetchEdia();
  }, []);

  // Fetch the elements of the selected edium
  React.useEffect(() => {
    fetchElements();
  }, [fetchElements, selectedEdiumId]);

  return (
    <Stack horizontal tokens={{childrenGap: 10}}>
      <Stack className={classes.half}>
        <EdiaList
          edia={allEdia}
          isLoading={isLoadingEdia}
          onRefresh={() => fetchEdia()}
          selectedId={selectedEdiumId}
          onSelect={newId => setSelectedEdiumId(newId)}
        />
      </Stack>
      <Separator vertical />
      <Stack className={classes.remaining}>
        <EdiumCreator onCreate={() => fetchEdia()} />
        <Separator />
        <ElementsDisplay elements={allElements} />
      </Stack>
    </Stack>
  );
};

const classes = mergeStyleSets({
  half: {
    maxWidth: "50%",
  },
  remaining: {
    width: "100%",
  },
});
