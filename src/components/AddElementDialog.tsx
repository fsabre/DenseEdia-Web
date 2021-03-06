import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  Link,
  mergeStyleSets,
  PrimaryButton,
  Separator,
  Stack,
  Text,
  TextField
} from "@fluentui/react";
import React from "react";
import { useDispatch } from "react-redux";

import { getMostUsedElementNames } from "../api/actions";
import { errorSlice } from "../reducers/errorSlice";


interface IAddElementDialogProps {
  hidden: boolean;
  hide: () => void;
  isElementNameValid: (name: string) => boolean;
  onElementAdd: (name: string) => void;
  ediumKind?: string;
}


export const AddElementDialog: React.FC<IAddElementDialogProps> = (props) => {
  const [tmpName, setTmpName] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const dispatch = useDispatch();

  const filteredSuggestions = React.useMemo(() => {
    return suggestions.filter(props.isElementNameValid);
  }, [suggestions, props.isElementNameValid]);

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

  React.useEffect(() => {
    if (!props.ediumKind) {  // Undefined or empty
      setSuggestions([]);
    } else {
      getMostUsedElementNames(props.ediumKind).then(
        data => {
          setSuggestions(data.map(([name, count]) => name));
        },
        err => {
          dispatch(errorSlice.actions.pushError({text: err.message}));
        },
      );
    }
  }, [props.ediumKind, dispatch]);

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
      <Stack className={classes.inputLine}>
        <TextField
          label={"Element name"}
          placeholder={"Enter an element name"}
          value={tmpName}
          onChange={(ev, val) => setTmpName(val ?? "")}
          onKeyDown={(ev) => ev.key === "Enter" ? onEnterPressed() : undefined}
          onSubmit={() => props.isElementNameValid(tmpName) && onSubmit()}
          className={classes.nameField}
        />
        <PrimaryButton
          text={"Add"}
          disabled={!props.isElementNameValid(tmpName)}
          onClick={onSubmit}
        />
      </Stack>
      <Separator />
      <Text variant={"large"}>Suggestions</Text>
      <Stack className={classes.suggestionsContainer}>
        {filteredSuggestions.length === 0 && (
          <Text>No suggestions</Text>
        )}
        {filteredSuggestions.map(name => (
          <Link key={name} onClick={() => props.onElementAdd(name)}>{name}</Link>
        ))}
      </Stack>
      <DialogFooter>
        <DefaultButton text={"Exit"} onClick={onDismiss} />
      </DialogFooter>
    </Dialog>
  );
};

const classes = mergeStyleSets({
  inputLine: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  nameField: {
    width: "100%",
  },
  suggestionsContainer: {
    flexFlow: "wrap",
    gap: 10,
  },
});
