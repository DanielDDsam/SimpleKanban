import { Column, Id, Task } from "../../types";
import { createPortal } from "react-dom";
import PlusIcon from "../icons/PlusIcon";
import LogOutIcon from "../icons/LogOutIcon";

import { useState, useMemo, useEffect} from "react";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverEvent, PointerSensor, useSensor,useSensors } from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";
import { DragStartEvent } from "@dnd-kit/core";
import { DragOverlay } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import {sendTaskToFirestore, getTasksForCurrentUser, updateTaskInFirestore,updateTaskColumnIdInFirestore,deleteTaskFromFirestore} from "../../firebase/kanbanFirebase";
import { useAuth } from '../../context/authContext';

import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";

const KanbanBoard = () => {
    const auth = useAuth();
    const {uid, displayName} = auth.user;
    const [columns, setColumns] = useState<Column[]>([
        {
            id: 1,
            title: "POR HACER",
        },
        {
            id: 2,
            title: "EN PROGRESO",
        },
        {
            id: 3,
            title: "LISTO ",
        },
    ]);
    const columnsId = useMemo(()=> columns.map((col) =>col.id),[columns]);

    const [tasks, setTasks] = useState<Task[]>([]);
    useEffect(() => {
        // Dentro de un efecto, llama a la función para obtener las tareas.
        console.log(tasks)
        }, [tasks]);    

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);

    const [activeTask,setActiveTask] = useState<Task | null>(null);
    useEffect(() => {
        // Dentro de un efecto, llama a la función para obtener las tareas.
        const fetchTasks = async () => {
          const userTasks = await getTasksForCurrentUser(uid);
          setTasks(userTasks);
        };
    
        // Llama a la función para cargar las tareas cuando el componente se monte.
        fetchTasks();
      }, []); 
      const fetchTasks = async () => {
        const userTasks = await getTasksForCurrentUser(uid);
        setTasks(userTasks);
      };
  
      // Llama a la función para cargar las tareas cuando el componente se monte.
     
    const sensors = useSensors(
        useSensor(PointerSensor,{
            activationConstraint: {
                distance: 3,
        }
        }));

    const createNewColumn = () => {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Columna ${columns.length + 1}`,
        };
        setColumns([...columns, columnToAdd]);
    };
    const generateId = () => {
        return Math.floor(Math.random() * 10001);
    };
    const deleteColumn = (id: Id) => {
        const filteredColumns = columns.filter((col) => col.id !== id);
        setColumns(filteredColumns);
        const newTasks = tasks.filter((task) => task.columnId !== id);
        setTasks(newTasks);
    } 
    const onDragStart = (event: DragStartEvent) => {
        console.log("DRAG START",event);  
        if(event.active.data.current?.type === "Column"){
            setActiveColumn(event.active.data.current.column);
            return;
        }
        if(event.active.data.current?.type === "Task"){
            setActiveTask(event.active.data.current.task);
            return;
        }
    }
    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);
    
        const { active, over } = event;
        if (!over) return;
    
        const activeId = active.id;
        const overId = over.id;
    
        if (activeId === overId) return;
    
        const isActiveAColumn = active.data.current?.type === "Column";
        if (!isActiveAColumn) return;
    
        console.log("DRAG END");
    
        setColumns((columns) => {
          const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
    
          const overColumnIndex = columns.findIndex((col) => col.id === overId);
    
          return arrayMove(columns, activeColumnIndex, overColumnIndex);
        });
      }
    
    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;
    
        const activeId = active.id;
        const overId = over.id;
    
        if (activeId === overId) return;
    
        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";
    
        if (!isActiveATask) return;
    
        // Im dropping a Task over another Task
        if (isActiveATask && isOverATask) {
          setTasks((tasks) => {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const overIndex = tasks.findIndex((t) => t.id === overId);
            
            if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
              // Fix introduced after video recording
              tasks[activeIndex].columnId = tasks[overIndex].columnId;
              updateTaskColumnIdInFirestore(tasks[activeIndex].id,  tasks[overIndex].columnId);
              return arrayMove(tasks, activeIndex, overIndex - 1);
            }
            console.log(tasks)
            return arrayMove(tasks, activeIndex, overIndex);
          });
          console.log(tasks)
        }
    
        const isOverAColumn = over.data.current?.type === "Column";
    
        // Im dropping a Task over a column
        if (isActiveATask && isOverAColumn) {
          setTasks((tasks) => {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
    
            tasks[activeIndex].columnId = overId;
            updateTaskColumnIdInFirestore(tasks[activeIndex].id, overId);
                
            console.log("DROPPING TASK OVER COLUMN", { activeIndex });
            return arrayMove(tasks, activeIndex, activeIndex);
          });
        }
      }
    const updateColumn = (id: Id, title: string) => {
        const newColumns = columns.map((col) => {
            if (col.id !== id) return col;
            return {...col, title};
        });
        setColumns(newColumns);
    }
    const createTask = (columnId: Id) => {
        const newTask: Task = {
            id: generateId(),
            columnId,
            content: `Tarea ${tasks.length + 1}`,
            uid: uid, 
        };
        setTasks([...tasks, newTask]);
        sendTaskToFirestore(newTask);
        fetchTasks();
    }   
    const deleteTask = (id: Id) => {
        const filteredTasks = tasks.filter((task) => task.id !== id);
        setTasks(filteredTasks);
        deleteTaskFromFirestore(id);
    } 
    
    const updateTask = (id: Id, content: string) => {
        
       
        const newTasks = tasks.map((task) => {
            if (task.id !== id) return task;
            return {...task, content};
        });
        const updatedTask = newTasks.find((task) => task.id === id);
        setTasks(newTasks);
        updateTaskInFirestore(updatedTask);
    }
    
    return(
        <div
            className="
            m-auto
            flex
            min-h-screen
            w-full
            items-center
            justify-center
            overflow-x-auto
            overflow-y-hidden
            px-[40px]
            flex-col

            "
        >
            <DndContext 
            onDragStart={onDragStart} 
            onDragEnd={onDragEnd}
            sensors={sensors}
            onDragOver={onDragOver}
            >
            <div >
                
            </div>
           
            <div className="m-auto flex flex-col gap-4">
            <div className="flex flex-row gap-4 items-center">
                <h1 className="text-xl font-bold text-gray-200">{displayName}</h1>
                <Dropdown className="bg-mainBackgroundColor  border border-gray-800">
      <DropdownTrigger  >
        <Button  
        
        className="stroke-gray-300 hover:stroke-white bg-transparent
          bg-columnBackgroundColor rounded px-1 py-2"
         >
        <LogOutIcon/>
         
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" >
        <DropdownItem key="logout" className=" " color="danger" onClick={() => {localStorage.removeItem("user"); auth.logout(); window.location.reload()}} >
          Cerrar Sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
                
            </div>
            
                <div className="flex gap-4 ">
                
                    <SortableContext items={columnsId}>
                   
                    {columns.map((col) => (
                        <ColumnContainer key={col.id} column={col} deleteColumn=
                        {deleteColumn}
                        updateColumn={updateColumn}
                        createTask={createTask}
                        tasks={tasks.filter((task) => task.columnId === col.id)}
                        deleteTask={deleteTask}
                        updateTask={updateTask}
                        />
                    ))}
                    </SortableContext>
                </div>
                {/*
                <button 
                    onClick={()=>{
                        createNewColumn();
                    }}
                    className="
                    h-[60px]
               
                
                    cursor-pointer
                    rounded-lg
                    bg-mainBackgroundColor
                    border-2
                    border-columnBackgroundColor
                    p-4
                    ring-rose-500
                    hover:ring-2
                    flex
                    gap-2
                    ">
                    <PlusIcon />
               
                </button>
                */}
            </div>
            {createPortal(
            <DragOverlay>
                {activeColumn && (
                    <ColumnContainer column={activeColumn} 
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    createTask={createTask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
                    
                    />
                )}
                {
                    activeTask && <TaskCard task = {activeTask} deleteTask={deleteTask} updateTask={updateTask}/>
                }
            </DragOverlay>,
            document.body
            )}
            </DndContext>
        </div>
    );
}

export default KanbanBoard;