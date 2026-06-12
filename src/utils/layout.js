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

/**
 * Re-assigns source/target handle IDs on edges so each connection
 * uses the horizontally closest handles, preventing long edge arcs.
 */
export function assignClosestHandles(nodes, edges) {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const usedSourceHandles = new Map();
  const usedTargetHandles = new Map();

  return edges.map(edge => {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);
    if (!sourceNode || !targetNode) return edge;

    const sourceDims = NODE_DIMENSIONS[sourceNode.type] || DEFAULT_DIMENSIONS;
    const targetDims = NODE_DIMENSIONS[targetNode.type] || DEFAULT_DIMENSIONS;

    const sx = sourceNode.position.x;
    const tx = targetNode.position.x;

    const outputCount = Math.max(1, sourceNode.data?.outputCount || 1);
    const inputCount = Math.max(1, targetNode.data?.inputCount || 1);

    const srcKey = edge.source;
    const tgtKey = edge.target;
    if (!usedSourceHandles.has(srcKey)) usedSourceHandles.set(srcKey, new Set());
    if (!usedTargetHandles.has(tgtKey)) usedTargetHandles.set(tgtKey, new Set());

    let bestS = 0;
    let bestT = 0;
    let bestDist = Infinity;

    for (let s = 0; s < outputCount; s++) {
      const shX = sx + ((s + 0.5) / outputCount) * sourceDims.width;
      for (let t = 0; t < inputCount; t++) {
        const thX = tx + ((t + 0.5) / inputCount) * targetDims.width;
        const dist = Math.abs(shX - thX);
        const srcUsed = usedSourceHandles.get(srcKey).has(s);
        const tgtUsed = usedTargetHandles.get(tgtKey).has(t);
        const adjustedDist = dist + (srcUsed ? 10000 : 0) + (tgtUsed ? 10000 : 0);
        if (adjustedDist < bestDist) {
          bestDist = adjustedDist;
          bestS = s;
          bestT = t;
        }
      }
    }

    usedSourceHandles.get(srcKey).add(bestS);
    usedTargetHandles.get(tgtKey).add(bestT);

    return {
      ...edge,
      sourceHandle: `source-${bestS}`,
      targetHandle: `target-${bestT}`,
    };
  });
}
