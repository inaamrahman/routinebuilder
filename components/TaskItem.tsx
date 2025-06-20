import React, { useState } from 'react';
import { RoutineTask } from '../types';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ClockIcon } from './icons/ClockIcon';

interface TaskItemProps {
  task: RoutineTask;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  // isDraggedOver?: boolean; // Can be used for more specific styling if needed
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onDragStart }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStartInternal = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    onDragStart(e); // Propagate to parent
  };

  const handleDragEndInternal = () => {
    setIsDragging(false);
  };

  return (
    <div 
      draggable="true"
      onDragStart={handleDragStartInternal}
      onDragEnd={handleDragEndInternal}
      className={`p-4 rounded-lg shadow-md flex items-start space-x-4 ${task.color} text-white relative overflow-hidden transition-opacity duration-150 ${isDragging ? 'opacity-50 border-2 border-dashed border-white' : 'opacity-100'} cursor-grab`}
      aria-grabbed={isDragging}
      role="listitem"
    >
      <div className={`absolute -left-4 -top-4 opacity-20 ${task.color.replace('400','600')} w-16 h-16 rounded-full`}></div>
      <div className={`absolute -right-5 -bottom-5 opacity-15 ${task.color.replace('400','600')} w-20 h-20 rounded-full`}></div>
      
      <div className="flex-shrink-0 pt-1">
         <div className={`p-2 rounded-full ${task.color.replace('400','500')} shadow-inner`}>
            <ClockIcon className="h-6 w-6 text-white" />
         </div>
      </div>

      <div className="flex-grow z-10">
        <h3 className="text-xl font-semibold">{task.title}</h3>
        <p className="text-sm opacity-90">
          {task.startTime} - {task.endTime}
        </p>
        {task.description && (
          <p className="mt-1 text-sm opacity-80 whitespace-pre-wrap">{task.description}</p>
        )}
      </div>
      <div className="flex-shrink-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 z-10">
        <button
          onClick={onEdit}
          className={`p-2 rounded-md ${task.color.replace('400','600')} hover:opacity-80 transition duration-150`}
          aria-label={`Edit task: ${task.title}`}
        >
          <EditIcon className="h-5 w-5 text-white" />
        </button>
        <button
          onClick={onDelete}
          className={`p-2 rounded-md ${task.color.replace('400','600')} hover:opacity-80 transition duration-150`}
          aria-label={`Delete task: ${task.title}`}
        >
          <TrashIcon className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
