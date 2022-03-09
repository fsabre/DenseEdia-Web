import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  mergeStyleSets,
  PrimaryButton,
  Spinner,
  Stack,
  Text,
  TextField
} from "@fluentui/react";
import React from "react";
import { useDispatch } from "react-redux";

import { createOneEdium, deleteOneEdium, modifyOneEdium } from "../api/actions";
import { IEdium, IEdiumPatch, IEdiumPost } from "../api/types";
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
  // The selected edium, undefined if none is selected
  edium?: IEdium;
  // Function that triggers a refresh of the edia list
  onRefresh: () => void;
}

// Display a list of all edia
export const EdiumInfo: React.FC<IEdiumCreatorProps> = (props) => {
  const [tmpEdium, setTmpEdium] = React.useState<ITmpEdium>(DEFAULT_TMP_EDIUM);
  const [postRequestPending, setPostRequestPending] = React.useState(false);
  const [isDeleteDialogHidden, setIsDeleteDialogHidden] = React.useState(true);
  const dispatch = useDispatch();

  function sendPostEdium(): void {
    const postData: IEdiumPost = {title: tmpEdium.title, kind: tmpEdium.kind};
    setPostRequestPending(true);
    createOneEdium(postData).then(
      data => {
        setTmpEdium(DEFAULT_TMP_EDIUM);
        setPostRequestPending(false);
        props.onRefresh();
      },
      err => {
        dispatch(errorSlice.actions.pushError({text: err.message}));
        setPostRequestPending(false);
      },
    );
  }

  function sendPatchEdium(): void {
    if (props.edium === undefined) {
      console.warn("Can't modify an edium if no edium is selected");
      return;
    }
    const patchData: IEdiumPatch = {title: tmpEdium.title, kind: tmpEdium.kind};
    setPostRequestPending(true);
    modifyOneEdium(props.edium.id, patchData).then(
      data => {
        setPostRequestPending(false);
        props.onRefresh();
      },
      err => {
        dispatch(errorSlice.actions.pushError({text: err.message}));
        setPostRequestPending(false);
      },
    );
  }

  function sendDeleteEdium(): void {
    if (props.edium === undefined) {
      console.warn("Can't delete an edium if no edium is selected");
      return;
    }
    setPostRequestPending(true);
    deleteOneEdium(props.edium.id).then(
      data => {
        setPostRequestPending(false);
        props.onRefresh();
      },
      err => {
        dispatch(errorSlice.actions.pushError({text: err.message}));
        setPostRequestPending(false);
      },
    );
  }

  function onSubmit(): void {
    if (props.edium === undefined) {
      sendPostEdium();
    } else {
      sendPatchEdium();
    }
  }

  function onDelete(): void {
    setIsDeleteDialogHidden(true);
    sendDeleteEdium();
  }

  // Update the tmp values if the edium has changed
  React.useEffect(() => {
    if (props.edium === undefined) {
      setTmpEdium(DEFAULT_TMP_EDIUM);
    } else {
      setTmpEdium({title: props.edium.title, kind: props.edium.kind});
    }
  }, [props.edium]);

  return (
    <Stack tokens={{childrenGap: 10}}>
      <Text variant={"large"} className={classes.title}>Edium info</Text>
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
        <PrimaryButton
          text={props.edium === undefined ? "Add an edium" : "Modify the edium"}
          disabled={postRequestPending}
          onClick={onSubmit}
        />
        <DefaultButton
          text={"Delete the edium"}
          disabled={postRequestPending || props.edium === undefined}
          onClick={() => setIsDeleteDialogHidden(false)}
        />
        <Dialog
          hidden={isDeleteDialogHidden}
          onDismiss={() => setIsDeleteDialogHidden(true)}
          dialogContentProps={{
            type: DialogType.largeHeader,
            title: "Delete an edium",
            subText: "Are you sure to delete this edium, all its elements and related links ?",
          }}
        >
          <DialogFooter>
            <PrimaryButton onClick={onDelete} text="Delete" />
            <DefaultButton onClick={() => setIsDeleteDialogHidden(true)} text="Cancel" />
          </DialogFooter>
        </Dialog>
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
