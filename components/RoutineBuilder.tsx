import React, { useState, useCallback } from 'react';
import { RoutineTask, TaskFormData } from '../types';
import TaskItem from './TaskItem';
import TaskFormModal from './TaskFormModal';
import { generateICSContent, downloadICSFile } from '../services/calendarService';
import { PlusIcon } from './icons/PlusIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { SparklesIcon } from './icons/SparklesIcon'; // New Icon

interface RoutineBuilderProps {
  tasks: RoutineTask[];
  onAddTask: (taskData: Omit<RoutineTask, 'id' | 'color'>) => void;
  onUpdateTask: (task: RoutineTask) => void;
  onDeleteTask: (taskId: string) => void;
  onLoadTemplate: () => void;
  onReorderTasks: (draggedItemId: string, targetItemId: string | null) => void;
}

const RoutineBuilder: React.FC<RoutineBuilderProps> = ({ 
  tasks, onAddTask, onUpdateTask, onDeleteTask, onLoadTemplate, onReorderTasks 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<RoutineTask | null>(null);
  const [draggedOverTargetId, setDraggedOverTargetId] = useState<string | null>(null);

  const openModalForNew = useCallback(() => {
    setEditingTask(null);
    setIsModalOpen(true);
  }, []);

  const openModalForEdit = useCallback((task: RoutineTask) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTask(null);
  }, []);

  const handleSaveTask = useCallback((formData: TaskFormData) => {
    if (editingTask && formData.id) {
      onUpdateTask({ ...formData, id: formData.id, color: editingTask.color });
    } else {
      const { id, ...newTaskData } = formData;
      onAddTask(newTaskData);
    }
    closeModal();
  }, [editingTask, onAddTask, onUpdateTask, closeModal]);

  const handleDownloadICS = useCallback(() => {
    if (tasks.length === 0) {
      alert("Please add some tasks to your routine before exporting.");
      return;
    }
    const icsContent = generateICSContent(tasks);
    downloadICSFile(icsContent, 'daily_routine.ics');
  }, [tasks]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, targetId: string | null) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOverTargetId(targetId);
  };
  
  const handleDragLeave = () => {
    setDraggedOverTargetId(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string | null) => {
    e.preventDefault();
    const draggedItemId = e.dataTransfer.getData('taskId');
    if (draggedItemId && draggedItemId !== targetId) { // Prevent dropping on itself if targetId is a task
      onReorderTasks(draggedItemId, targetId);
    }
    setDraggedOverTargetId(null);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-slate-200 gap-4">
        <h2 className="text-2xl font-semibold text-slate-700">Your Daily Schedule</h2>
        <div className="flex flex-wrap space-x-0 sm:space-x-3 gap-2 sm:gap-0">
          <button
            onClick={onLoadTemplate}
            className="flex items-center bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out"
          >
            <SparklesIcon className="h-5 w-5 mr-2" />
            Load Template
          </button>
          <button
            onClick={openModalForNew}
            className="flex items-center bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Task
          </button>
          <button
            onClick={handleDownloadICS}
            disabled={tasks.length === 0}
            className="flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <DownloadIcon className="h-5 w-5 mr-2" />
            Download (.ics)
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div 
          className="text-center py-10 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300"
          onDragOver={(e) => handleDragOver(e, null)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, null)} // Allow dropping into empty list
        >
          <InformationCircleIcon className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-500 text-lg">Your routine is empty.</p>
          <p className="text-slate-400">Click "Add Task", "Load Template", or drag a task here to start!</p>
        </div>
      ) : (
        <div className="space-y-1"> {/* Reduced space for tighter packing of drop targets */}
          {tasks.map(task => (
            <div
              key={task.id}
              onDragOver={(e) => handleDragOver(e, task.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, task.id)}
              className={`rounded-lg ${draggedOverTargetId === task.id ? 'ring-2 ring-sky-400 ring-offset-0' : ''}`}
            >
              <TaskItem
                task={task}
                onEdit={() => openModalForEdit(task)}
                onDelete={() => onDeleteTask(task.id)}
                onDragStart={(e) => handleDragStart(e, task.id)}
                // isDraggedOver={draggedOverTargetId === task.id} // Alternative styling inside TaskItem
              />
            </div>
          ))}
          {/* Drop zone at the end of the list */}
           <div
            onDragOver={(e) => handleDragOver(e, null)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, null)}
            className={`mt-2 py-4 text-center text-sm rounded-lg border-2 border-dashed
                        ${draggedOverTargetId === null && tasks.length > 0 ? 'border-sky-400 bg-sky-50' : 'border-slate-300 hover:border-slate-400'}
                        transition-colors duration-150 ease-in-out`}
            aria-label="Drop task at the end of the routine"
          >
            {draggedOverTargetId === null && tasks.length > 0 ? 'Drop here to move to end' : 'Move task to end'}
          </div>
        </div>
      )}

      {isModalOpen && (
        <TaskFormModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveTask}
          initialData={editingTask}
        />
      )}
    </div>
  );
};

export default RoutineBuilder;
