import {
  DefaultButton,
  Dropdown,
  IDropdownOption,
  mergeStyleSets,
  PrimaryButton,
  Stack,
  Text,
  TextField
} from "@fluentui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { createOneLink, deleteOneLink } from "../api/actions";

import { IEdium, ILink, ILinkPost } from "../api/types";
import { errorSlice } from "../reducers/errorSlice";
import { SingleLink } from "./SingleLink";


function nextArrow(current: string): string {
  switch (current) {
    case "→":
      return "←";
    case "←":
      return "↔";
    default:
      return "→";
  }
}

const DEFAULT_TMP_LINK = {
  label: "",
  direction: nextArrow(""),
  other: undefined,
};

interface ILinksDisplayProps {
  ediumId: number;
  links: ILink[];
  allEdia: IEdium[];
  onRefresh: () => void;
}

export const LinksDisplay: React.FC<ILinksDisplayProps> = (props) => {
  const [tmpLabel, setTmpLabel] = React.useState(DEFAULT_TMP_LINK.label);
  const [tmpDirection, setTmpDirection] = React.useState(DEFAULT_TMP_LINK.direction);
  const [tmpOther, setTmpOther] = React.useState<number | undefined>(DEFAULT_TMP_LINK.other);
  const dispatch = useDispatch();

  const ediaOptions: IDropdownOption[] = React.useMemo(() => {
    return props.allEdia.map(edium => ({
      key: edium.id,
      text: `Edium n°${edium.id} : ${edium.title} (${edium.kind})`,
    }));
  }, [props.allEdia]);

  function isInputValid(): boolean {
    return tmpLabel !== "" && tmpOther !== undefined;
  }

  function onNewLink(): void {
    setTmpLabel(DEFAULT_TMP_LINK.label);
    setTmpDirection(DEFAULT_TMP_LINK.direction);
    setTmpOther(DEFAULT_TMP_LINK.other);
    sendPostLink();
  }

  // Create a new link
  function sendPostLink(): void {
    if (tmpOther === undefined) {
      console.warn("Can't create a link if no other edium is selected");
      return;
    }
    const postData: ILinkPost = {
      start: tmpDirection === "←" ? tmpOther : props.ediumId,
      end: tmpDirection === "←" ? props.ediumId : tmpOther,
      directed: tmpDirection !== "↔",
      label: tmpLabel,
    };
    createOneLink(postData).then(
      data => {
        console.log("Link created with success !");
        props.onRefresh();
      },
      err => {
        dispatch(errorSlice.actions.pushError({text: err.message}));
      },
    );
  }

  // Delete a link
  function sendDeleteLink(linkId: number): void {
    deleteOneLink(linkId).then(
      data => {
        console.log("Link deleted with success !");
        props.onRefresh();
      },
      err => {
        dispatch(errorSlice.actions.pushError({text: err.message}));
      },
    );
  }

  return (
    <Stack className={classes.linkList}>
      <Text variant={"large"}>Links</Text>
      {props.links.length === 0 && (
        <Text>No link to show</Text>
      )}
      {props.links.map(link => (
        <SingleLink
          key={link.id}
          link={link}
          referenceEdiumId={props.ediumId}
          onDelete={() => sendDeleteLink(link.id)}
        />
      ))}
      <Text variant={"large"}>New link</Text>
      <Stack horizontal className={classes.newLinkContainer}>
        <TextField
          placeholder={"Link label"}
          value={tmpLabel}
          onChange={(ev, val) => setTmpLabel(val ?? DEFAULT_TMP_LINK.label)}
        />
        <Text>:</Text>
        <DefaultButton disabled text={"This edium"} />
        <DefaultButton
          text={tmpDirection}
          className={classes.arrowButton}
          onClick={() => setTmpDirection(dir => nextArrow(dir))}
        />
        <Dropdown
          options={ediaOptions}
          placeholder={"Select an edium"}
          selectedKey={tmpOther}
          onChange={(ev, val) => setTmpOther(val?.key as number | undefined)}
          className={classes.ediaDropdown}
        />
        <PrimaryButton text={"Add"} disabled={!isInputValid()} onClick={onNewLink} />
      </Stack>
    </Stack>
  );
};

const classes = mergeStyleSets({
  linkList: {
    gap: 10,
  },
  newLinkContainer: {
    alignItems: "center",
    gap: 10,
  },
  arrowButton: {
    fontSize: 40,
    fontFamily: "Times New Roman",
    paddingBottom: 6,
  },
  ediaDropdown: {
    width: "100%",
  },
});
