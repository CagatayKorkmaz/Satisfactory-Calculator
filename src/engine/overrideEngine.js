/**
 * overrideEngine.js
 * Aşama 3: Dinamik geri beslemeli hesaplama algoritması.
 *
 * Kullanıcı bir düğüme "elimdeki miktar" değeri girdiğinde,
 * o düğümün ve bağlı alt düğümlerin ihtiyaçlarını yeniden hesaplar.
 *
 * Formül: Yeni İhtiyaç = max(0, Standart İhtiyaç - Kullanıcının Elindeki Miktar)
 */

/**
 * Bir node'un durumunu override değerine göre belirler.
 * @param {number} standardAmount - Standart gereken miktar
 * @param {number|null} userOverride - Kullanıcının elindeki miktar
 * @returns {{ newRequired: number, satisfied: boolean, overflowing: boolean, shortage: number }}
 */
export function computeNodeStatus(standardAmount, userOverride) {
  if (userOverride === null || userOverride === undefined || isNaN(userOverride)) {
    return {
      newRequired: standardAmount,
      satisfied: false,
      overflowing: false,
      shortage: standardAmount,
    };
  }

  const shortage = Math.max(0, standardAmount - userOverride);
  const satisfied = shortage === 0;
  const overflowing = userOverride > standardAmount;

  return {
    newRequired: shortage,
    satisfied,
    overflowing,
    shortage,
  };
}

/**
 * Tüm node listesine override değerlerini uygular.
 * Her node'un `requiredAmount` ve durum flag'leri güncellenir.
 *
 * @param {Array} nodes - ReactFlow node listesi
 * @param {Array} edges - ReactFlow edge listesi
 * @param {Object} userOverrides - { [itemName]: overrideValue }
 * @returns {{ nodes: Array, edges: Array }} Güncellenmiş node ve edge listesi
 */
export function applyOverrides(nodes, edges, userOverrides) {
  // Her node'u override değerine göre güncelle
  const updatedNodes = nodes.map(node => {
    const override = userOverrides[node.data.itemName];
    const overrideValue = override !== undefined ? Number(override) : null;

    const status = computeNodeStatus(
      node.data.standardAmount,
      overrideValue
    );

    return {
      ...node,
      data: {
        ...node.data,
        userOverride: overrideValue,
        requiredAmount: status.newRequired,
        satisfied: status.satisfied,
        overflowing: status.overflowing,
        shortage: status.shortage,
      },
      className: [
        status.satisfied ? 'satisfied' : '',
        status.overflowing ? 'overflow' : '',
      ].filter(Boolean).join(' '),
    };
  });

  // Edge'leri de güncelle (satisfied/overflow durumlarına göre)
  const nodeMap = Object.fromEntries(updatedNodes.map(n => [n.id, n]));

  const updatedEdges = edges.map(edge => {
    const sourceNode = nodeMap[edge.source];
    if (!sourceNode) return edge;

    const isSatisfied = sourceNode.data.satisfied;
    const isOverflow = sourceNode.data.overflowing;

    const edgeColor = edge.data?.edgeColor || '#4a5a75';

    return {
      ...edge,
      animated: isSatisfied || isOverflow,
      className: isSatisfied ? 'satisfied' : isOverflow ? 'overflow' : '',
      data: {
        ...edge.data,
        satisfied: isSatisfied,
        overflow: isOverflow,
      },
      style: {
        stroke: isSatisfied ? '#22c55e'
          : isOverflow ? '#00d4ff'
          : edgeColor,
        strokeWidth: isSatisfied || isOverflow ? 2.5 : 2,
        opacity: 0.6,
        filter: isSatisfied
          ? 'drop-shadow(0 0 6px #22c55e)'
          : isOverflow
          ? 'drop-shadow(0 0 6px #00d4ff)'
          : 'none',
      },
    };
  });

  return { nodes: updatedNodes, edges: updatedEdges };
}

/**
 * Tüm ağaçtaki toplam kaynak ihtiyaçlarını hesaplar (özet için).
 * @param {Array} nodes
 * @returns {Object} { [itemName]: { required, standard, satisfied, overflowing } }
 */
export function computeSummary(nodes) {
  const summary = {};

  nodes.forEach(node => {
    const { itemName, requiredAmount, standardAmount, satisfied, overflowing, isRawResource } = node.data;

    if (!summary[itemName]) {
      summary[itemName] = {
        required: 0,
        standard: 0,
        satisfied,
        overflowing,
        isRawResource: isRawResource || false,
      };
    }

    summary[itemName].required += requiredAmount || 0;
    summary[itemName].standard += standardAmount || 0;
  });

  return summary;
}
