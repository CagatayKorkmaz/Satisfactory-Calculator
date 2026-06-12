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

function buildGraph(item, amount, parentId, nodeIdPrefix, recipes, itemsMap, amounts, nodeMap, edges, edgeSet) {
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

    const node = {
      id: nodeId,
      type: isRawResource ? 'rawNode' : 'ingredientNode',
      position: { x: 0, y: 0 },
      data: {
        itemName: item,
        icon: itemMeta.icon,
        category: itemMeta.category,
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
      },
    };

    entry = { nodeId, node };
    nodeMap.set(item, entry);

    if (!isRawResource && recipe) {
      const sf = getScaleFactor(recipe, totalAmount);
      recipe.ingredients.forEach(ing => {
        buildGraph(ing.item, ing.amount_per_min * sf, nodeId, nodeIdPrefix, recipes, itemsMap, amounts, nodeMap, edges, edgeSet);
      });
    }
  }

  if (parentId) {
    const edgeId = `edge_${parentId}_${entry.nodeId}`;
    if (!edgeSet.has(edgeId)) {
      edgeSet.add(edgeId);
      edges.push({
        id: edgeId,
        source: entry.nodeId,
        target: parentId,
        type: 'smoothstep',
        animated: false,
        className: '',
        data: { satisfied: false, overflow: false },
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

  buildGraph(targetItem, targetAmount, null, nodeIdPrefix, recipes, itemsMap, amounts, nodeMap, edges, edgeSet);

  const rootNode = nodeMap.get(targetItem);
  if (rootNode) {
    rootNode.node.type = 'productionRootNode';
  }

  const nodes = Array.from(nodeMap.values()).map(e => e.node);
  return { nodes, edges };
}

export function generateTreeId() {
  return `tree_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
