import { IconButton, mergeStyleSets, Stack, Text } from "@fluentui/react";
import React from "react";

import { IEdium } from "../api/types";
import { EDIA_TILE_COUNT_IN_ROW } from "../constants";


interface IEdiaListProps {
  edia: IEdium[];
  isLoading?: boolean;
  onRefresh?: () => void;
  selectedId?: number;
  onSelect?: (newId?: number) => void;
}

// Display a list of all edia
export const EdiaList: React.FC<IEdiaListProps> = (props) => {
  // Called when a tile is clicked
  function onTileClicked(event: React.SyntheticEvent, ediumId: number): void {
    event.stopPropagation(); // We don't want the tile container to capture the event
    if (props.onSelect !== undefined) {
      props.onSelect(ediumId);
    }
  }

  // Called when the blank space between tiles is clicked
  function onContainerClicked(event: React.SyntheticEvent) {
    if (props.onSelect !== undefined) {
      props.onSelect(undefined);
    }
  }

  return (
    <Stack tokens={{childrenGap: 20}} horizontalAlign={"center"}>
      <Stack horizontal verticalAlign={"center"} tokens={{childrenGap: 10}}>
        <Text variant={"large"} className={classes.title}>Edia list</Text>
        <IconButton iconProps={{iconName: "Refresh"}} disabled={props.isLoading} onClick={props.onRefresh} />
      </Stack>
      <Stack className={classes.container} onClick={onContainerClicked}>
        {props.edia.map(edium => (
          <Stack
            key={edium.id}
            className={props.selectedId === edium.id ? classes.selectedTile : classes.tile}
            onClick={(ev) => onTileClicked(ev, edium.id)}
          >
            <Text className={classes.idText}>{edium.id}</Text>
            <Text className={classes.titleText}>{edium.title}</Text>
            <Text className={classes.kindText}>{edium.kind}</Text>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

const tileStyle = {
  padding: "10px 10px 0 10px",
  rowGap: 10,
  justifyContent: "space-between",
  border: "solid 5px lightgrey",
  borderRadius: 15,
  boxShadow: "4px 4px 5px #EEE",
  position: "relative", // Needed for the absolute position of the idText
};

const classes = mergeStyleSets({
  title: {
    textAlign: "center",
  },
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(${EDIA_TILE_COUNT_IN_ROW}, 1fr)`,
    gap: 20,
  },
  tile: {
    ...tileStyle
  },
  selectedTile: {
    ...tileStyle,
    borderColor: "#0078d4",
    boxShadow: "0px 0px 10px #0078d4",
  },
  idText: {
    position: "absolute",
    top: 0,
    right: 4,
    color: "lightgrey",
  },
  titleText: {
    textAlign: "center",
  },
  kindText: {
    textAlign: "center",
    fontStyle: "italic",
    color: "grey",
  },
});
