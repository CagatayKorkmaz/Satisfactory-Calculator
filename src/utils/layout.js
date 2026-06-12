import ELK from 'elkjs/lib/elk.bundled.js';

const NODE_DIMENSIONS = {
  productionRootNode: { width: 240, height: 150 },
  ingredientNode: { width: 220, height: 180 },
  rawNode: { width: 200, height: 130 },
  textNode: { width: 180, height: 60 },
};

const DEFAULT_DIMENSIONS = { width: 200, height: 120 };
const elk = new ELK();

function getNodeDimensions(node) {
  const base = NODE_DIMENSIONS[node.type] || DEFAULT_DIMENSIONS;
  const byproductCount = node.data?.byproducts?.length || 0;

  if (byproductCount === 0) return base;

  return {
    ...base,
    height: base.height + 34 + Math.max(0, byproductCount - 1) * 28,
  };
}

export async function applyLayout(nodes, edges, options = {}) {
  const {
    direction = 'TB',
    nodeSpacing = 80,
    rankSpacing = 100,
    offsetX = 0,
    offsetY = 0,
  } = options;

  const elkDirection = direction === 'TB' ? 'UP' : direction;
  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': elkDirection,
      'elk.spacing.nodeNode': `${nodeSpacing}`,
      'elk.layered.spacing.nodeNodeBetweenLayers': `${rankSpacing}`,
      'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
      'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
      'elk.layered.considerModelOrder.strategy': 'NONE',
      'elk.padding': '[top=40,left=40,bottom=40,right=40]',
    },
    children: nodes.map(node => ({
      id: node.id,
      ...getNodeDimensions(node),
    })),
    edges: edges.map(edge => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const layoutedGraph = await elk.layout(graph);
  const layoutedNodeMap = new Map((layoutedGraph.children || []).map(node => [node.id, node]));

  const rootNode = nodes.find(n => n.type === 'productionRootNode');

  let rootDx = 0;
  let rootDy = 0;
  if (rootNode) {
    const rootPos = layoutedNodeMap.get(rootNode.id);
    if (rootPos) {
      rootDx = offsetX - rootPos.x;
      rootDy = offsetY - rootPos.y;
    }
  }

  return nodes.map(node => {
    const elkNode = layoutedNodeMap.get(node.id);
    if (!elkNode) return node;

    return {
      ...node,
      position: {
        x: elkNode.x + rootDx,
        y: elkNode.y + rootDy,
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

    const sourceDims = getNodeDimensions(sourceNode);
    const targetDims = getNodeDimensions(targetNode);

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
