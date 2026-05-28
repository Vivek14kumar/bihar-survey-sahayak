"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Line,
  Arrow,
  Text,
  Group,
  Image as KonvaImage,
  Transformer,
} from "react-konva";

export default function MapCanvas() {
  const stageRef = useRef();
  const transformerRef = useRef();

  // Tool and Shape State
  const [tool, setTool] = useState("select");
  const [shapes, setShapes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [drawing, setDrawing] = useState(false);

  // Styling & Calibration State
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fillColor, setFillColor] = useState("#3b82f6");
  const [isTransparent, setIsTransparent] = useState(true);
  
  // Scale Calibration: How many pixels equal 1 Foot?
  const [scaleFactor, setScaleFactor] = useState(6); 

  // Handle deselecting
  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const handleMouseDown = (e) => {
    if (tool === "select") {
      checkDeselect(e);
      return;
    }

    const pos = e.target.getStage().getPointerPosition();
    const id = Date.now().toString();
    const activeFill = isTransparent ? null : fillColor;

    if (tool === "rect") {
      setShapes((prev) => [
        ...prev,
        { id, type: "rect", x: pos.x, y: pos.y, width: 0, height: 0, fill: activeFill, stroke: strokeColor, strokeWidth: strokeWidth, rotation: 0 },
      ]);
      setDrawing(true);
    }

    if (tool === "circle") {
      setShapes((prev) => [
        ...prev,
        { id, type: "circle", x: pos.x, y: pos.y, radius: 0, fill: activeFill, stroke: strokeColor, strokeWidth: strokeWidth, rotation: 0 },
      ]);
      setDrawing(true);
    }

    if (tool === "line") {
      setShapes((prev) => [
        ...prev,
        { id, type: "line", points: [pos.x, pos.y, pos.x, pos.y], stroke: strokeColor, strokeWidth: strokeWidth, draggable: true },
      ]);
      setDrawing(true);
    }

    if (tool === "freehand") {
      setShapes((prev) => [
        ...prev,
        { id, type: "freehand", points: [pos.x, pos.y], stroke: strokeColor, strokeWidth: strokeWidth, tension: 0.5, draggable: true },
      ]);
      setDrawing(true);
    }

    // NEW: Dimension Tool Initialization
    if (tool === "dimension") {
      setShapes((prev) => [
        ...prev,
        { id, type: "dimension", points: [pos.x, pos.y, pos.x, pos.y], stroke: strokeColor, strokeWidth: strokeWidth, rotation: 0, x: 0, y: 0 },
      ]);
      setDrawing(true);
    }

    if (tool === "text") {
      setShapes((prev) => [
        ...prev,
        { id, type: "text", x: pos.x, y: pos.y, text: "Double-click to edit", fontSize: 20, fill: strokeColor, draggable: true, rotation: 0 },
      ]);
      setTool("select"); 
    }
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const updatedShapes = [...shapes];
    let lastShape = updatedShapes[updatedShapes.length - 1];

    if (lastShape.type === "rect") {
      lastShape.width = point.x - lastShape.x;
      lastShape.height = point.y - lastShape.y;
    } else if (lastShape.type === "circle") {
      lastShape.radius = Math.max(Math.abs(point.x - lastShape.x), Math.abs(point.y - lastShape.y));
    } else if (lastShape.type === "line" || lastShape.type === "dimension") {
      lastShape.points = [lastShape.points[0], lastShape.points[1], point.x, point.y];
    } else if (lastShape.type === "freehand") {
      lastShape.points = lastShape.points.concat([point.x, point.y]);
    }

    setShapes(updatedShapes);
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.src = reader.result;
      img.onload = () => {
        setShapes((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: "image",
            x: 20,
            y: 20,
            imageObj: img,
            width: img.width > 600 ? 600 : img.width, 
            height: img.width > 600 ? (600 * img.height) / img.width : img.height,
            draggable: true,
            rotation: 0,
          },
        ]);
      };
    };
    reader.readAsDataURL(file);
  };

  // Attach Transformer
  useEffect(() => {
    if (!selectedId) {
      if (transformerRef.current) {
        transformerRef.current.nodes([]);
        transformerRef.current.getLayer().batchDraw();
      }
      return;
    }
    const stage = stageRef.current;
    const selectedNode = stage.findOne(`#${selectedId}`);
    if (selectedNode && transformerRef.current) {
      transformerRef.current.nodes([selectedNode]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedId, shapes]);

  const handleTransformEnd = (e, shapeId) => {
    const node = e.target;
    setShapes((prev) =>
      prev.map((s) => {
        if (s.id === shapeId) {
          return {
            ...s,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: (s.type === "rect" || s.type === "image") ? Math.max(5, node.width() * node.scaleX()) : s.width,
            height: (s.type === "rect" || s.type === "image") ? Math.max(5, node.height() * node.scaleY()) : s.height,
            scaleX: 1,
            scaleY: 1,
          };
        }
        return s;
      })
    );
    node.scaleX(1);
    node.scaleY(1);
  };

  const handleDragEnd = (e, shapeId) => {
    setShapes((prev) =>
      prev.map((s) => (s.id === shapeId ? { ...s, x: e.target.x(), y: e.target.y() } : s))
    );
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setShapes((prev) => prev.filter((shape) => shape.id !== selectedId));
    setSelectedId(null);
  };

  const updateSelectedShape = (property, value) => {
    if (!selectedId) return;
    setShapes((prev) =>
      prev.map((s) => {
        if (s.id === selectedId) {
          if (property === "fill" && isTransparent) return s; 
          return { ...s, [property]: value };
        }
        return s;
      })
    );
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen font-sans">
      
      {/* Primary Toolbar - Drawing Tools */}
      <div className="flex flex-wrap items-center gap-3 mb-2 p-3 bg-white rounded-t-lg shadow-sm border-b border-gray-200">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-md">
          {["select", "freehand", "line", "dimension", "rect", "circle", "text"].map((t) => (
            <button
              key={t}
              onClick={() => setTool(t)}
              className={`px-3 py-1.5 text-sm rounded-md capitalize transition-colors ${
                tool === t ? "bg-indigo-600 text-white shadow" : "hover:bg-gray-200 text-gray-700"
              }`}
            >
              {t === "dimension" ? "📏 Dimension" : t}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        <div>
          <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <label htmlFor="imageUpload" className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md cursor-pointer">
            + Upload Map Reference
          </label>
        </div>

        <button onClick={deleteSelected} className="ml-auto px-3 py-1.5 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-md">Delete Selected</button>
      </div>

      {/* Secondary Toolbar - Styling & Calibration Controls */}
      <div className="flex flex-wrap items-center gap-6 mb-4 p-3 bg-white rounded-b-lg shadow-sm">
        
        {/* Stroke Styling */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-500 uppercase">Color</label>
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => {
              setStrokeColor(e.target.value);
              updateSelectedShape("stroke", e.target.value);
              updateSelectedShape("fill", tool === "text" ? e.target.value : undefined);
            }}
            className="w-7 h-7 cursor-pointer border-0 p-0"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-500 uppercase">Thickness: {strokeWidth}px</label>
          <input
            type="range"
            min="1"
            max="15"
            value={strokeWidth}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setStrokeWidth(val);
              updateSelectedShape("strokeWidth", val);
            }}
            className="w-24 cursor-pointer"
          />
        </div>

        <div className="h-6 w-px bg-gray-300 mx-1"></div>

        {/* Dynamic Scale Calibration Factor */}
        <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100">
          <label className="text-xs font-bold text-indigo-700 uppercase">Scale Calibration:</label>
          <input
            type="range"
            min="1"
            max="20"
            step="0.5"
            value={scaleFactor}
            onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
            className="w-28 cursor-pointer accent-indigo-600"
          />
          <span className="text-xs font-mono font-bold text-indigo-900 w-16">{scaleFactor}px = 1'</span>
        </div>

        <div className="h-6 w-px bg-gray-300 mx-1"></div>

        {/* Fill Control */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-sm cursor-pointer text-gray-700">
            <input 
              type="checkbox" 
              checked={isTransparent} 
              onChange={(e) => {
                setIsTransparent(e.target.checked);
                updateSelectedShape("fill", e.target.checked ? null : fillColor);
              }}
              className="rounded text-black cursor-pointer"
            />
            No Fill
          </label>

          {!isTransparent && (
            <input
              type="color"
              value={fillColor}
              onChange={(e) => {
                setFillColor(e.target.value);
                updateSelectedShape("fill", e.target.value);
              }}
              className="w-7 h-7 cursor-pointer border-0 p-0"
            />
          )}
        </div>
      </div>

      {/* Canvas view area */}
      <div className="flex justify-center w-full overflow-hidden bg-gray-300 p-4 rounded-lg shadow-inner">
        <div className="shadow-xl bg-white">
          <Stage
            width={950}
            height={650}
            ref={stageRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <Layer>
              {shapes.map((shape) => {
                const commonProps = {
                  key: shape.id,
                  id: shape.id,
                  onClick: () => setSelectedId(shape.id),
                  onTap: () => setSelectedId(shape.id),
                };

                if (shape.type === "rect") {
                  return <Rect {...commonProps} x={shape.x} y={shape.y} rotation={shape.rotation} draggable={tool === "select"} onDragEnd={(e) => handleDragEnd(e, shape.id)} onTransformEnd={(e) => handleTransformEnd(e, shape.id)} width={shape.width} height={shape.height} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />;
                }

                if (shape.type === "circle") {
                  return <Circle {...commonProps} x={shape.x} y={shape.y} rotation={shape.rotation} draggable={tool === "select"} onDragEnd={(e) => handleDragEnd(e, shape.id)} onTransformEnd={(e) => handleTransformEnd(e, shape.id)} radius={shape.radius} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />;
                }

                if (shape.type === "line") {
                  return <Line {...commonProps} x={shape.x || 0} y={shape.y || 0} draggable={tool === "select"} onDragEnd={(e) => handleDragEnd(e, shape.id)} points={shape.points} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />;
                }

                if (shape.type === "freehand") {
                  return <Line {...commonProps} x={shape.x || 0} y={shape.y || 0} draggable={tool === "select"} onDragEnd={(e) => handleDragEnd(e, shape.id)} points={shape.points} stroke={shape.stroke} strokeWidth={shape.strokeWidth} tension={shape.tension} lineCap="round" lineJoin="round" />;
                }

                // NEW: Render Engine for Automatic Dimension Lines
                if (shape.type === "dimension") {
                  const [x1, y1, x2, y2] = shape.points;
                  
                  // 1. Math calculation for actual pixel length
                  const pixelLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                  
                  // 2. Convert pixels to human-readable Feet notation matching your survey maps
                  const dynamicFeet = (pixelLength / scaleFactor).toFixed(1) + "'";
                  
                  // 3. Coordinate placement for the text bounding box (midpoint)
                  const mx = (x1 + x2) / 2;
                  const my = (y1 + y2) / 2;
                  
                  // 4. Calculate alignment angle
                  let angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
                  // Normalize angle flips so label text never reads upside down
                  if (angle > 90 || angle < -90) { angle += 180; }

                  return (
                    <Group 
                      {...commonProps} 
                      x={shape.x || 0} 
                      y={shape.y || 0} 
                      rotation={shape.rotation || 0}
                      draggable={tool === "select"} 
                      onDragEnd={(e) => handleDragEnd(e, shape.id)}
                      onTransformEnd={(e) => handleTransformEnd(e, shape.id)}
                    >
                      {/* Double Headed Dimension Arrow */}
                      <Arrow
                        points={[x1, y1, x2, y2]}
                        stroke={shape.stroke}
                        strokeWidth={shape.strokeWidth}
                        pointerLength={9}
                        pointerWidth={7}
                        pointerAtBeginning={true}
                        pointerAtEnding={true}
                        fill={shape.stroke}
                      />
                      {/* Self-Orienting Blueprint Metric Label */}
                      <Text
                        x={mx}
                        y={my}
                        text={dynamicFeet}
                        fontSize={14}
                        fill={shape.stroke}
                        fontStyle="bold"
                        align="center"
                        width={90}
                        offsetX={45} // Perfectly centers bounding box horizontally
                        offsetY={16} // Offsets text upward so it sits parallel cleanly above the arrow line
                        rotation={angle}
                      />
                    </Group>
                  );
                }

                if (shape.type === "text") {
                  return (
                    <Text
                      {...commonProps}
                      x={shape.x}
                      y={shape.y}
                      rotation={shape.rotation}
                      draggable={tool === "select"}
                      onDragEnd={(e) => handleDragEnd(e, shape.id)}
                      onTransformEnd={(e) => handleTransformEnd(e, shape.id)}
                      text={shape.text}
                      fontSize={shape.fontSize}
                      fill={shape.fill}
                      onDblClick={() => {
                        const newText = prompt("Modify Map Label:", shape.text);
                        if (newText) {
                          setShapes((prev) => prev.map((s) => (s.id === shape.id ? { ...s, text: newText } : s)));
                        }
                      }}
                    />
                  );
                }

                if (shape.type === "image") {
                  return <KonvaImage {...commonProps} x={shape.x} y={shape.y} rotation={shape.rotation} draggable={tool === "select"} onDragEnd={(e) => handleDragEnd(e, shape.id)} onTransformEnd={(e) => handleTransformEnd(e, shape.id)} image={shape.imageObj} width={shape.width} height={shape.height} opacity={0.6} />;
                }

                return null;
              })}

              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) return oldBox;
                  return newBox;
                }}
              />
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}