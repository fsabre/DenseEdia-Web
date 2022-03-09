import { mergeStyleSets, Separator, Stack } from "@fluentui/react";
import React from "react";

import { getAllEdia, getAllElementsFromEdium } from "./api/actions";
import { IEdium, IElement } from "./api/types";
import { EdiaList } from "./components/EdiaList";
import { EdiumInfo } from "./components/EdiumInfo";
import { ElementsDisplay } from "./components/ElementsDisplay";
import { ErrorBar } from "./components/ErrorBar";


export const App: React.FC = () => {
  const [allEdia, setAllEdia] = React.useState<IEdium[]>([]);
  const [isLoadingEdia, setIsLoadingEdia] = React.useState(true);
  const [selectedEdiumId, setSelectedEdiumId] = React.useState<number>(); // Undefined if nothing is selected
  const [selectedEdium, setSelectedEdium] = React.useState<IEdium>(); // Undefined if nothing is selected

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

  // Fetch the data and elements of the selected edium
  React.useEffect(() => {
    // Find the selected edium in all the stored edia
    const edium = allEdia.find(edium => edium.id === selectedEdiumId);
    if (edium === undefined) {
      // If it's not found, reset the selected ID
      setSelectedEdiumId(undefined);
    }
    setSelectedEdium(edium);
    fetchElements();
  }, [fetchElements, selectedEdiumId, allEdia]);

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
        <EdiumInfo edium={selectedEdium} onRefresh={() => fetchEdia()} />
        <Separator />
        {(selectedEdiumId !== undefined) && (
          <ElementsDisplay
            ediumId={selectedEdiumId}
            elements={allElements}
            onRefresh={() => fetchElements()}
          />
        )}
      </Stack>
      <ErrorBar />
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
