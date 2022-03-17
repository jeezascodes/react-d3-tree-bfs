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
import {contactDataTypeOptions, allCauses} from '../utils/constants'

const Tree = dynamic(() => import("react-d3-tree"), {
  ssr: false,
});

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
    setNode(datum);
  };

  const handleSubmit = (familyMemberName: any, question: any, pathType: any, cause: any) => {
    const newTree = bfs(node.attributes?.id, tree, {
      current_biomarker_check: familyMemberName?.value || 0,
      current_question_check: question,
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

  const renderRectSvgNode = (
    customProps: CustomNodeElementProps,
    click: (datum: TreeNodeDatum) => void
  ) => {
    const { nodeDatum } = customProps;
    const last_parent_name = contactDataTypeOptions?.filter(item => item.value == nodeDatum.parent)[0]?.label
    const biomarker_name = contactDataTypeOptions?.filter(item => item.value == nodeDatum.current_biomarker_check)[0].label
    const cause_name = allCauses?.filter(item => item.value == nodeDatum.causes)[0]?.label
    const path = nodeDatum.attributes.name
    let textPosition = path == "below_reference" || path == "above_reference"  ? "-130" : "-120"


    return (
      <g>
        <circle r="15" fill={"green"} onClick={() => click(nodeDatum)} />
        <text fill="black" strokeWidth="0.5" x="20" y="-5" className={`biomarkerName long_name`}>
          {biomarker_name == 'None' ? '' : biomarker_name}
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

  console.log(`tree`, tree)

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
        />
      </Box>
    </Stack>
  );
}
