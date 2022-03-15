import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  Dropdown,
  IDropdownOption,
  Label,
  mergeStyleSets,
  PrimaryButton,
  Stack,
  Text,
  TextField
} from "@fluentui/react";
import React from "react";

import { IEdium } from "../api/types";


type ELinkDirection = "→" | "←" | "↔";

export interface ITmpLink {
  label: string;
  direction: ELinkDirection;
  other?: number;
}

// Cycle between the possible direction arrows
function nextArrow(current: ELinkDirection): ELinkDirection {
  switch (current) {
    case "→":
      return "←";
    case "←":
      return "↔";
    default:
      return "→";
  }
}

const DEFAULT_TMP_LINK: ITmpLink = {
  label: "",
  direction: "→",
  other: undefined,
};

interface IAddLinkDialogProps {
  hidden: boolean;
  hide: () => void;
  onLinkAdd: (link: ITmpLink) => void;
  allEdia: IEdium[];
}


export const AddLinkDialog: React.FC<IAddLinkDialogProps> = (props) => {
  const [tmpLink, setTmpLink] = React.useState<ITmpLink>(DEFAULT_TMP_LINK);

  const ediaOptions: IDropdownOption[] = React.useMemo(() => {
    return props.allEdia.map(edium => ({
      key: edium.id,
      text: `Edium n°${edium.id} : ${edium.title} (${edium.kind})`,
    }));
  }, [props.allEdia]);

  function isInputValid(): boolean {
    return tmpLink.other !== undefined;
  }

  function onDismiss(): void {
    setTmpLink(DEFAULT_TMP_LINK);
    props.hide();
  }

  function onSubmit(): void {
    props.onLinkAdd(tmpLink);
    onDismiss();
  }

  return (
    <Dialog
      hidden={props.hidden}
      onDismiss={onDismiss}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: "Add a new link",
        subText: "Create a new link with the following form.",
      }}
    >
      <Stack className={classes.inputLine}>
        <Dropdown
          label={"Other edium"}
          options={ediaOptions}
          placeholder={"Select an edium"}
          selectedKey={tmpLink.other}
          onChange={(ev, val) => setTmpLink({...tmpLink, other: val?.key as number | undefined})}
          className={classes.ediaDropdown}
        />
        <Label className={classes.directionLabel}>Direction</Label>
        <Stack className={classes.directionLine}>
          <Text>This edium</Text>
          <DefaultButton
            text={tmpLink.direction}
            onClick={() => setTmpLink({...tmpLink, direction: nextArrow(tmpLink.direction)})}
            className={classes.directionButton}
            // I wish I could get rid of this, but for some reason, the fontFamily of the directionButton class is
            // overridden by "inherit" in CSS.
            styles={{label: {fontFamily: "Times New Roman"}}}
          />
          <Text>The other edium</Text>
        </Stack>
        <TextField
          label={"Link label"}
          placeholder={"Type an optional label"}
          value={tmpLink.label}
          onChange={(ev, val) => setTmpLink({...tmpLink, label: val ?? DEFAULT_TMP_LINK.label})}
        />
      </Stack>
      <DialogFooter>
        <DefaultButton text={"Cancel"} onClick={onDismiss} />
        <PrimaryButton text={"Create"} disabled={!isInputValid()} onClick={onSubmit} />
      </DialogFooter>
    </Dialog>
  );
};

const classes = mergeStyleSets({
  inputLine: {
    gap: 10,
  },
  directionLabel: {
    marginBottom: -10,  // Compensate the 10px gap of the stack
  },
  directionLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  directionButton: {
    fontSize: 40,
    fontFamily: "Times New Roman",
    paddingBottom: 6,
  },
  ediaDropdown: {
    width: "100%",
  },
});
