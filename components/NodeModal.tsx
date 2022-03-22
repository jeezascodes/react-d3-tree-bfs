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
import React, { useState } from "react";
import {contactDataTypeOptions, PATH_TYPES, allCauses, allQuestions, PATH_QUESTION} from '../utils/constants'
import SelectInput from './SelectInput/SelectInput'

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (txt: string,question: any, pathType: any, cause: any) => void;
  isQuestion: boolean
  onRemove: any;
};

const NodeModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, isQuestion, onRemove }) => {
  const [pathType, setPathType] = useState("");
  const [contactDataType, setContactDataType] = useState(null)
  const [cause, setCause] = useState("")
  const [question, setQuestion] = useState(null)

  const clearState = () => {
    setPathType('');
    setContactDataType(null);
    setCause('')
    setQuestion(null)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add next step</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SelectInput
            name="Select path type"
            value={pathType}
            options={isQuestion ? PATH_QUESTION  : PATH_TYPES}
            onChange={setPathType}
            isMulti={false}
          />
          <SelectInput
            name="Select biomarker to check"
            value={contactDataType}
            options={contactDataTypeOptions}
            onChange={setContactDataType}
            isMulti={false}
            isDisabled={question && question.value !== 0}
          />
          <SelectInput
            name="Select question to check"
            value={question}
            options={allQuestions}
            onChange={setQuestion}
            isMulti={false}
            isDisabled={contactDataType && contactDataType.value !== 0}
          />
          <SelectInput
            name="Select causes"
            value={cause}
            options={allCauses}
            onChange={setCause}
          />

        </ModalBody>
        <ModalFooter>
        <Button
            color="blue.500"
            variant="solid"
            onClick={() => {
              onRemove();
              clearState()
            }}
          >
            remove
          </Button>
          <Button
            color="blue.500"
            variant="solid"
            onClick={() => {
              onSubmit(contactDataType, question, pathType.value, cause);
              clearState()
            }}
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
