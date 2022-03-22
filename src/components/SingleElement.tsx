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
// Copied from https://www.myintervals.com/blog/2009/05/20/iso-8601-date-validation-that-doesnt-suck/
const DATETIME_REGEX = new RegExp("^([\\+-]?\\d{4}(?!\\d{2}\\b))((-?)((0[1-9]|1[0-2])(\\3([12]\\d|0[1-9]|3[01]))?|W([0-4]\\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\\d|[12]\\d{2}|3([0-5]\\d|6[1-6])))([T\\s]((([01]\\d|2[0-3])((:?)[0-5]\\d)?|24\\:?00)([\\.,]\\d+(?!:))?)?(\\17[0-5]\\d([\\.,]\\d+)?)?([zZ]|([\\+-])([01]\\d|2[0-3]):?([0-5]\\d)?)?)?)?$");

function isValidInt(raw: string): boolean {
  // Also test that the number is small enough not to use the scientific notation
  return INT_REGEX.test(raw) && String(Number(raw)).indexOf("e") === -1;
}

function isValidFloat(raw: string): boolean {
  // Also test that the number is small enough not to use the scientific notation
  return FLOAT_REGEX.test(raw) && String(Number(raw)).indexOf("e") === -1;
}

function isValidDatetime(raw: string): boolean {
  return DATETIME_REGEX.test(raw);
}

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
  const [tmpTrueValue, setTmpTrueValue] = React.useState<JsonValue>(props.initialValueJson);
  // Temporary string value for the value textfield
  const [tmpRawValue, setTmpRawValue] = React.useState(String(props.initialValueJson));

  const saveButtonState = getSaveButtonState();

  // Send the tmpType and the tmpValue to create the version
  function onSave(): void {
    if (tmpType === null) {
      console.log("Trying to save when there's no version");
      return;
    }
    props.onSave(tmpType, tmpTrueValue);
  }

  // Reset the tmpType and the tmpValue to their initial state
  function onReset(): void {
    setTmpType(props.initialValueType);
    setTmpTrueValue(props.initialValueJson);
    setTmpRawValue(String(props.initialValueJson));
  }

  // Change the tmpType and reset the tmpValue
  function onTypeChange(newType: ValueType): void {
    setTmpType(newType);
    // For some reason, I can't do it properly with a Map<ValueType, JsonValue>.
    if (newType === "bool") {
      setTmpTrueValue(false);
      setTmpRawValue("");
    } else if (newType === "int" || newType === "float") {
      setTmpTrueValue(0);
      setTmpRawValue("0");
    } else if (newType === "str" || newType === "datetime") {
      setTmpTrueValue("");
      setTmpRawValue("");
    } else {
      setTmpTrueValue(null);
      setTmpRawValue("");
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
    if (tmpType === "int") {
      return isValidInt(tmpRawValue);
    }
    if (tmpType === "float") {
      return isValidFloat(tmpRawValue);
    }
    if (tmpType === "datetime") {
      return isValidDatetime(tmpRawValue);
    }
    return true;
  }

  // Return "disabled" if neither the type nor the value have changed, "error"
  // if the value is not valid or "ok" is the remaining cases.
  function getSaveButtonState(): "ok" | "disabled" | "error" {
    if (!isValid()) {
      return "error";
    }
    if (tmpType === props.initialValueType && tmpTrueValue === props.initialValueJson) {
      return "disabled";
    }
    return "ok";
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
            checked={tmpTrueValue === true} // Expect null value
            onText={"True"}
            offText={"False"}
            onChange={(ev, val) => {
              setTmpTrueValue(val ?? false);
            }}
            className={classes.boolContent}
          />
        );
      case "int":
        return (
          <TextField
            value={tmpRawValue}
            onChange={(ev, val) => {
              val = val ?? "";
              setTmpRawValue(val);
              if (isValidInt(val)) {
                setTmpTrueValue(Number(val));
              }
            }}
            borderless
            className={classes.strContent}
          />
        );
      case "float":
        return (
          <TextField
            value={tmpRawValue}
            onChange={(ev, val) => {
              val = val ?? "";
              setTmpRawValue(val);
              if (isValidFloat(val)) {
                setTmpTrueValue(Number(val));
              }
            }}
            borderless
            className={classes.strContent}
          />
        );
      case "str":
        return (
          <TextField
            value={String(tmpTrueValue ?? "")} // Expect null value
            onChange={(ev, val) => {
              setTmpTrueValue(val ?? "");
            }}
            borderless
            className={classes.strContent}
          />
        );
      case "datetime":
        return (
          <TextField
            value={tmpRawValue}
            onChange={(ev, val) => {
              val = val ?? "";
              setTmpRawValue(val);
              if (isValidDatetime(val)) {
                setTmpTrueValue(val);
              }
            }}
            borderless
            className={classes.strContent}
          />
        );
      default:
        return <Text>{String(tmpTrueValue ?? "")}</Text>; // Expect null value
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
        primaryDisabled={saveButtonState !== "ok"}
        disabledColor={saveButtonState === "error" ? "#E57373" : undefined}
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
