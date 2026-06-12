import { useCallback, useRef, useState, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import TextNode from '../nodes/TextNode';
import ProductionRootNode from '../nodes/ProductionRootNode';
import IngredientNode from '../nodes/IngredientNode';
import RawNode from '../nodes/RawNode';
import AddProductionModal from '../modals/AddProductionModal';

import { buildProductionTree, generateTreeId } from '../../engine/recipeEngine';
import { applyOverrides } from '../../engine/overrideEngine';
import { applyLayout, assignClosestHandles } from '../../utils/layout';

const nodeTypes = {
  textNode: TextNode,
  productionRootNode: ProductionRootNode,
  ingredientNode: IngredientNode,
  rawNode: RawNode,
};

export default function SatisfactoryCanvas({ recipesData }) {
  const { recipes = [], items: itemsMap = {} } = recipesData || {};

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [activeFocus, setActiveFocus] = useState(null);

  const overridesRef = useRef({});
  const rfInstanceRef = useRef(null);

  const onConnect = useCallback((params) => {
    setEdges(eds => addEdge({ ...params, type: 'smoothstep', animated: false }, eds));
  }, [setEdges]);

  const handleDeleteNodeRef = useRef(null);
  const handleOverrideChangeRef = useRef(null);

  const handleDeleteNode = useCallback((nodeId) => {
    const parts = nodeId.split('_');
    const prefix = parts.slice(0, 2).join('_');

    setNodes(prev => prev.filter(n => !n.id.startsWith(prefix)));
    setEdges(prev => prev.filter(e =>
      !e.source.startsWith(prefix) && !e.target.startsWith(prefix)
    ));
    delete overridesRef.current[prefix];
  }, [setNodes, setEdges]);

  handleDeleteNodeRef.current = handleDeleteNode;

  const handleOverrideChange = useCallback((nodeId, itemName, value) => {
    const parts = nodeId.split('_');
    const prefix = parts.slice(0, 2).join('_');

    const treeOverrides = { ...(overridesRef.current[prefix] || {}) };
    if (value === null || value === undefined) {
      delete treeOverrides[itemName];
    } else {
      treeOverrides[itemName] = value;
    }
    overridesRef.current[prefix] = treeOverrides;

    setNodes(prevNodes => {
      const treeNodes = prevNodes.filter(n => n.id.startsWith(prefix));

      if (treeNodes.length === 0) return prevNodes;

      setEdges(prevEdges => {
        const treeEdges = prevEdges.filter(e =>
          e.source.startsWith(prefix) || e.target.startsWith(prefix)
        );
        const otherEdges = prevEdges.filter(e =>
          !e.source.startsWith(prefix) && !e.target.startsWith(prefix)
        );

        const { nodes: updatedNodes, edges: updatedEdges } =
          applyOverrides(treeNodes, treeEdges, treeOverrides);

        const withCallbacks = updatedNodes.map(n => ({
          ...n,
          data: {
            ...n.data,
            onOverrideChange: handleOverrideChangeRef.current,
            onDelete: handleDeleteNodeRef.current,
          },
        }));

        setTimeout(() => {
          setNodes(prev => [
            ...prev.filter(n => !n.id.startsWith(prefix)),
            ...withCallbacks,
          ]);
        }, 0);

        return [...otherEdges, ...updatedEdges];
      });

      return prevNodes;
    });
  }, [setNodes, setEdges]);

  handleOverrideChangeRef.current = handleOverrideChange;

  const handleTextNodeChange = useCallback((nodeId, { text, font }) => {
    setNodes(prev => prev.map(n =>
      n.id === nodeId
        ? { ...n, data: { ...n.data, text, font } }
        : n
    ));
  }, [setNodes]);

  const handleAddTextNode = useCallback(() => {
    const id = `text_${Date.now()}`;
    const viewport = rfInstanceRef.current?.getViewport() || { x: 0, y: 0, zoom: 1 };
    const newNode = {
      id,
      type: 'textNode',
      position: {
        x: (-viewport.x + window.innerWidth / 2) / viewport.zoom,
        y: (-viewport.y + window.innerHeight / 2) / viewport.zoom,
      },
      data: {
        text: 'Not ekle...',
        font: 'Excalifont',
        onChange: handleTextNodeChange,
        onDelete: handleDeleteNodeRef.current,
      },
    };
    setNodes(prev => [...prev, newNode]);
  }, [handleTextNodeChange, setNodes]);

  const handleAddProduction = useCallback(({ item, targetAmount }) => {
    const treeId = generateTreeId();
    const viewport = rfInstanceRef.current?.getViewport() || { x: 0, y: 0, zoom: 1 };

    const centerX = (-viewport.x + window.innerWidth / 2) / viewport.zoom;
    const centerY = (-viewport.y + window.innerHeight / 2) / viewport.zoom;

    const { nodes: treeNodes, edges: treeEdges } = buildProductionTree(
      item,
      targetAmount,
      recipes,
      itemsMap,
      { nodeIdPrefix: treeId }
    );

    const laidOutNodes = applyLayout(treeNodes, treeEdges, {
      offsetX: centerX,
      offsetY: centerY,
    });

    const routedEdges = assignClosestHandles(laidOutNodes, treeEdges);

    const nodesWithCallbacks = laidOutNodes.map(n => ({
      ...n,
      data: {
        ...n.data,
        onOverrideChange: handleOverrideChangeRef.current,
        onDelete: handleDeleteNodeRef.current,
      },
    }));

    setNodes(prev => [...prev, ...nodesWithCallbacks]);
    setEdges(prev => [...prev, ...routedEdges]);
  }, [recipes, itemsMap, setNodes, setEdges]);

  const handlePaneContextMenu = useCallback((event) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY });
  }, []);

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  const handleClearCanvas = useCallback(() => {
    if (window.confirm('T\u00fcm canvas temizlensin mi?')) {
      setNodes([]);
      setEdges([]);
      overridesRef.current = {};
    }
  }, [setNodes, setEdges]);

  const handleNodeClick = useCallback((_, node) => {
    setActiveFocus(prev =>
      prev?.type === 'node' && prev?.id === node.id ? null : { type: 'node', id: node.id }
    );
  }, []);

  const handleEdgeClick = useCallback((_, edge) => {
    setActiveFocus(prev =>
      prev?.type === 'edge' && prev?.id === edge.id ? null : { type: 'edge', id: edge.id }
    );
  }, []);

  const handlePaneClick = useCallback(() => {
    setActiveFocus(null);
  }, []);

  const connectedElements = useMemo(() => {
    if (!activeFocus) return null;

    if (activeFocus.type === 'node') {
      const connectedEdges = edges.filter(
        e => e.source === activeFocus.id || e.target === activeFocus.id
      );
      const connectedNodeIds = new Set([activeFocus.id]);
      const connectedEdgeIds = new Set();
      connectedEdges.forEach(e => {
        connectedNodeIds.add(e.source);
        connectedNodeIds.add(e.target);
        connectedEdgeIds.add(e.id);
      });
      return { nodeIds: connectedNodeIds, edgeIds: connectedEdgeIds };
    }

    if (activeFocus.type === 'edge') {
      const edge = edges.find(e => e.id === activeFocus.id);
      if (!edge) return null;
      return {
        nodeIds: new Set([edge.source, edge.target]),
        edgeIds: new Set([activeFocus.id]),
      };
    }

    return null;
  }, [activeFocus, edges]);

  const dimmedNodes = useMemo(() => {
    if (!connectedElements) return null;
    const dimmed = {};
    nodes.forEach(n => {
      if (!connectedElements.nodeIds.has(n.id)) {
        dimmed[n.id] = true;
      }
    });
    return dimmed;
  }, [connectedElements, nodes]);

  const dimmedEdges = useMemo(() => {
    if (!connectedElements) return null;
    const dimmed = {};
    edges.forEach(e => {
      if (!connectedElements.edgeIds.has(e.id)) {
        dimmed[e.id] = true;
      }
    });
    return dimmed;
  }, [connectedElements, edges]);

  const nodesWithDim = useMemo(() => {
    if (!dimmedNodes) return nodes;
    return nodes.map(n => {
      if (dimmedNodes[n.id]) {
        return { ...n, style: { ...n.style, opacity: 0.2 } };
      }
      return { ...n, style: { ...n.style, opacity: 1 } };
    });
  }, [nodes, dimmedNodes]);

  const edgesWithDim = useMemo(() => {
    if (!dimmedEdges) return edges;
    return edges.map(e => {
      const baseStyle = e.style || {};
      if (dimmedEdges[e.id]) {
        return {
          ...e,
          style: { ...baseStyle, opacity: 0.15 },
          labelStyle: { ...e.labelStyle, opacity: 0.15 },
        };
      }
      if (connectedElements?.edgeIds?.has(e.id)) {
        return {
          ...e,
          style: { ...baseStyle, opacity: 1, strokeWidth: 3 },
          labelStyle: { ...e.labelStyle, opacity: 1 },
        };
      }
      return {
        ...e,
        labelStyle: { ...e.labelStyle, opacity: 1 },
      };
    });
  }, [edges, dimmedEdges, connectedElements]);

  return (
    <div style={{ width: '100vw', height: '100vh' }} onClick={closeContextMenu}>
      <ReactFlow
        nodes={nodesWithDim}
        edges={edgesWithDim}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={instance => { rfInstanceRef.current = instance; }}
        nodeTypes={nodeTypes}
        onPaneContextMenu={handlePaneContextMenu}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        fitView={false}
        minZoom={0.1}
        maxZoom={3}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={['Backspace', 'Delete']}
        defaultEdgeOptions={{ type: 'smoothstep' }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.2}
          color="var(--color-border)"
        />
        <Controls />
        <MiniMap
          nodeStrokeColor="var(--color-border-hover)"
          nodeColor={(n) => {
            if (n.type === 'productionRootNode') return '#f0a500';
            if (n.type === 'rawNode') return '#f59e0b';
            if (n.data?.satisfied) return '#22c55e';
            return '#1e2d42';
          }}
          maskColor="rgba(0,0,0,0.6)"
        />
      </ReactFlow>

      {contextMenu && (
        <div
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={e => e.stopPropagation()}
        >
          <div
            className="context-menu-item"
            id="ctx-add-production"
            onClick={() => { closeContextMenu(); setShowAddModal(true); }}
          >
            <span className="icon">🏭</span>
            Üretim Hattı Ekle
          </div>
          <div
            className="context-menu-item"
            id="ctx-add-text"
            onClick={() => { closeContextMenu(); handleAddTextNode(); }}
          >
            <span className="icon">📝</span>
            Not Ekle
          </div>
        </div>
      )}

      {showAddModal && (
        <AddProductionModal
          recipes={recipes}
          itemsMap={itemsMap}
          onConfirm={handleAddProduction}
          onClose={() => setShowAddModal(false)}
        />
      )}

      <div className="toolbar glass-panel">
        <div style={{
          fontSize: 22, marginRight: 4,
          filter: 'drop-shadow(0 0 8px rgba(240,165,0,0.6))'
        }}>
          ⚙️
        </div>
        <span style={{
          fontSize: 14, fontWeight: 700, color: 'var(--color-primary)',
          marginRight: 8, letterSpacing: '-0.02em'
        }}>
          Satisfactory
        </span>
        <div className="toolbar-divider" />
        <button
          id="btn-add-production"
          className="toolbar-btn primary"
          onClick={() => setShowAddModal(true)}
        >
          🏭 Üretim Hattı Ekle
        </button>
        <button
          id="btn-add-text"
          className="toolbar-btn"
          onClick={handleAddTextNode}
        >
          📝 Not Ekle
        </button>
        <div className="toolbar-divider" />
        <button
          id="btn-clear"
          className="toolbar-btn"
          onClick={handleClearCanvas}
          style={{ color: 'var(--color-error)' }}
        >
          🗑️ Temizle
        </button>
      </div>

      {nodes.length === 0 && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 10,
        }}>
          <div style={{ fontSize: 72, marginBottom: 16, opacity: 0.15 }}>⚙️</div>
          <div style={{
            fontSize: 22, fontWeight: 700,
            color: 'var(--color-text-dim)', marginBottom: 10,
          }}>
            Canvas Boş
          </div>
          <div style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
            Üstteki <strong style={{ color: 'var(--color-primary)' }}>Üretim Hattı Ekle</strong> butonuna tıkla<br />
            veya canvas'a <strong style={{ color: 'var(--color-text-dim)' }}>sağ tıkla</strong>
          </div>
        </div>
      )}
    </div>
  );
}
