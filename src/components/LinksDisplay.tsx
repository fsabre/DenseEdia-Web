import { CommandBar, ICommandBarItemProps, mergeStyleSets, Stack, Text } from "@fluentui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { createOneLink, deleteOneLink } from "../api/actions";

import { IEdium, ILink, ILinkPost } from "../api/types";
import { errorSlice } from "../reducers/errorSlice";
import { AddLinkDialog, ITmpLink } from "./AddLinkDialog";
import { SingleLink } from "./SingleLink";


interface ILinksDisplayProps {
  ediumId: number;
  links: ILink[];
  allEdia: IEdium[];
  onRefresh: () => void;
}

export const LinksDisplay: React.FC<ILinksDisplayProps> = (props) => {
  const [isAddDialogHidden, setIsAddDialogHidden] = React.useState(true);
  const dispatch = useDispatch();

  const barItems: ICommandBarItemProps[] = [
    {
      key: 'newElement',
      text: 'New',
      iconProps: {iconName: 'Add'},
      onClick: () => setIsAddDialogHidden(false),
    },
  ];

  // Create a new link
  function sendPostLink(newLink: ITmpLink): void {
    if (newLink.other === undefined) {
      console.warn("Can't create a link if no other edium is selected");
      return;
    }
    const postData: ILinkPost = {
      start: newLink.direction === "←" ? newLink.other : props.ediumId,
      end: newLink.direction === "←" ? props.ediumId : newLink.other,
      directed: newLink.direction !== "↔",
      label: newLink.label,
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
      <CommandBar items={barItems} />
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
      <AddLinkDialog
        hidden={isAddDialogHidden}
        hide={() => setIsAddDialogHidden(true)}
        onLinkAdd={sendPostLink}
        allEdia={props.allEdia}
      />
    </Stack>
  );
};

const classes = mergeStyleSets({
  linkList: {
    gap: 10,
  },
});
