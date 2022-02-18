import { IconButton, mergeStyleSets, Stack, Text, TextField, Toggle } from "@fluentui/react";
import React from "react";

import { createOneVersion } from "../api/actions";
import { IElement, IVersion, IVersionPost, JsonValue, ValueType } from "../api/types";


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
        <SingleElement key={element.id} element={element} />
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

  const [tmpValue, setTmpValue] = React.useState<JsonValue>(version?.value_json ?? null);

  const borderColor = BORDER_COLORS.get(version?.value_type ?? null);

  function onSave(): void {
    if (noVersion) {
      console.log("Trying to save when there's no version");
      return;
    }
    const postData: IVersionPost = {value_type: version.value_type, value_json: tmpValue};
    createOneVersion(element.id, postData).then(
      data => {
        console.log("Saved with success !");
      },
      err => {
        console.log("Error when saving");
      },
    );
  }

  // Return the right component to control the current data type
  function getContent(ver: IVersion): JSX.Element {
    switch (ver.value_type) {
      case "none":
        return <></>;
      case "bool":
        return (
          <Toggle
            checked={Boolean(tmpValue)}
            onText={"True"}
            offText={"False"}
            onChange={(ev, val) => {
              setTmpValue(val ?? false);
            }}
            className={classes.boolContent}
          />
        );
      case "str":
        return (
          <TextField
            value={String(tmpValue)}
            onChange={(ev, val) => {
              setTmpValue(val ?? "");
            }}
            borderless
            className={classes.strContent}
          />
        );
      default:
        return <Text>{String(ver.value_json)}</Text>;
    }
  }

  return (
    <Stack className={classes.container} horizontal>
      <Stack className={classes.coloredBar} horizontal style={{borderColor: borderColor}}>
        <Text className={classes.nameLabel}>{element.name}</Text>
        {noVersion && (
          <Text style={{color: "lightgrey"}}>No version yet</Text>
        )}
        {!noVersion && (<>
          {/* Get the right component for the data type */}
          {getContent(version)}
          <Text style={{color: "lightgrey"}}>[{version.value_type}]</Text>
        </>)}
      </Stack>
      <IconButton
        iconProps={{iconName: "Save"}}
        disabled={tmpValue === version?.value_json}
        onClick={onSave}
      />
    </Stack>
  );
};

const classes = mergeStyleSets({
  elementList: {
    gap: 10,
  },
  container: {
    alignItems: "center",
    gap: 5,
  },
  coloredBar: {
    width: "100%",
    padding: 10,
    justifyContent: "space-between",
    border: "1px solid lightgrey", // The color will be overridden
    borderRadius: 5,
    position: "relative",
  },
  nameLabel: {
    padding: "0 4px 0 4px",
    position: "absolute",
    top: -11,
    backgroundColor: "white",
  },
  boolContent: {
    marginBottom: 0,
  },
  strContent: {
    width: "100%",
  },
});
