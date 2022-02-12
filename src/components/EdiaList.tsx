import { DefaultButton, Stack, Text } from "@fluentui/react";
import React from "react";

import { getAllEdia } from "../api/actions";
import { IEdium } from "../api/types";


// Display a list of all edia
export const EdiaList: React.FC = () => {
  const [allEdia, setAllEdia] = React.useState<IEdium[]>([]);
  const [isFetching, setIsFetching] = React.useState(true);

  function fetchEdia() {
    setIsFetching(true);
    getAllEdia().then(
      edia => {
        setAllEdia(edia);
        setIsFetching(false);
      },
      err => {
        setIsFetching(false);
      });
  }

  React.useEffect(() => {
    fetchEdia();
  }, []);

  return (
    <Stack>
      <Stack horizontal verticalAlign={"center"} tokens={{childrenGap: 10}}>
        <Text variant={"large"}>DenseEdia Web</Text>
        <DefaultButton text={"Refresh"} disabled={isFetching} onClick={fetchEdia} />
      </Stack>
      <table>
        <thead>
          <tr>
            <td><Text variant={"large"}>ID</Text></td>
            <td><Text variant={"large"}>Title</Text></td>
            <td><Text variant={"large"}>Kind</Text></td>
          </tr>
        </thead>
        <tbody>
          {allEdia.map(edium => (
            <tr key={edium.id}>
              <td><Text>{edium.id}</Text></td>
              <td><Text>{edium.title}</Text></td>
              <td><Text>{edium.kind}</Text></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Stack>
  );
};
