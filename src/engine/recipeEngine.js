const CATEGORY_COLORS = {
  raw: '#d97706',
  ingot: '#64748b',
  part: '#ea580c',
  component: '#0d9488',
  fluid: '#0284c7',
};

function getEdgeColor(category) {
  return CATEGORY_COLORS[category] || '#4a5a75';
}

export function findRecipe(itemName, recipes) {
  return recipes.find(r => r.item === itemName) || null;
}

export function getScaleFactor(recipe, targetAmount) {
  return targetAmount / recipe.output_per_min;
}

function accumulateAmounts(item, amount, recipes, pathVisited, amounts) {
  if (pathVisited.has(item)) return;
  pathVisited = new Set(pathVisited);
  pathVisited.add(item);

  amounts.set(item, (amounts.get(item) || 0) + amount);

  const recipe = findRecipe(item, recipes);
  if (!recipe) return;

  const scaleFactor = getScaleFactor(recipe, amount);
  recipe.ingredients.forEach(ing => {
    accumulateAmounts(ing.item, ing.amount_per_min * scaleFactor, recipes, pathVisited, amounts);
  });
}

function buildGraph(item, amount, parentId, nodeIdPrefix, recipes, itemsMap, amounts, nodeMap, edges, edgeSet, edgeHandleIdx) {
  let entry = nodeMap.get(item);
  const recipe = findRecipe(item, recipes);
  const isRawResource = !recipe;

  if (!entry) {
    const totalAmount = amounts.get(item) || amount;
    const nodeId = `${nodeIdPrefix}_${item.replace(/\s+/g, '_')}`;
    const itemMeta = itemsMap[item] || { icon: '\uD83D\uDCE6', category: 'unknown' };

    let totalScaleFactor = 1;
    let totalMachineCount = 0;
    let totalFullMachines = 0;
    let underclockPercent = 0;
    if (recipe) {
      totalScaleFactor = getScaleFactor(recipe, totalAmount);
      totalMachineCount = Math.ceil(totalScaleFactor);
      totalFullMachines = Math.floor(totalScaleFactor);
      underclockPercent = totalFullMachines < totalMachineCount
        ? Math.round(((totalScaleFactor - totalFullMachines) * 100) * 100) / 100
        : 0;
    }

    const category = itemMeta.category || 'unknown';
    const edgeColor = getEdgeColor(category);

    const node = {
      id: nodeId,
      type: isRawResource ? 'rawNode' : 'ingredientNode',
      position: { x: 0, y: 0 },
      data: {
        itemName: item,
        icon: itemMeta.icon,
        category,
        edgeColor,
        requiredAmount: totalAmount,
        standardAmount: totalAmount,
        machine: recipe?.machine || null,
        machineCount: totalMachineCount,
        fullMachines: totalFullMachines,
        underclockPercent,
        baseRate: recipe?.output_per_min || 0,
        scaleFactor: totalScaleFactor,
        isRawResource,
        userOverride: null,
        satisfied: false,
        overflowing: false,
        inputCount: 0,
        outputCount: 0,
      },
    };

    entry = { nodeId, node };
    nodeMap.set(item, entry);

    if (!isRawResource && recipe) {
      const sf = getScaleFactor(recipe, totalAmount);
      recipe.ingredients.forEach(ing => {
        buildGraph(ing.item, ing.amount_per_min * sf, nodeId, nodeIdPrefix, recipes, itemsMap, amounts, nodeMap, edges, edgeSet, edgeHandleIdx);
      });
    }
  }

  if (parentId) {
    const edgeId = `edge_${parentId}_${entry.nodeId}`;
    if (!edgeSet.has(edgeId)) {
      edgeSet.add(edgeId);

      const sourceIdx = (edgeHandleIdx.source.get(entry.nodeId) || 0);
      edgeHandleIdx.source.set(entry.nodeId, sourceIdx + 1);
      const targetIdx = (edgeHandleIdx.target.get(parentId) || 0);
      edgeHandleIdx.target.set(parentId, targetIdx + 1);

      const category = entry.node.data.category || 'unknown';
      const edgeColor = getEdgeColor(category);

      edges.push({
        id: edgeId,
        source: entry.nodeId,
        target: parentId,
        sourceHandle: `source-${sourceIdx}`,
        targetHandle: `target-${targetIdx}`,
        type: 'default',
        animated: false,
        className: '',
        data: { satisfied: false, overflow: false, flowRate: amount, category, edgeColor },
        style: { stroke: edgeColor, strokeWidth: 2, opacity: 0.6 },
        markerEnd: { type: 'arrowclosed', width: 14, height: 14, color: edgeColor },
        label: `${item} ${amount.toFixed(2)}/dk`,
        labelStyle: { fill: '#e2e8f0', fontWeight: 600, fontSize: 11, fontFamily: 'Share Tech Mono, monospace' },
        labelBgStyle: { fill: '#0a0e1a' },
        labelBgPadding: [6, 3],
        labelBgBorderRadius: 4,
      });
    }
  }
}

export function buildProductionTree(targetItem, targetAmount, recipes, itemsMap, options = {}) {
  const { nodeIdPrefix = 'tree' } = options;

  const amounts = new Map();
  accumulateAmounts(targetItem, targetAmount, recipes, new Set(), amounts);

  const nodeMap = new Map();
  const edges = [];
  const edgeSet = new Set();
  const edgeHandleIdx = { source: new Map(), target: new Map() };

  buildGraph(targetItem, targetAmount, null, nodeIdPrefix, recipes, itemsMap, amounts, nodeMap, edges, edgeSet, edgeHandleIdx);

  const rootNode = nodeMap.get(targetItem);
  if (rootNode) {
    rootNode.node.type = 'productionRootNode';
  }

  const nodes = Array.from(nodeMap.values()).map(e => {
    const node = e.node;
    node.data.inputCount = edgeHandleIdx.target.get(node.id) || 0;
    node.data.outputCount = edgeHandleIdx.source.get(node.id) || 0;
    return node;
  });

  return { nodes, edges };
}

export function generateTreeId() {
  return `tree_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
