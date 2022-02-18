import { mergeStyleSets, PrimaryButton, Spinner, Stack, Text, TextField } from "@fluentui/react";
import React from "react";
import { useDispatch } from "react-redux";

import { createOneEdium } from "../api/actions";
import { IEdiumPost } from "../api/types";
import { errorSlice } from "../reducers/errorSlice";


interface ITmpEdium {
  title: string;
  kind: string;
}

const DEFAULT_TMP_EDIUM: ITmpEdium = {
  title: "",
  kind: "",
};

interface IEdiumCreatorProps {
  onCreate?: () => void;
}

// Display a list of all edia
export const EdiumCreator: React.FC<IEdiumCreatorProps> = (props) => {
  const [tmpEdium, setTmpEdium] = React.useState<ITmpEdium>(DEFAULT_TMP_EDIUM);
  const [postRequestPending, setPostRequestPending] = React.useState(false);
  const dispatch = useDispatch();

  function sendPostEdium(): void {
    const postData: IEdiumPost = {title: tmpEdium.title, kind: tmpEdium.kind};
    setPostRequestPending(true);
    createOneEdium(postData).then(
      data => {
        setTmpEdium(DEFAULT_TMP_EDIUM);
        setPostRequestPending(false);
        if (props.onCreate !== undefined) {
          props.onCreate();
        }
      },
      err => {
        dispatch(errorSlice.actions.pushError({text: err.message}));
        setPostRequestPending(false);
      },
    );
  }

  return (
    <Stack tokens={{childrenGap: 20}}>
      <Text variant={"large"} className={classes.title}>Create an edium</Text>
      <TextField
        label={"Title"}
        value={tmpEdium.title}
        onChange={(ev, val) => setTmpEdium({...tmpEdium, title: val ?? DEFAULT_TMP_EDIUM.title})}
      />
      <TextField
        label={"Kind"}
        value={tmpEdium.kind}
        onChange={(ev, val) => setTmpEdium({...tmpEdium, kind: val ?? DEFAULT_TMP_EDIUM.kind})}
      />
      <Stack horizontal verticalAlign={"center"} tokens={{childrenGap: 10}}>
        <PrimaryButton text={"Add"} disabled={postRequestPending} onClick={sendPostEdium} />
        {postRequestPending && <Spinner />}
      </Stack>
    </Stack>
  );
};

const classes = mergeStyleSets({
  title: {
    textAlign: "center",
  },
});
