import { IconButton, mergeStyleSets, Stack, Text } from "@fluentui/react";
import React from "react";

import { IEdium } from "../api/types";
import { EDIA_TILE_COUNT_IN_ROW } from "../constants";


interface IEdiaListProps {
  edia: IEdium[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

// Display a list of all edia
export const EdiaList: React.FC<IEdiaListProps> = (props) => {
  return (
    <Stack tokens={{childrenGap: 20}} horizontalAlign={"center"}>
      <Stack horizontal verticalAlign={"center"} tokens={{childrenGap: 10}}>
        <Text variant={"large"} className={classes.title}>Edia list</Text>
        <IconButton iconProps={{iconName: "Refresh"}} disabled={props.isLoading} onClick={props.onRefresh} />
      </Stack>
      <Stack className={classes.container}>
        {props.edia.map(edium => (
          <Stack key={edium.id} className={classes.tile}>
            <Text className={classes.idText}>{edium.id}</Text>
            <Text className={classes.titleText}>{edium.title}</Text>
            <Text className={classes.kindText}>{edium.kind}</Text>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
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
    padding: "10px 10px 0 10px",
    rowGap: 10,
    justifyContent: "space-between",
    border: "solid 5px lightgrey",
    borderRadius: 15,
    position: "relative", // Needed for the absolute position below
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
