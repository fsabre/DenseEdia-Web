import { IContextualMenuProps, mergeStyleSets, Stack, Text, TextField, Toggle } from "@fluentui/react";
import React from "react";

import { JsonValue, ValueType } from "../api/types";
import { SaveSplitButton } from "./SaveSplitButton";

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

const INT_REGEX = new RegExp("^-?[0-9]+$");
const FLOAT_REGEX = new RegExp("^-?[0-9]+(\\.[0-9]+)?$");

interface ISingleElementProps {
  elementName: string;
  // The initial version type. Use null if there's no existing version.
  initialValueType: ValueType | null;
  // The initial version value. Use null if there's no existing version.
  initialValueJson: JsonValue;
  onSave: (valueType: ValueType, valueJson: JsonValue) => void;
  onDelete: () => void;
}

// Component to edit a real element or a temporary element.
export const SingleElement: React.FC<ISingleElementProps> = (props) => {
  const noVersion = props.initialValueType === null;

  // Temporary type for edition. ValueType or null if there's no version.
  const [tmpType, setTmpType] = React.useState<ValueType | null>(props.initialValueType);
  // Temporary value for edition. JsonValue (null | boolean | number | string) or null if there's no version.
  const [tmpValue, setTmpValue] = React.useState<JsonValue>(props.initialValueJson);
  const [rawNumberValue, setRawNumberValue] = React.useState(String(props.initialValueJson));

  // Send the tmpType and the tmpValue to create the version
  function onSave(): void {
    if (tmpType === null) {
      console.log("Trying to save when there's no version");
      return;
    }
    props.onSave(tmpType, tmpValue);
  }

  // Reset the tmpType and the tmpValue to their initial state
  function onReset(): void {
    setTmpType(props.initialValueType);
    setTmpValue(props.initialValueJson);
    setRawNumberValue(String(props.initialValueJson));
  }

  // Change the tmpType and reset the tmpValue
  function onTypeChange(newType: ValueType): void {
    setTmpType(newType);
    // For some reason, I can't do it properly with a Map<ValueType, JsonValue>.
    if (newType === "bool") {
      setTmpValue(false);
    } else if (newType === "int" || newType === "float") {
      setTmpValue(0);
      setRawNumberValue("0");
    } else if (newType === "str" || newType === "datetime") {
      setTmpValue("");
    } else {
      setTmpValue(null);
    }
  }

  function onDelete(): void {
    props.onDelete();
  }

  // Return true if the value is valid
  function isValid(): boolean {
    if (tmpType === null) {
      return false;
    }
    // The trick here is super useful.
    // It checks that the raw is well formatted and is not too big.
    // But it's also not consistent, it needs to be changed.
    if (tmpType === "int" && rawNumberValue !== String(tmpValue)) {
      return false;
    }
    if (tmpType === "float" && rawNumberValue !== String(tmpValue)) {
      return false;
    }
    return true;
  }

  // Return true if neither the type nor the value have changed, or if the value is not valid
  function isSaveButtonDisabled(): boolean {
    return (tmpType === props.initialValueType && tmpValue === props.initialValueJson) || !isValid();
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
      },
      {
        key: "delete",
        text: "Delete",
        iconProps: {iconName: "Delete"},
        onClick: onDelete,
      },
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
      case "int":
        return (
          <TextField
            value={rawNumberValue}
            onChange={(ev, val) => {
              setRawNumberValue(val ?? "");
              if (INT_REGEX.test(val ?? "")) {
                setTmpValue(Number(val ?? ""));
              }
            }}
            borderless
            className={classes.strContent}
          />
        );
      case "float":
        return (
          <TextField
            value={rawNumberValue}
            onChange={(ev, val) => {
              setRawNumberValue(val ?? "");
              if (FLOAT_REGEX.test(val ?? "")) {
                setTmpValue(Number(val ?? ""));
              }
            }}
            borderless
            className={classes.strContent}
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
        <Text className={classes.nameLabel}>{props.elementName}</Text>
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
      <SaveSplitButton
        primaryDisabled={isSaveButtonDisabled()}
        onSave={onSave}
        menuProps={saveButtonMenuProps}
      />
    </Stack>
  );
};

const classes = mergeStyleSets({
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