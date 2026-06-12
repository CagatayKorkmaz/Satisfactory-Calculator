/**
 * recipeEngine.js
 * Satisfactory üretim ağacı oluşturma motoru.
 * Verilen ürün ve hedef miktara göre tüm alt bileşen ağacını düğümler halinde döner.
 */

/**
 * Tarifler listesinden bir ürünün tarifini bulur.
 * @param {string} itemName
 * @param {Array} recipes
 * @returns {Object|null}
 */
export function findRecipe(itemName, recipes) {
  return recipes.find(r => r.item === itemName) || null;
}

/**
 * Bir ürün için gereken/dakika hesaplar.
 * @param {Object} recipe - Kaynak tarif
 * @param {number} targetAmount - İstenen miktar/dk
 * @returns {number} - Ölçekleme faktörü
 */
export function getScaleFactor(recipe, targetAmount) {
  return targetAmount / recipe.output_per_min;
}

/**
 * Üretim ağacını rekürsif olarak oluşturur.
 * ReactFlow için node ve edge listesi döner.
 *
 * @param {string} targetItem - Hedef ürün adı
 * @param {number} targetAmount - Hedef miktar/dk
 * @param {Array} recipes - Tüm tarifler
 * @param {Object} itemsMap - İtem meta verisi (icon, category)
 * @param {Object} options - Ek seçenekler
 * @returns {{ nodes: Array, edges: Array }}
 */
export function buildProductionTree(targetItem, targetAmount, recipes, itemsMap, options = {}) {
  const {
    parentId = null,
    depth = 0,
    visited = new Set(),
    nodeAccum = [],
    edgeAccum = [],
    nodeIdPrefix = 'tree',
  } = options;

  const nodeId = parentId
    ? `${nodeIdPrefix}_${targetItem.replace(/\s+/g, '_')}_${depth}_${nodeAccum.length}`
    : `${nodeIdPrefix}_root`;

  if (visited.has(targetItem)) {
    return { nodes: nodeAccum, edges: edgeAccum };
  }

  const recipe = findRecipe(targetItem, recipes);
  const itemMeta = itemsMap[targetItem] || { icon: '📦', category: 'unknown' };

  const isRawResource = !recipe;
  const scaleFactor = recipe ? getScaleFactor(recipe, targetAmount) : 1;
  const machineCount = recipe ? Math.ceil(scaleFactor) : 0;

  const node = {
    id: nodeId,
    type: isRawResource ? 'rawNode' : (depth === 0 ? 'productionRootNode' : 'ingredientNode'),
    position: { x: 0, y: 0 },
    data: {
      itemName: targetItem,
      icon: itemMeta.icon,
      category: itemMeta.category,
      requiredAmount: targetAmount,
      standardAmount: targetAmount,
      machine: recipe?.machine || null,
      machineCount,
      scaleFactor,
      isRawResource,
      userOverride: null,
      satisfied: false,
      overflowing: false,
      depth,
    },
  };

  nodeAccum.push(node);

  if (parentId) {
    const edgeId = `edge_${parentId}_${nodeId}`;
    edgeAccum.push({
      id: edgeId,
      source: nodeId,
      target: parentId,
      type: 'smoothstep',
      animated: false,
      className: '',
      data: { satisfied: false, overflow: false },
    });
  }

  if (isRawResource || !recipe) {
    return { nodes: nodeAccum, edges: edgeAccum };
  }

  const visitedForChildren = new Set(visited);
  visitedForChildren.add(targetItem);

  recipe.ingredients.forEach((ingredient) => {
    const childAmount = ingredient.amount_per_min * scaleFactor;

    buildProductionTree(
      ingredient.item,
      childAmount,
      recipes,
      itemsMap,
      {
        parentId: nodeId,
        depth: depth + 1,
        visited: visitedForChildren,
        nodeAccum,
        edgeAccum,
        nodeIdPrefix,
      }
    );
  });

  return { nodes: nodeAccum, edges: edgeAccum };
}

/**
 * Düğüm ID'si üretir (benzersiz, rastgele)
 */
export function generateTreeId() {
  return `tree_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
