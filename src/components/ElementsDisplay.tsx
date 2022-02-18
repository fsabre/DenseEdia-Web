import { mergeStyleSets, Stack, Text } from "@fluentui/react";
import React from "react";

import { IElement, ValueType } from "../api/types";


// Associate a border color to a value type
const BORDER_COLORS: Map<ValueType | null, string> = new Map([
  ["none", "#37474F"], // Grey
  ["bool", "#FF3D00"], // Red
  ["int", "#00B0FF"], // Light blue
  ["float", "#00C853"], // Light green
  ["str", "#E040FB"], // Light purple
  ["datetime", "#FDD835"], // Dark yellow
  [null, "lightgrey"],
]);

interface IElementDisplayProps {
  elements: IElement[];
}

export const ElementsDisplay: React.FC<IElementDisplayProps> = (props) => {
  // Return the JSX code for one element
  function renderElement(element: IElement): JSX.Element {
    const version = element.versions.find(v => v.last);
    const borderColor = BORDER_COLORS.get(version?.value_type ?? null);

    return (
      <Stack key={element.id} horizontal className={classes.tile} style={{borderColor: borderColor}}>
        <Text className={classes.nameLabel}>{element.name}</Text>
        {version === undefined
          ? <Text style={{color: "lightgrey"}}>No version yet</Text>
          : (<>
            <Text>{String(version.value_json)}</Text>
            <Text style={{color: "lightgrey"}}>[{version.value_type}]</Text>
          </>)
        }
      </Stack>
    );
  }

  return (
    <Stack className={classes.elementList}>
      <Text variant={"large"}>Elements</Text>
      {props.elements.length === 0 && (
        <Text>No element to show</Text>
      )}
      {props.elements.map(renderElement)}
    </Stack>
  );
};

const classes = mergeStyleSets({
  elementList: {
    gap: 10,
  },
  tile: {
    padding: 10,
    justifyContent: "space-between",
    border: "1px solid lightgrey",
    borderRadius: 5,
    position: "relative",
  },
  nameLabel: {
    padding: "0 4px 0 4px",
    position: "absolute",
    top: -11,
    backgroundColor: "white",
  },
});
