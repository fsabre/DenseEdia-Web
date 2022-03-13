import { IButtonStyles, IconButton, IContextualMenuProps } from "@fluentui/react";
import React from "react";


interface ISaveSplitButtonProps {
  primaryDisabled?: boolean;
  onSave: () => void;
  menuProps?: IContextualMenuProps;
}

export const SaveSplitButton: React.FC<ISaveSplitButtonProps> = (props) => {
  // Add a border if no style was provided
  const menuPropsWithStyles: IContextualMenuProps | undefined = React.useMemo(() => {
    if (props.menuProps === undefined) {
      return undefined;
    }
    if ("styles" in props.menuProps) {
      return props.menuProps;
    }
    return {
      ...props.menuProps,
      styles: {
        root: {
          border: "1px solid #8a8886",
        },
      },
    };
  }, [props.menuProps]);

  return (
    <IconButton
      iconProps={{iconName: "Save"}}
      primaryDisabled={props.primaryDisabled}
      onClick={props.onSave}
      split={true}
      menuProps={menuPropsWithStyles}
      styles={saveButtonStyles}
    />
  );
};

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
