import { mergeStyleSets, Stack, Text } from "@fluentui/react";
import React from "react";

import { IElement, ValueType } from "../api/types";


interface IElementDisplayProps {
  elements: IElement[];
}

export const ElementsDisplay: React.FC<IElementDisplayProps> = (props) => {
  return (
    <Stack className={classes.elementList}>
      <Text variant={"large"}>Elements</Text>
      {props.elements.length === 0 && (
        <Text>No element to show</Text>
      )}
      {props.elements.map(element => (
        <SingleElement element={element} />
      ))}
    </Stack>
  );
};

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

interface ISingleElementProps {
  element: IElement;
}

const SingleElement: React.FC<ISingleElementProps> = (props) => {
  const element = props.element;
  const version = element.versions.find(v => v.last);
  const noVersion = version === undefined;

  const borderColor = BORDER_COLORS.get(version?.value_type ?? null);

  return (
    <Stack key={element.id} className={classes.coloredBar} horizontal style={{borderColor: borderColor}}>
      <Text className={classes.nameLabel}>{element.name}</Text>
      {noVersion && (
        <Text style={{color: "lightgrey"}}>No version yet</Text>
      )}
      {!noVersion && (<>
        <Text>{String(version.value_json)}</Text>
        <Text style={{color: "lightgrey"}}>[{version.value_type}]</Text>
      </>)}
    </Stack>
  );
};

const classes = mergeStyleSets({
  elementList: {
    gap: 10,
  },
  coloredBar: {
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
