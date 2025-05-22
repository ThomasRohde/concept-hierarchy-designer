import { useDragLayer } from 'react-dnd';
import { DND_ITEM_TYPE } from '../constants';

export const CustomDragLayer = () => {
  const { isDragging, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !currentOffset) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 100,
        left: currentOffset.x,
        top: currentOffset.y,
      }}
    >
      <div className="custom-drag-indicator"></div>
    </div>
  );
};

export default CustomDragLayer;
