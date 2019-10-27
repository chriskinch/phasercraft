import React from "react"
import "styled-components/macro"
import { useDragLayer } from "react-dnd"
import LootIcon from "../atoms/LootIcon"

const getItemStyles = (initialOffset, currentOffset) => {
    // console.log(initialOffset, currentOffset);
    if (!initialOffset || !currentOffset) {
        return {
            display: 'none',
        }
    }
    let { x, y } = currentOffset
    const transform = `translate(${x}px, ${y}px)`
    return {
        transform,
        WebkitTransform: transform,
    }
}

const CustomDragLayer = (props) => {
  const { itemType, isDragging, item, initialOffset, currentOffset } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

const renderItem = () => {
    switch (itemType) {
        case "amulet":
        case "body":
        case "helm":
        case "weapon":
            return <LootIcon {...item} />
      default:
        return null
    }
  }
  if (!isDragging) {
    return null
  }
  return (
    <div css={`
        position: fixed;
        pointer-events: none;
        z-index: 100;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    `}>
      <div style={getItemStyles(initialOffset, currentOffset/*, props.snapToGrid*/)}>
        {renderItem()}
      </div>
    </div>
  )
}
export default CustomDragLayer
