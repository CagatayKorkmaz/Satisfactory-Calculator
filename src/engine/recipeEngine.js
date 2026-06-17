export const RAW_RESOURCES = [
  'Iron Ore', 'Copper Ore', 'Limestone', 'Coal', 'Crude Oil', 'Water',
  'Bauxite', 'Raw Quartz', 'Sulfur', 'Uranium', 'Nitrogen Gas', 'SAM', 'Caterium Ore',
];

const CATEGORY_COLORS = {
  raw: '#d97706',
  ingot: '#64748b',
  part: '#ea580c',
  component: '#0d9488',
  fluid: '#0284c7',
};

const ALT_RECIPE_NAMES = {
  'alt_screw': 'Cast Screw',
  'alt_screw_2': 'Steel Screw',
  'alt_pureironingot': 'Pure Iron Ingot',
  'alt_ingotiron': 'Alloyed Iron Ingot',
  'alt_steelcoatedplate': 'Steel Coated Plate',
  'alt_coatedironplate': 'Coated Iron Plate',
  'alt_steelrod': 'Steel Rod',
  'alt_purecopperingot': 'Pure Copper Ingot',
  'alt_copperalloyingot': 'Copper Alloy Ingot',
  'alt_steamedcoppersheet': 'Steamed Copper Sheet',
  'alt_cokesteelingot': 'Coke Steel Ingot',
  'alt_ingotsteel_1': 'Solid Steel Ingot',
  'alt_ingotsteel_2': 'Molded Steel Ingot',
  'alt_quickwire': 'Quickwire (Alt)',
  'alt_wire_1': 'Iron Wire',
  'alt_wire_2': 'Caterium Wire',
  'alt_fusedwire': 'Fused Wire',
  'alt_reinforcedironplate_1': 'Bolted Iron Plate',
  'alt_reinforcedironplate_2': 'Stitched Iron Plate',
  'alt_basic_iron_ingot': 'Basic Iron Ingot',
  'alt_leached_iron_ingot': 'Leached Iron Ingot',
  'alt_adheredironplate': 'Adhered Iron Plate',
  'alt_rotor': 'Steel Rotor',
  'alt_copperrotor': 'Copper Rotor',
  'alt_stator': 'Quickwire Stator',
  'alt_motor_1': 'Turbo Motor',
  'alt_electricmotor': 'Electric Motor',
  'alt_modularframe': 'Steeled Frame',
  'alt_boltedframe': 'Bolted Frame',
  'alt_heavyflexibleframe': 'Flexible Frame',
  'alt_encasedindustrialbeam': 'Encased Industrial Pipe',
  'alt_heatfusedframe': 'Heat-Fused Frame',
  'alt_plastic_1': 'Recycled Plastic',
  'alt_wetconcrete': 'Wet Concrete',
  'alt_rubberconcrete': 'Rubber Concrete',
  'alt_concrete': 'Fine Concrete',
  'alt_polymerresin': 'Polymer Resin (Alt)',
  'alt_dilutedfuel': 'Diluted Fuel',
  'alt_turboblendfuel': 'Turbo Blend Fuel',
  'alt_turboheavyfuel': 'Turbo Heavy Fuel',
  'alt_heavyoilresidue': 'Heavy Oil Residue',
  'alt_sloppyalumina': 'Sloppy Alumina',
  'alt_alcladcasing': 'Alclad Casing',
  'alt_electroaluminumscrap': 'Electro-Aluminum Scrap',
  'alt_instantscrap': 'Instant Scrap',
  'alt_classicbattery': 'Classic Battery',
  'alt_beacon_1': 'Beacon (Alt)',
  'alt_gunpowder_1': 'Gunpowder (Alt)',
  'alt_coatedcable': 'Coated Cable',
  'alt_cable_1': 'Cable (Insulated)',
  'alt_cable_2': 'Cable (Quickwire)',
  'alt_electrodecircuitboard': 'Electrode Circuit Board',
  'alt_circuitboard_1': 'Circuit Board (Silicon)',
  'alt_circuitboard_2': 'Circuit Board (Quickwire)',
  'alt_coal_1': 'Coal (Biomass)',
  'alt_coal_2': 'Coal (Charcoal)',
  'alt_enrichedcoal': 'Enriched Coal',
  'alt_computer_1': 'Computer (OC)',
  'alt_computer_2': 'Computer (Caterium)',
  'alt_coolingdevice': 'Cooling Device (Alt)',
  'alt_highspeedconnector': 'High-Speed Connector (Alt)',
  'alt_crystaloscillator': 'Crystal Oscillator (Alt)',
  'alt_heatsink_1': 'Heat Sink (Alt)',
  'alt_highspeedwiring': 'High-Speed Wiring',
  'alt_nuclearfuelrod_1': 'Nuclear Fuel Rod (Alt)',
  'alt_uraniumcell_1': 'Uranium Cell (Alt)',
  'alt_fertileuranium': 'Fertile Uranium',
  'alt_plutoniumfuelunit': 'Plutonium Fuel Unit',
  'alt_ocsupercomputer': 'OC Supercomputer',
  'alt_superstatecomputer': 'Super-State Computer',
  'alt_radiocontrolsystem': 'Radio Control System (Alt)',
  'alt_radiocontrolunit_1': 'Radio Control Unit (Alt)',
  'alt_flexibleframework': 'Flexible Framework',
  'alt_automatedminer': 'Automated Miner',
  'alt_polyesterfabric': 'Polyester Fabric',
  'alt_recycledrubber': 'Recycled Rubber',
  'alt_plasticsmartplating': 'Plastic Smart Plating',
  'alt_turbopressuremotor': 'Turbo Pressure Motor',
  'alt_turbomotor_1': 'Turbo Motor (Alt)',
  'alt_silica': 'Silica (Alt)',
  'alt_purequartzcrystal': 'Pure Quartz Crystal',
  'alt_dilutedpackagedfuel': 'Diluted Packaged Fuel',
  'alt_molded_beam': 'Molded Beam',
  'alt_aluminum_beam': 'Aluminum Beam',
  'alt_iron_pipe': 'Iron Pipe',
  'alt_molded_steel_pipe': 'Molded Steel Pipe',
  'alt_darkionfuel': 'Dark-Ion Fuel',
  'alt_nitrorocketfuel': 'Nitro Rocket Fuel',
  'alt_leachedcateriumingot': 'Leached Caterium Ingot',
  'alt_temperedcateriumingot': 'Tempered Caterium Ingot',
  // Variant recipes (non-alt, but different from primary)
  'residualrubber': 'Residual Rubber',
  'residualplastic': 'Residual Plastic',
  'residualfuel': 'Residual Fuel',
  'unpackagefuel': 'Unpackage Fuel',
  'unpackagenitricacid': 'Unpackage Nitric Acid',
  'unpackageoil': 'Unpackage Oil',
  'unpackageoilresidue': 'Unpackage Heavy Oil Residue',
  'unpackageturbofuel': 'Unpackage Turbofuel',
  'unpackagealumina': 'Unpackage Alumina Solution',
  'unpackagebiofuel': 'Unpackage Liquid Biofuel',
  'unpackagenitrogen': 'Unpackage Nitrogen Gas',
  'unpackagesulfuricacid': 'Unpackage Sulfuric Acid',
  'unpackagewater': 'Unpackage Water',
  'unpackagerocketfuel': 'Unpackage Rocket Fuel',
  'unpackageionizedfuel': 'Unpackage Ionized Fuel',
  // Collision fixes: default recipes that share the same item name
  'purealuminumingot': 'Pure Aluminum Ingot',
  'ingotaluminum': 'Aluminum Ingot (Standard)',
  'protein_stinger': 'Alien Protein (Stinger)',
  'protein_spitter': 'Alien Protein (Spitter)',
  'protein_hog': 'Alien Protein (Hog)',
  'protein_crab': 'Alien Protein (Crab)',
  'biomass_alienprotein': 'Biomass (Alien Protein)',
  'biomass_mycelia': 'Biomass (Mycelia)',
  'biomass_leaves': 'Biomass (Leaves)',
  'biomass_wood': 'Biomass (Wood)',
  'powercrystalshard_1': 'Power Shard (1x)',
  'powercrystalshard_2': 'Power Shard (2x)',
  'powercrystalshard_3': 'Power Shard (5x)',
  'cartridgechaos': 'Turbo Rifle Ammo',
  'cartridgechaos_packaged': 'Turbo Rifle Ammo (Packaged)',
};

