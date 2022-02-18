import { IconButton, mergeStyleSets, Stack, Text } from "@fluentui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../reducers";
import { errorSlice } from "../reducers/errorSlice";


export const ErrorBar: React.FC = () => {
  const errors = useSelector((state: RootState) => state.error.errors);
  const dispatch = useDispatch();

  function closeError(errorId: number) {
    dispatch(errorSlice.actions.pop(errorId));
  }

  return (
    <Stack className={classes.container}>
      {errors.map(err => (
        <Stack key={err.id} className={classes.errorMessage} horizontal>
          <Text>{err.text}</Text>
          <IconButton
            iconProps={{iconName: "ChromeClose"}}
            onClick={() => closeError(err.id)}
          />
        </Stack>
      ))}
    </Stack>
  );
};

const classes = mergeStyleSets({
  container: {
    width: "100%",
    padding: "0 35px 10px 0",
    position: "fixed",
    bottom: 0,
    gap: 10,
  },
  errorMessage: {
    padding: 10,
    backgroundColor: "#FF5252",
    border: "1px solid black",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
});
