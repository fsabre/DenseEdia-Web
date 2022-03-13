import { DefaultButton, Dialog, DialogFooter, DialogType, PrimaryButton, Stack, TextField } from "@fluentui/react";
import React from "react";


interface IAddElementDialogProps {
  hidden: boolean;
  hide: () => void;
  isElementNameValid: (name: string) => boolean;
  onElementAdd: (name: string) => void;
}


export const AddElementDialog: React.FC<IAddElementDialogProps> = (props) => {
  const [tmpName, setTmpName] = React.useState("");

  function onDismiss(): void {
    setTmpName("");
    props.hide();
  }

  function onEnterPressed(): void {
    if (props.isElementNameValid(tmpName)) {
      onSubmit();
    }
  }

  function onSubmit(): void {
    props.onElementAdd(tmpName);
    setTmpName("");
  }

  return (
    <Dialog
      hidden={props.hidden}
      onDismiss={onDismiss}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: "Add new elements",
        subText: "Enter a name in the following field, then use 'Add' or the 'Enter' key to create an element. You can create more than one element before quitting.",
      }}
    >
      <Stack tokens={{childrenGap: 10}}>
        <TextField
          placeholder={"Element name"}
          value={tmpName}
          onChange={(ev, val) => setTmpName(val ?? "")}
          onKeyDown={(ev) => ev.key === "Enter" ? onEnterPressed() : undefined}
          onSubmit={() => props.isElementNameValid(tmpName) && onSubmit()}
        />
        <PrimaryButton
          text={"Add"}
          disabled={!props.isElementNameValid(tmpName)}
          onClick={onSubmit}
        />
      </Stack>
      <DialogFooter>
        <DefaultButton text={"Exit"} onClick={onDismiss} />
      </DialogFooter>
    </Dialog>
  );
};
