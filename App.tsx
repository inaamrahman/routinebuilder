import React, { useState, useCallback, useEffect } from 'react';
import { RoutineTask, TaskFormData, TemplateTaskItem } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import RoutineBuilder from './components/RoutineBuilder';
import { TASK_COLORS, DEFAULT_TASK_COLOR, PRODUCTIVITY_TEMPLATE_TASKS, DEFAULT_START_TIME } from './constants';
import { timeToMinutes, minutesToTime, addMinutesToTime } from './services/timeUtils';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<RoutineTask[]>(() => {
    const savedTasks = localStorage.getItem('routineTasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Ensure tasks have valid time formats, could add more validation
        if (Array.isArray(parsedTasks) && parsedTasks.every(task => 
            typeof task.startTime === 'string' && typeof task.endTime === 'string' &&
            /^\d{2}:\d{2}$/.test(task.startTime) && /^\d{2}:\d{2}$/.test(task.endTime)
        )) {
          return parsedTasks;
        }
      } catch (e) {
        console.error("Failed to parse tasks from localStorage", e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('routineTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((newTaskData: Omit<RoutineTask, 'id' | 'color'>) => {
    setTasks(prevTasks => {
      const newColorIndex = prevTasks.length % TASK_COLORS.length;
      const newTask: RoutineTask = {
        ...newTaskData,
        id: crypto.randomUUID(),
        color: TASK_COLORS[newColorIndex] || DEFAULT_TASK_COLOR,
      };
      const updatedTasks = [...prevTasks, newTask];
      updatedTasks.sort((a, b) => a.startTime.localeCompare(b.startTime));
      return updatedTasks;
    });
  }, []);

  const updateTask = useCallback((updatedTaskData: RoutineTask) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === updatedTaskData.id ? updatedTaskData : task
      );
      updatedTasks.sort((a, b) => a.startTime.localeCompare(b.startTime));
      return updatedTasks;
    });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }, []);

  const loadTemplateTasks = useCallback(() => {
    let currentTime = DEFAULT_START_TIME;
    const templateGeneratedTasks: RoutineTask[] = PRODUCTIVITY_TEMPLATE_TASKS.map((templateTask, index) => {
      const startTime = currentTime;
      const endTime = addMinutesToTime(startTime, templateTask.durationMinutes);
      currentTime = endTime; // Next task starts when this one ends

      return {
        id: crypto.randomUUID(),
        title: templateTask.title,
        startTime,
        endTime,
        description: templateTask.description || '',
        color: TASK_COLORS[index % TASK_COLORS.length] || DEFAULT_TASK_COLOR,
      };
    });
    // Optional: Confirm with user before replacing tasks
    // if (window.confirm("Loading a template will replace your current routine. Are you sure?")) {
    //   setTasks(templateGeneratedTasks);
    // }
    setTasks(templateGeneratedTasks);
  }, []);

  const handleReorderTasks = useCallback((draggedItemId: string, targetItemId: string | null) => {
    setTasks(currentTasks => {
      const draggedItemIndex = currentTasks.findIndex(t => t.id === draggedItemId);
      if (draggedItemIndex === -1) return currentTasks;

      const itemBeingDragged = { ...currentTasks[draggedItemIndex] };
      
      // Store original durations of all tasks before reordering
      const tasksWithOriginalDurations = currentTasks.map(t => {
        const startMins = timeToMinutes(t.startTime);
        const endMins = timeToMinutes(t.endTime);
        let duration = endMins - startMins;
        if (duration <= 0) duration = 60; // Fallback for invalid/zero duration
        return { ...t, originalDurationMinutes: duration };
      });
      
      const draggedItemWithDuration = tasksWithOriginalDurations.find(t=> t.id === draggedItemId)!;

      let reorderedTasksArray = tasksWithOriginalDurations.filter(t => t.id !== draggedItemId);

      if (targetItemId === null) { // Dropped at the end
        reorderedTasksArray.push(draggedItemWithDuration);
      } else {
        const targetIndex = reorderedTasksArray.findIndex(t => t.id === targetItemId);
        if (targetIndex !== -1) {
          reorderedTasksArray.splice(targetIndex, 0, draggedItemWithDuration);
        } else { // Fallback: if target somehow not found, append
          reorderedTasksArray.push(draggedItemWithDuration);
        }
      }

      // Recalculate all times sequentially
      let cumulativeTimeInMinutes = timeToMinutes(DEFAULT_START_TIME); // Start the day at default time
      const finalTasks = reorderedTasksArray.map(task => {
        const newStartTimeStr = minutesToTime(cumulativeTimeInMinutes);
        const newEndTimeStr = minutesToTime(cumulativeTimeInMinutes + task.originalDurationMinutes);
        
        cumulativeTimeInMinutes += task.originalDurationMinutes;

        // Create a new object without originalDurationMinutes for the final state
        const { originalDurationMinutes, ...finalTask } = task;
        return {
          ...finalTask,
          startTime: newStartTimeStr,
          endTime: newEndTimeStr,
        };
      });
      return finalTasks;
    });
  }, []);


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 to-sky-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <RoutineBuilder
          tasks={tasks}
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onLoadTemplate={loadTemplateTasks}
          onReorderTasks={handleReorderTasks}
        />
      </main>
      <Footer />
    </div>
  );
};

export default App;
