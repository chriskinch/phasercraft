import React from "react";

import { useDragLayer } from "react-dnd";
import LootIcon from "@components/LootIcon";

interface Offset {
  x: number;
  y: number;
}

// Keep inline styles for dynamic positioning - transform values change on every render
// based on real-time mouse/drag position, making Styled JSX impractical here
const getItemStyles = (initialOffset: Offset | null, currentOffset: Offset | null): React.CSSProperties => {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }
  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
};

const CustomDragLayer: React.FC = () => {
  const { isDragging, item, initialOffset, currentOffset } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  const renderItem = () => {
    return <LootIcon {...item} />;
  };
  
  if (!isDragging) {
    return null;
  }
  
  return (
    <div className="drag-layer">
      <div style={getItemStyles(initialOffset, currentOffset)}>
        {renderItem()}
      </div>
      <style jsx>{`
        .drag-layer {
          position: fixed;
          pointer-events: none;
          z-index: 100;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default CustomDragLayer;