import { CommandBar, ICommandBarItemProps, mergeStyleSets, Stack, Text } from "@fluentui/react";
import React from "react";
import { useDispatch } from "react-redux";

import { createOneElement, createOneVersion, deleteOneElement } from "../api/actions";
import { IElement, IElementPost, IVersionPost, JsonValue, ValueType } from "../api/types";
import { errorSlice } from "../reducers/errorSlice";
import { AddElementDialog } from "./AddElementDialog";
import { SingleElement } from "./SingleElement";


interface ITmpElement {
  name: string;
  tmpType: ValueType | null;
  tmpValue: JsonValue;
}

const DEFAULT_TMP_ELEMENT: ITmpElement = {
  name: "",
  tmpType: null,
  tmpValue: null,
};

interface IElementDisplayProps {
  ediumId: number;
  ediumKind?:string;
  elements: IElement[];
  onRefresh: () => void;
}

export const ElementsDisplay: React.FC<IElementDisplayProps> = (props) => {
  const [tmpElements, setTmpElements] = React.useState<ITmpElement[]>([]);
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

  // Empty the tmpElements when the ediumId changes
  React.useEffect(() => {
    setTmpElements([]);
  }, [props.ediumId]);

  // When the data is refreshed, remove the added elements from the tmpElements list
  React.useEffect(() => {
    // List of all the existing element names
    const existingNames = props.elements.map(element => element.name);
    setTmpElements(oldList => (
      // Return a new list made of the ITmpElements that have not one of those names
      oldList.filter(tmpElem => existingNames.indexOf(tmpElem.name) === -1)
    ));
  }, [props.elements]);

  // Return false if the element name is empty or already taken
  function isNewElementNameValid(elementName: string): boolean {
    if (elementName === "") {
      return false;
    }
    if (props.elements.find(element => element.name === elementName) !== undefined) {
      return false;
    }
    if (tmpElements.find(tmpElement => tmpElement.name === elementName) !== undefined) {
      return false;
    }
    return true;
  }

  // Create a new temporary element displayed along the others
  function onNewElement(elementName: string): void {
    setTmpElements([...tmpElements, {...DEFAULT_TMP_ELEMENT, name: elementName}]);
  }

  // Create a new version for an existing element
  function onVersionCreate(element_id: number, valueType: ValueType, valueJson: JsonValue): void {
    const postData: IVersionPost = {value_type: valueType, value_json: valueJson};
    createOneVersion(element_id, postData).then(
      data => {
        console.log("Version created with success !");
        props.onRefresh();
      },
      err => {
        dispatch(errorSlice.actions.pushError({text: err.message}));
      },
    );
  }

  // Create a new element and its version
  function onElementCreate(element_name: string, valueType: ValueType, valueJson: JsonValue): void {
    const postData: IElementPost = {
      name: element_name,
      version: {value_type: valueType, value_json: valueJson},
    };
    createOneElement(props.ediumId, postData).then(
      data => {
        console.log("Element created with success !");
        props.onRefresh();
      },
      err => {
        dispatch(errorSlice.actions.pushError({text: err.message}));
      },
    );
  }

  // Delete an element and all its versions
  function onElementDelete(elementId: number): void {
    deleteOneElement(elementId).then(
      data => {
        console.log("Element deleted with success !");
        props.onRefresh();
      },
      err => {
        dispatch(errorSlice.actions.pushError({text: err.message}));
      },
    );
  }

  return (
    <Stack className={classes.elementList}>
      <Text variant={"large"}>Elements</Text>
      <CommandBar items={barItems} />
      {props.elements.length === 0 && (
        <Text>No element to show</Text>
      )}
      {/* Create a line for each element of the edium */}
      {props.elements.map(element => {
        const version = element.versions.find(ver => ver.last);
        return (
          <SingleElement
            key={element.id}
            elementName={element.name}
            initialValueType={version?.value_type ?? null}
            initialValueJson={version?.value_json ?? null}
            onSave={(valType, valJson) => onVersionCreate(element.id, valType, valJson)}
            onDelete={() => onElementDelete(element.id)}
          />
        );
      })}
      {/* Create a line for each temporary element */}
      {tmpElements.map(tmpElement => (
        <SingleElement
          key={tmpElement.name}
          elementName={tmpElement.name}
          initialValueType={tmpElement.tmpType}
          initialValueJson={tmpElement.tmpValue}
          onSave={(valType, valJson) => onElementCreate(tmpElement.name, valType, valJson)}
          onDelete={() => setTmpElements(tmpElements.filter(e => e.name !== tmpElement.name))}
        />
      ))}
      {/* Display the dialog to add a new element */}
      <AddElementDialog
        hidden={isAddDialogHidden}
        hide={() => setIsAddDialogHidden(true)}
        isElementNameValid={isNewElementNameValid}
        onElementAdd={onNewElement}
        ediumKind={props.ediumKind}
      />
    </Stack>
  );
};

const classes = mergeStyleSets({
  elementList: {
    gap: 10,
  },
});

