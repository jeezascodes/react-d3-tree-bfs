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
    current_biomarker_check: "CATR",
    attributes: {
      id: "411d9783-85ba-41e5-a6a3-5e1cca3d294f",
      name: 'root'
    },
    causes: [1],
    recommendations: [1],
    children: [
      // {
      //   current_biomarker_check: "GLUCOSE",
      //   attributes: {
      //     id: "411d9783-85ba-41e5-a6a3-5e1cca3d294f2",
      //     name: 'above_reference_path'
      //   },
      //   causes: [],
      //   recommendations: [],
      //   children: [],
      // },
      // {
      //   current_biomarker_check: "Root 1.2",
      //   attributes: {
      //     id: "411d9783-85ba-41e5-a6a3-5e1cca3d294f3",
      //   },
      //   causes: [],
      //   recommendations: [],
      //   children: [],
      // },
    ],
  });
  const [node, setNode] = useState<TreeNodeDatum | undefined>();

  const close = () => setNode(undefined);

  const handleNodeClick = (datum: TreeNodeDatum) => {
    setNode(datum);
  };

  const handleSubmit = (familyMemberName: string, pathType: string) => {
    const newTree = bfs(node.attributes?.id, tree, {
      current_biomarker_check: familyMemberName,
      attributes: {
        id: v4(),
        name: pathType
      },
      children: [],
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

    return (
      <g>
        <circle r="15" fill={"#777"} onClick={() => click(nodeDatum)} />
        <text fill="black" strokeWidth="0.5" x="20" y="-5">
          {nodeDatum.current_biomarker_check}
        </text>
        <text fill="black" strokeWidth="0.5" x="20" y="15">
          {nodeDatum.attributes.name}
        </text>
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
          renderCustomNodeElement={(nodeInfo) =>
            renderRectSvgNode(nodeInfo, handleNodeClick)
          }
        />
        <NodeModal
          onSubmit={(familyMemberName, pathType) => handleSubmit(familyMemberName, pathType)}
          onClose={close}
          isOpen={Boolean(node)}
        />
      </Box>
    </Stack>
  );
}
