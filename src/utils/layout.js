import dagre from 'dagre';

const NODE_DIMENSIONS = {
  productionRootNode: { width: 240, height: 150 },
  ingredientNode: { width: 220, height: 180 },
  rawNode: { width: 200, height: 130 },
  textNode: { width: 180, height: 60 },
};

const DEFAULT_DIMENSIONS = { width: 200, height: 120 };

export function applyLayout(nodes, edges, options = {}) {
  const {
    direction = 'TB',
    nodeSpacing = 80,
    rankSpacing = 100,
    offsetX = 0,
    offsetY = 0,
  } = options;

  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: direction,
    nodesep: nodeSpacing,
    ranksep: rankSpacing,
    marginx: 40,
    marginy: 40,
  });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach(node => {
    const dims = NODE_DIMENSIONS[node.type] || DEFAULT_DIMENSIONS;
    g.setNode(node.id, { width: dims.width, height: dims.height });
  });

  edges.forEach(edge => {
    g.setEdge(edge.target, edge.source);
  });

  dagre.layout(g);

  const rootNode = nodes.find(n => n.type === 'productionRootNode');

  let rootDx = 0;
  let rootDy = 0;
  if (rootNode) {
    const rootPos = g.node(rootNode.id);
    if (rootPos) {
      const rootDims = NODE_DIMENSIONS[rootNode.type] || DEFAULT_DIMENSIONS;
      rootDx = offsetX - (rootPos.x - rootDims.width / 2);
      rootDy = offsetY - (rootPos.y - rootDims.height / 2);
    }
  }

  return nodes.map(node => {
    const dagreNode = g.node(node.id);
    if (!dagreNode) return node;

    const dims = NODE_DIMENSIONS[node.type] || DEFAULT_DIMENSIONS;
    return {
      ...node,
      position: {
        x: dagreNode.x - dims.width / 2 + rootDx,
        y: dagreNode.y - dims.height / 2 + rootDy,
      },
    };
  });
}
