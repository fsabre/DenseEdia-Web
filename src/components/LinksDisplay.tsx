import { mergeStyleSets, Stack, Text } from "@fluentui/react";
import React from "react";

import { ILink } from "../api/types";
import { SingleLink } from "./SingleLink";


interface ILinksDisplayProps {
  ediumId: number;
  links: ILink[];
}

export const LinksDisplay: React.FC<ILinksDisplayProps> = (props) => {
  return (
    <Stack className={classes.linkList}>
      <Text variant={"large"}>Links</Text>
      {props.links.length === 0 && (
        <Text>No link to show</Text>
      )}
      {props.links.map(link => (
        <SingleLink key={link.id} link={link} referenceEdiumId={props.ediumId} />
      ))}
    </Stack>
  );
};

const classes = mergeStyleSets({
  linkList: {
    gap: 10,
  },
});
