import {
  IButtonStyles,
  IconButton,
  IContextualMenuProps,
  mergeStyleSets,
  Stack,
  Text,
  TextField,
  Toggle
} from "@fluentui/react";
import React from "react";
import { useDispatch } from "react-redux";

import { createOneVersion } from "../api/actions";
import { IElement, IVersionPost, JsonValue, ValueType } from "../api/types";
import { errorSlice } from "../reducers/errorSlice";


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

// Associate a color to a value type
const TYPE_COLORS: Map<ValueType | null, string> = new Map([
  ["none", "#37474F"], // Grey
  ["bool", "#FF3D00"], // Red
  ["int", "#00B0FF"], // Light blue
  ["float", "#00C853"], // Light green
  ["str", "#EA80FC"], // Light purple
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

  // Temporary value for edition
  // JsonValue (null | boolean | number | string) or null if there's no version
  const [tmpValue, setTmpValue] = React.useState<JsonValue>(noVersion ? null : version.value_json);
  // Temporary type for edition
  // ValueType or null if there's no version
  const [tmpType, setTmpType] = React.useState<ValueType | null>(noVersion ? null : version?.value_type);
  const dispatch = useDispatch();

  // Create a new version of the element with the tmpValue
  function onSave(): void {
    if (tmpType === null) {
      console.log("Trying to save when there's no version");
      return;
    }
    const postData: IVersionPost = {value_type: tmpType, value_json: tmpValue};
    createOneVersion(element.id, postData).then(
      data => {
        console.log("Saved with success !");
      },
      err => {
        dispatch(errorSlice.actions.pushError({text: err.message}));
      },
    );
  }

  // Reset the tmpValue to be the props one
  function onReset(): void {
    setTmpValue(noVersion ? null : version.value_json);
    setTmpType(noVersion ? null : version.value_type);
  }

  function onTypeChange(newType: ValueType): void {
    setTmpValue(null);
    setTmpType(newType);
  }

  const typeColor = TYPE_COLORS.get(tmpType);
  const saveButtonMenuProps: IContextualMenuProps = {
    styles: {
      root: {
        border: `1px solid ${typeColor}`,
      }
    },
    items: [
      {
        key: "reset",
        text: "Reset",
        iconProps: {iconName: "RevToggleKey"},
        onClick: onReset,
      },
      {
        key: "changeType",
        text: "Change type",
        iconProps: {iconName: "LocationFill", styles: {root: {color: typeColor}}},
        subMenuProps: {
          styles: {
            root: {
              border: `1px solid ${typeColor}`,
            }
          },
          items: [
            {
              key: "changeTypeToNone",
              text: "To NONE",
              iconProps: {iconName: "LocationFill", styles: {root: {color: TYPE_COLORS.get("none")}}},
              disabled: tmpType === "none",
              onClick: () => onTypeChange("none"),
            },
            {
              key: "changeTypeToBool",
              text: "To BOOL",
              iconProps: {iconName: "LocationFill", styles: {root: {color: TYPE_COLORS.get("bool")}}},
              disabled: tmpType === "bool",
              onClick: () => onTypeChange("bool"),
            },
            {
              key: "changeTypeToInt",
              text: "To INT",
              iconProps: {iconName: "LocationFill", styles: {root: {color: TYPE_COLORS.get("int")}}},
              disabled: tmpType === "int",
              onClick: () => onTypeChange("int"),
            },
            {
              key: "changeTypeToFloat",
              text: "To FLOAT",
              iconProps: {iconName: "LocationFill", styles: {root: {color: TYPE_COLORS.get("float")}}},
              disabled: tmpType === "float",
              onClick: () => onTypeChange("float"),
            },
            {
              key: "changeTypeToStr",
              text: "To STR",
              iconProps: {iconName: "LocationFill", styles: {root: {color: TYPE_COLORS.get("str")}}},
              disabled: tmpType === "str",
              onClick: () => onTypeChange("str"),
            },
            {
              key: "changeTypeToDatetime",
              text: "To DATETIME",
              iconProps: {iconName: "LocationFill", styles: {root: {color: TYPE_COLORS.get("datetime")}}},
              disabled: tmpType === "datetime",
              onClick: () => onTypeChange("datetime"),
            },
          ],
        },
      }
    ]
  };

  // Return the right component to control the current data type
  function getContent(): JSX.Element {
    switch (tmpType) {
      case "none":
        return <Text>{""}</Text>;
      case "bool":
        return (
          <Toggle
            checked={tmpValue === true} // Expect null value
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
            value={String(tmpValue ?? "")} // Expect null value
            onChange={(ev, val) => {
              setTmpValue(val ?? "");
            }}
            borderless
            className={classes.strContent}
          />
        );
      default:
        return <Text>{String(tmpValue ?? "")}</Text>; // Expect null value
    }
  }

  return (
    <Stack className={classes.container} horizontal>
      <Stack className={classes.coloredBar} horizontal style={{borderColor: typeColor}}>
        <Text className={classes.nameLabel}>{element.name}</Text>
        {noVersion && tmpType === null && (
          <Text style={{color: "lightgrey"}}>No version yet</Text>
        )}
        {tmpType !== null && (<>
          {/* Get the right component for the data type */}
          {getContent()}
          {/* Display the type on the right */}
          <Text style={{color: "lightgrey"}}>[{tmpType}]</Text>
        </>)}
      </Stack>
      <IconButton
        iconProps={{iconName: "Save"}}
        primaryDisabled={tmpType === null || tmpValue === version?.value_json}
        onClick={onSave}
        split
        menuProps={saveButtonMenuProps}
        styles={saveButtonStyles}
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

const saveButtonStyles: IButtonStyles = {
  rootDisabled: {
    backgroundColor: "white", // Remove the grey background when the save button is disabled
  },
  iconDisabled: {
    color: "lightgrey",
  },
  splitButtonMenuButton: {
    border: "none",
    backgroundColor: "white",
  },
  splitButtonDivider: {
    backgroundColor: "grey", // Add a grey bar between the save icon and the menu button
  },
};