function getEdgeColor(category) {
  return CATEGORY_COLORS[category] || '#4a5a75';
}

export function isAlternateRecipe(recipe) {
  return recipe.id && recipe.id.startsWith('alt_');
}

export function getRecipeDisplayName(recipe) {
  if (recipe.recipeName) return recipe.recipeName;
  if (ALT_RECIPE_NAMES[recipe.id]) return ALT_RECIPE_NAMES[recipe.id];
  if (recipe.id && isAlternateRecipe(recipe)) {
    const base = recipe.id.replace('alt_', '');
    return base.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  return recipe.item || 'Default';
}

export function getRecipesForItem(itemName, recipes) {
  return recipes.filter(r => getRecipeItem(r) === itemName);
}

export function findRecipe(itemName, recipes, selectedRecipeName) {
  const recipesForItem = recipes.filter(r => getRecipeItem(r) === itemName);
  if (recipesForItem.length === 0) return null;
  if (selectedRecipeName) {
    const found = recipesForItem.find(r => getRecipeDisplayName(r) === selectedRecipeName);
    if (found) return found;
  }
  const realRecipes = recipesForItem.filter(r => !isAlternateRecipe(r) && !r.id.startsWith('unpackage'));
  if (realRecipes.length > 0) return realRecipes[0];
  const altRecipes = recipesForItem.filter(r => isAlternateRecipe(r) && !r.id.startsWith('unpackage'));
  if (altRecipes.length > 0) return altRecipes[0];
  return null;
}

export function recipeProducesItem(recipe, itemName) {
  if (getRecipeItem(recipe) === itemName) return true;
  if ((recipe.byproducts || []).some(bp => bp.item === itemName)) return true;
  return false;
}

export function findRecipeProducing(itemName, recipes, selectedRecipeName) {
  const direct = findRecipe(itemName, recipes, selectedRecipeName);
  if (direct) return direct;
  const byproductSources = recipes.filter(r =>
    (r.byproducts || []).some(bp => bp.item === itemName)
  );
  if (byproductSources.length > 0) return byproductSources[0];
  return null;
}

export function getAllProducibleItems(recipes) {
  const seen = new Set();
  const items = [];

  recipes.forEach(r => {
    const main = getRecipeItem(r);
    const isAlt = isAlternateRecipe(r);
    if (main && !seen.has(main) && !isAlt && !r.id.startsWith('unpackage')) {
      seen.add(main);
      items.push({
        item: main,
        output_per_min: r.output_per_min || (r.products?.[0]?.amount_per_min) || 0,
        machine: r.machine || null,
        id: r.id,
        isByproduct: false,
      });
    }
  });

  recipes.forEach(r => {
    const main = getRecipeItem(r);
    const isAlt = isAlternateRecipe(r);
    if (main && !seen.has(main) && isAlt && !r.id.startsWith('unpackage')) {
      seen.add(main);
      items.push({
        item: main,
        output_per_min: r.output_per_min || 0,
        machine: r.machine || null,
        id: r.id,
        isByproduct: false,
      });
    }
  });

  recipes.forEach(r => {
    (r.byproducts || []).forEach(bp => {
      if (bp.item && !seen.has(bp.item)) {
        seen.add(bp.item);
        items.push({
          item: bp.item,
          output_per_min: bp.amount_per_min || 0,
          machine: r.machine || null,
          id: `bp_${r.id}_${bp.item.replace(/\s+/g, '_')}`,
          isByproduct: true,
          sourceRecipe: r.item,
        });
      }
    });
  });

  return items;
}

function getRecipeItem(recipe) {
  if (recipe.item) return recipe.item;
  return recipe.products?.[0]?.item || null;
}

function getOutputAmount(output) {
  return output?.amount_per_min ?? output?.output_per_min ?? output?.amount ?? 0;
}

function getRecipeOutputRate(recipe) {
  if (recipe.output_per_min) return recipe.output_per_min;

  const recipeItem = getRecipeItem(recipe);
  const primaryProduct = recipe.products?.find(product => product.item === recipeItem);
  return getOutputAmount(primaryProduct);
}

function getRecipeByproducts(recipe, scaleFactor, itemsMap) {
  const recipeItem = getRecipeItem(recipe);
  const byproductMap = new Map();
  const outputs = [
    ...(recipe.products || []).filter(product => product.item !== recipeItem),
    ...(recipe.byproducts || []),
  ];

  outputs.forEach(output => {
    if (!output.item) return;
    const amount = getOutputAmount(output) * scaleFactor;
    const current = byproductMap.get(output.item) || 0;
    byproductMap.set(output.item, current + amount);
  });

  return Array.from(byproductMap, ([item, amount]) => {
    const itemMeta = itemsMap[item] || { icon: '\uD83D\uDCE6', category: 'unknown' };
    return {
      item,
      amount,
      baseRate: amount / scaleFactor,
      icon: itemMeta.icon,
      category: itemMeta.category || 'unknown',
    };
  });
}

export function getScaleFactor(recipe, targetAmount) {
  return targetAmount / getRecipeOutputRate(recipe);
}

function accumulateAmounts(item, amount, recipes, pathVisited, amounts, selectedRecipes) {
  if (pathVisited.has(item)) return;
  pathVisited = new Set(pathVisited);
  pathVisited.add(item);

  amounts.set(item, (amounts.get(item) || 0) + amount);

  const recipe = findRecipe(item, recipes, selectedRecipes?.[item]);
  if (!recipe) return;

  const scaleFactor = getScaleFactor(recipe, amount);
  (recipe.ingredients || []).forEach(ing => {
    accumulateAmounts(ing.item, ing.amount_per_min * scaleFactor, recipes, pathVisited, amounts, selectedRecipes);
  });
}

function buildGraph(item, amount, parentId, nodeIdPrefix, recipes, itemsMap, amounts, nodeMap, edges, edgeSet, edgeHandleIdx, selectedRecipes) {
  let entry = nodeMap.get(item);
  const recipe = findRecipe(item, recipes, selectedRecipes?.[item]);
  const isRawResource = RAW_RESOURCES.includes(item);

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

    const allRecipesForItem = getRecipesForItem(item, recipes);
    const availableRecipes = allRecipesForItem.map(r => ({
      recipeName: getRecipeDisplayName(r),
      isAlternate: isAlternateRecipe(r),
    }));
    const activeRecipe = recipe ? getRecipeDisplayName(recipe) : null;

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
        baseRate: recipe ? getRecipeOutputRate(recipe) : 0,
        scaleFactor: totalScaleFactor,
        isRawResource,
        byproductCount: 0,
        userOverride: null,
        satisfied: false,
        overflowing: false,
        inputCount: 0,
        outputCount: 0,
        availableRecipes,
        activeRecipe,
      },
    };

    entry = { nodeId, node };
    nodeMap.set(item, entry);

    if (!isRawResource && recipe) {
      const sf = getScaleFactor(recipe, totalAmount);

      const byproducts = getRecipeByproducts(recipe, sf, itemsMap);
      if (byproducts.length > 0) {
        entry.node.data.byproductCount = byproducts.length;

        byproducts.forEach((byproduct, i) => {
          const bpNodeId = `${nodeId}_bp_${byproduct.item.replace(/\s+/g, '_')}`;
          const bpEdgeId = `edge_${nodeId}_${bpNodeId}`;

          if (!edgeSet.has(bpEdgeId)) {
            edgeSet.add(bpEdgeId);

            const bpNode = {
              id: bpNodeId,
              type: 'byproductNode',
              position: { x: 0, y: 0 },
              data: {
                itemName: byproduct.item,
                icon: byproduct.icon,
                category: byproduct.category,
                requiredAmount: byproduct.amount,
                standardAmount: byproduct.amount,
                satisfied: false,
                overflowing: false,
                userOverride: null,
              },
            };

            nodeMap.set(bpNodeId, { nodeId: bpNodeId, node: bpNode });

            const bpEdgeColor = byproduct.category ? getEdgeColor(byproduct.category) : '#c084fc';

            edges.push({
              id: bpEdgeId,
              source: nodeId,
              target: bpNodeId,
              sourceHandle: `byproduct-source-${i}`,
              targetHandle: 'target-0',
              type: 'default',
              animated: false,
              data: { flowRate: byproduct.amount, category: byproduct.category, isByproduct: true, edgeColor: bpEdgeColor },
              style: { stroke: bpEdgeColor, strokeWidth: 2, opacity: 0.6 },
              markerEnd: { type: 'arrowclosed', width: 14, height: 14, color: bpEdgeColor },
              label: `${byproduct.item} ${byproduct.amount % 1 === 0 ? byproduct.amount.toString() : byproduct.amount.toFixed(3).replace(/\.?0+$/, '')}/dk`,
              labelStyle: { fill: '#e2e8f0', fontWeight: 600, fontSize: 13, fontFamily: 'Share Tech Mono, monospace' },
              labelBgStyle: { fill: '#0a0e1a' },
              labelBgPadding: [6, 3],
              labelBgBorderRadius: 4,
            });
          }
        });
      }

      (recipe.ingredients || []).forEach(ing => {
        const ingAmount = ing.amount_per_min * sf;
        const remainder = consumeFromByproducts(ing.item, ingAmount, nodeId, nodeIdPrefix, nodeMap, edges, edgeSet, edgeHandleIdx);
        if (remainder > 0) {
          buildGraph(ing.item, remainder, nodeId, nodeIdPrefix, recipes, itemsMap, amounts, nodeMap, edges, edgeSet, edgeHandleIdx, selectedRecipes);
        }
      });
    }
  }

  if (parentId && entry) {
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
        label: `${item} ${amount % 1 === 0 ? amount.toString() : amount.toFixed(3).replace(/\.?0+$/, '')}/dk`,
        labelStyle: { fill: '#e2e8f0', fontWeight: 600, fontSize: 13, fontFamily: 'Share Tech Mono, monospace' },
        labelBgStyle: { fill: '#0a0e1a' },
        labelBgPadding: [6, 3],
        labelBgBorderRadius: 4,
      });
    }
  }
}

