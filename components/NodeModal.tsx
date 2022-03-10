import { Button } from "@chakra-ui/button";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import {contactDataTypeOptions, PATH_TYPES} from '../utils/constants'
import SelectInput from './SelectInput/SelectInput'

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (txt: string, pathType: any) => void;
};

const NodeModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [pathType, setPathType] = useState("");
  const [contactDataType, setContactDataType] = useState(null)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add next step</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              value={txt}
              onChange={(event) => setTxt(event.target.value)}
            />
            <FormLabel>Path type</FormLabel>
            <Input
              value={pathType}
              onChange={(event) => setPathType(event.target.value)}
            />
          </FormControl> */}
          <SelectInput
            name="Select path type"
            value={pathType}
            options={PATH_TYPES}
            onChange={setPathType}
          />
          <SelectInput
            name="Select biomarker to check"
            value={contactDataType}
            options={contactDataTypeOptions}
            onChange={setContactDataType}
          />

        </ModalBody>
        <ModalFooter>
          <Button
            color="blue.500"
            variant="solid"
            onClick={() => onSubmit(contactDataType, pathType.value)}
            disabled={!pathType}
          >
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NodeModal;
