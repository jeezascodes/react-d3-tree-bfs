import { Box, Stack } from "@chakra-ui/layout";
import dynamic from "next/dynamic";
import NodeModal from "../components/NodeModal";
import { useState } from "react";
import {
  CustomNodeElementProps,
  RawNodeDatum,
  TreeNodeDatum,
} from "react-d3-tree/lib/types/common";
import { v4 } from "uuid";
import {contactDataTypeOptions, allCauses, allQuestions} from '../utils/constants'
import { clone } from 'lodash';

const Tree = dynamic(() => import("react-d3-tree"), {
  ssr: false,
});

export function removeBfs(
  id: string,
  tree: RawNodeDatum | RawNodeDatum[],
  node: RawNodeDatum
) {
  console.log(`id`, id)
  console.log(`node`, node)
  const queue: RawNodeDatum[] = [];

  queue.unshift(tree as RawNodeDatum);

  while (queue.length > 0) {
    const curNode = queue.pop();
    console.log(`curNode`, curNode)

    // if (curNode.attributes?.id === id) {
    //   console.log(`exec`)
    //   curNode.children = curNode.children.filter(item => item.current_biomarker_check == node.current_biomarker_check);

    //   return { ...tree };
    // }

    if (curNode?.current_biomarker_check === node.parent) {
      console.log(`exec`, curNode)
      curNode.children = curNode.children.filter(item => item.current_biomarker_check !== node.current_biomarker_check);

      return { ...tree };
    }


    const len = curNode.children.length;

    for (let i = 0; i < len; i++) {
      queue.unshift(curNode.children[i]);
    }
  }
}

export function bfs(
  id: string,
  tree: RawNodeDatum | RawNodeDatum[],
  node: RawNodeDatum
) {
  const queue: RawNodeDatum[] = [];

  queue.unshift(tree as RawNodeDatum);



  while (queue.length > 0) {
    const curNode = queue.pop();

    if (curNode.attributes?.id === id) {
      curNode.children.push(node);

      return { ...tree };
    }

    const len = curNode.children.length;

    for (let i = 0; i < len; i++) {
      queue.unshift(curNode.children[i]);
    }
  }
}


export default function Home() {
  const [tree, setTree] = useState<RawNodeDatum | RawNodeDatum[]>({
    current_biomarker_check: 40,
    current_question_check: null,
    attributes: {
      id: "411d9783-85ba-41e5-a6a3-5e1cca3d294f",
      name: 'root'
    },
    causes: [0],
    recommendations: [1],
    children: [],
    parent: 0
  });
  const [node, setNode] = useState<TreeNodeDatum | undefined>();
  const close = () => setNode(undefined);

  const handleNodeClick = (datum: TreeNodeDatum) => {
    console.log(`datum`, datum)
    setNode(datum);
  };


  // console.log(`tree`, tree)

  const handleSubmit = (familyMemberName: any, question: any, pathType: any, cause: any) => {
    const newTree = bfs(node.attributes?.id, tree, {
      current_biomarker_check: familyMemberName?.value || 0,
      current_question_check: question?.value || null,
      attributes: {
        id: v4(),
        name: pathType
      },
      causes: cause,
      children: [],
      parent: node.current_biomarker_check
    });

    if (newTree) {
      setTree(newTree);
    }

    setNode(undefined);
  };

  const handleRemove = () => {
    const newTree = removeBfs(node.attributes.id, tree, node)
    console.log(`newTree`, newTree)

    if (newTree) {
      setTree(newTree);
    }

    setNode(undefined);
  }

  const renderRectSvgNode = (
    customProps: CustomNodeElementProps,
    click: (datum: TreeNodeDatum) => void
  ) => {
    const { nodeDatum } = customProps;
    const last_parent_name = contactDataTypeOptions?.filter(item => item.value == nodeDatum.parent)[0]?.label
    const biomarker_name = contactDataTypeOptions?.filter(item => item.value == nodeDatum.current_biomarker_check)[0].label
    const question_name = allQuestions?.filter(item => item.value == nodeDatum.current_question_check)[0]?.label
    const cause_name = allCauses?.filter(item => item.value == nodeDatum.causes)[0]?.label
    const path = nodeDatum.attributes.name
    let textPosition = path == "below_reference" || path == "above_reference"  ? "-130" : "-120"

    const formattedBiomarkerName =  biomarker_name == 'None' ? '' : biomarker_name
    const formattedQuestionName =  question_name == 'None' ? '' : question_name

    console.log(`nodeDatum.current_question_check`, nodeDatum.current_question_check)

    console.log(`formattedBiomarkerName`, formattedBiomarkerName)
    console.log(`formattedQuestionName`, formattedQuestionName)

    return (
      <g>
        <circle r="15" fill={"green"} onClick={() => click(nodeDatum)} />
        <text fill="black" strokeWidth="0.5" x="20" y="-5" className={`biomarkerName long_name`}>
          {formattedBiomarkerName || formattedQuestionName}
        </text>
        <text fill="black" strokeWidth="0.5" x="20" y="15" className="biomarkerName">
          {cause_name == 'None' ? '' : cause_name}
        </text>
        {last_parent_name != 'None' &&  <text fill="black" strokeWidth="0.5" x={textPosition} y="-10" className={`pathType long`}>
          {`If ${last_parent_name} is:`}
        </text>}
        {last_parent_name != 'None' && <text fill="black" strokeWidth="0.5" x={textPosition} y="10" className="pathType">
          {nodeDatum.attributes.name}
        </text>}
      </g>
    );
  };


  return (
    <Stack direction="row" spacing="md">
      <Box w="100%" h="100vh">
        <Tree
          data={tree}
          zoomable={true}
          onNodeClick={handleNodeClick}
          translate={{
            x: 200,
            y: 200,
          }}
          nodeSize= {{ x: 340, y: 140 }}
          renderCustomNodeElement={(nodeInfo) =>
            renderRectSvgNode(nodeInfo, handleNodeClick)
          }
        />
        <NodeModal
          onSubmit={(familyMemberName, question, pathType, cause) => handleSubmit(familyMemberName,question, pathType, cause)}
          onClose={close}
          isOpen={Boolean(node)}
          isQuestion={Boolean(node?.current_question_check)}
          onRemove={handleRemove}
        />
      </Box>
    </Stack>
  );
}