function consumeFromByproducts(itemName, neededAmount, parentNodeId, nodeIdPrefix, nodeMap, edges, edgeSet, edgeHandleIdx) {
  let remaining = neededAmount;

  for (const [key, val] of nodeMap.entries()) {
    if (key.startsWith(nodeIdPrefix) && val.node.type === 'byproductNode' && val.node.data.itemName === itemName) {
      const bpAmount = val.node.data.requiredAmount;
      if (bpAmount <= 0) continue;

      const usedAmount = Math.min(remaining, bpAmount);
      if (usedAmount <= 0) continue;

      remaining -= usedAmount;
      val.node.data.requiredAmount -= usedAmount;

      const edgeId = `edge_bp_${val.nodeId}_${parentNodeId}`;
      if (!edgeSet.has(edgeId)) {
        edgeSet.add(edgeId);

        const sourceIdx = (edgeHandleIdx.source.get(val.nodeId) || 0);
        edgeHandleIdx.source.set(val.nodeId, sourceIdx + 1);
        const targetIdx = (edgeHandleIdx.target.get(parentNodeId) || 0);
        edgeHandleIdx.target.set(parentNodeId, targetIdx + 1);

        const bpEdgeColor = val.node.data.category ? getEdgeColor(val.node.data.category) : '#c084fc';

        edges.push({
          id: edgeId,
          source: val.nodeId,
          target: parentNodeId,
          sourceHandle: `source-${sourceIdx}`,
          targetHandle: `target-${targetIdx}`,
          type: 'default',
          animated: false,
          data: { flowRate: usedAmount, category: val.node.data.category, isByproduct: true, edgeColor: bpEdgeColor },
          style: { stroke: bpEdgeColor, strokeWidth: 2, opacity: 0.7, strokeDasharray: '6 3' },
          markerEnd: { type: 'arrowclosed', width: 14, height: 14, color: bpEdgeColor },
          label: `${itemName} ${usedAmount % 1 === 0 ? usedAmount.toString() : usedAmount.toFixed(3).replace(/\.?0+$/, '')}/dk`,
          labelStyle: { fill: '#c084fc', fontWeight: 600, fontSize: 13, fontFamily: 'Share Tech Mono, monospace' },
          labelBgStyle: { fill: '#0a0e1a' },
          labelBgPadding: [6, 3],
          labelBgBorderRadius: 4,
        });
      }

      if (remaining <= 0) break;
    }
  }

  return remaining;
}

export function buildProductionTree(targetItem, targetAmount, recipes, itemsMap, options = {}) {
  const { nodeIdPrefix = 'tree', selectedRecipes = {} } = options;

  const amounts = new Map();
  accumulateAmounts(targetItem, targetAmount, recipes, new Set(), amounts, selectedRecipes);

  const nodeMap = new Map();
  const edges = [];
  const edgeSet = new Set();
  const edgeHandleIdx = { source: new Map(), target: new Map() };

  buildGraph(targetItem, targetAmount, null, nodeIdPrefix, recipes, itemsMap, amounts, nodeMap, edges, edgeSet, edgeHandleIdx, selectedRecipes);

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
