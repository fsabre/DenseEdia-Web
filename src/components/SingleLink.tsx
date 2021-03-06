import { DefaultButton, IContextualMenuProps, mergeStyleSets, Stack, Text, TextField } from "@fluentui/react";
import React from "react";

import { ILink } from "../api/types";
import { SaveSplitButton } from "./SaveSplitButton";


interface ISingleLinkProps {
  link: ILink;
  referenceEdiumId: number;
  onDelete:() => void;
}

export const SingleLink: React.FC<ISingleLinkProps> = props => {
  let directionArrow;
  let other;
  if (props.link.start === props.referenceEdiumId) {
    directionArrow = props.link.directed ? "→" : "↔";
    other = props.link.end;
  } else {
    directionArrow = props.link.directed ? "←" : "↔";
    other = props.link.start;
  }

  const saveButtonMenuProps: IContextualMenuProps = {
    items: [
      {
        key: "delete",
        text: "Delete",
        iconProps: {iconName: "Delete"},
        onClick: props.onDelete,
      },
    ],
  };

  return (
    <Stack horizontal className={classes.linkContainer}>
      <TextField readOnly value={props.link.label} />
      <Text>:</Text>
      <DefaultButton text={"This edium"} disabled />
      <DefaultButton text={directionArrow} className={classes.arrowButton} />
      <DefaultButton text={`Edium n°${other}`} />
      <SaveSplitButton
        primaryDisabled={true}
        onSave={() => undefined}
        menuProps={saveButtonMenuProps}
      />
    </Stack>
  );
};

const classes = mergeStyleSets({
  linkContainer: {
    alignItems: "center",
    gap: 10,
  },
  arrowButton: {
    fontSize: 40,
    fontFamily: "Times New Roman",
    paddingBottom: 6,
  },
});
