import { useState } from "react";
import { Id, Task } from "../../types";
import Trashicon from "../icons/Trashicon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
interface props {
    task: Task;
    deleteTask: (id: Id) => void;
    updateTask: (id: Id, content: string) => void;
}
function TaskCard({task, deleteTask, updateTask}: props) {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editeMode, setEditMode] = useState(false);
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } =useSortable({
         id: task.id, 
         data: { 
            type: "Task", 
            task,
        },
        disabled: editeMode,
    });
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    const toggleEditMode = () => {
        setEditMode((prev)=>!prev);
        setMouseIsOver(false);
    }
    if(isDragging){
        return <div  ref = {setNodeRef}
        style={style}
        className="
        opacity-30
        bg-mainBackgroundColor p-2.5 h-[100px]
        min-h-[100px] items-center flex text-left rounded-xl
        cursor-grab relative"/>
    }
    if(editeMode){
        return (
            <div 
            ref = {setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-mainBackgroundColor p-2.5 h-[100px]
            min-h-[100px] items-center flex text-left rounded-xl
             cursor-grab relative">
        <textarea className="
        h-[90%]
        w-full resize-none border-none rounded bg-transparent
        text-white focus:outline-none
        "
        value={task.content}
        autoFocus
        placeholder="Escribe una tarea"
        onBlur={toggleEditMode}
        onKeyDown={(e) => {
            if(e.key === "Enter" && e.shiftKey) {
                toggleEditMode();
            }     
        }}
        onChange={(e) => updateTask(task.id, e.target.value)}
        >

        </textarea>
        </div>
        )
    }
  return (
    <div 
    ref = {setNodeRef}
    style={style}
    {...attributes}
    {...listeners}
    onClick={toggleEditMode}
    className="bg-mainBackgroundColor p-2.5 h-[100px]
    min-h-[100px] items-center flex text-left rounded-xl
     cursor-grab relative border-2 border-mainBackgroundColor task"
    onMouseEnter={() => setMouseIsOver(true)}
    onMouseLeave={() => setMouseIsOver(false)}
 >
        <p
        className="my-auto h-[90%] w-full overflow-y-auto overflow-x-auto whitespace-pre-wrap"
        >{task.content}</p>
        
        {mouseIsOver &&(
            <button 
            onClick={() => {
                deleteTask(task.id);
            }}
      
            className="stroke-white absolute right-4 top-1/2
            -translate-y-1/2 bg-columnBackgroundColor p-2 rounded
            opacity-60 hover:opacity-100">
                <Trashicon/>
            </button>
        )}
        
    </div>
  )
}

export default TaskCard