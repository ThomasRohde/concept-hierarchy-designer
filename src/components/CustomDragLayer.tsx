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
  // Return null instead of the drag indicator
  return null;
};

export default CustomDragLayer;
