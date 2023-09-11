import { useMemo, useState } from "react";
import { Column, Id, Task } from "../../types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PlusIcon from "../icons/PlusIcon";
import { Optionicon } from "../icons/Optionicon";
import TaskCard from "./TaskCard";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
interface Props {
    column: Column;
    deleteColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string) => void;

    createTask: (columnId: Id) => void;
    deleteTask: (id: Id) => void;
    updateTask: (id: Id, content: string) => void;
    tasks: Task[];
}

function ColumnContainer(props: Props) {
    const { column, deleteColumn, updateColumn, createTask, tasks, deleteTask,updateTask} = props;
    const [editMode, setEditMode] = useState(false);
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const numberTask = useMemo(() =>{return tasks.length},[tasks]);

    const tasksIds = useMemo(() =>{return tasks.map(task => task.id)},[tasks]);
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } =useSortable({
         id: column.id, 
         data: { 
            type: "Column", 
            column
        },
        disabled: editMode,
    })
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }
    if(isDragging){
        return <div ref={setNodeRef}
        style={style} className="
        bg-columnBackgroundColor
        w-[350px]
        h-[500px]
        opacity-40
      
        max-h-[500px]
        rounded-md
        flex
        flex-col
        "></div>
    }
 
  return <div
    ref={setNodeRef}
    style={style}
    className="
    bg-columnBackgroundColor
    w-[350px]
    h-[500px]
    max-h-[500px]
    rounded-md
    flex
    flex-col
    "
  >
    <div
    {...attributes}
    {...listeners}
    onClick={() => {
        setEditMode(true);
        setMouseIsOver(false);
    }}
    onMouseEnter={() => setMouseIsOver(true)}
        onMouseLeave={() => setMouseIsOver(false)}
    className="
    bg-mainBackgroundColor
    text-md
    h-[60px]
    cursor-grab
    rounded-md
    rounded-b-none
    p-3
    font-bold
    border-columnBackgroundColor
    border-4
    flex
    items-center
    justify-between
    "
    >
        
    <div className="flex gap-2">
        <div 
        
        className="
        flex
        justify-center
        items-center
        bg-columnBackgroundColor
        px-2
        py-1
        text-sm
        rounded-full
        ">
            {numberTask}</div>    
        
        {!editMode && column.title}
        {editMode && <input
        className="bg-black focus:border-rose-500 border rounded oultine-none px-2"
        value={column.title} 
        onChange={(e) => updateColumn(column.id,e.target.value)}
        autoFocus 
        onBlur={()=>{
            setEditMode(false);
        }}
        onKeyDown={(e) => {
            if(e.key !== "Enter") return;
            setEditMode(false);
            
        }}
        />}
        </div>
        {mouseIsOver &&(<>
        <Dropdown className="bg-mainBackgroundColor  border border-gray-800">
      <DropdownTrigger  >
        <Button  className="stroke-gray-300 hover:stroke-white bg-transparent
          hover:bg-columnBackgroundColor rounded px-1 py-2"
         >
        
          <Optionicon/>
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" >
        <DropdownItem key="delete" className="text-danger " color="danger"  onClick={() => {
            deleteColumn(column.id);
        }}>
          Eliminar Sección
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
        </>
        )}
    </div>    
    

    <div className="flex flex-grow flex-col gap-4 p-2
    overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
        {tasks.map((task) => (
            <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask}/>
            
        ))}
        </SortableContext>
    </div>
    <button className="flex gap-2 items-center border-columnBackgroundColor
    border-2 rounded-md p-4 border-x-columnBackgroundColor 
    hover:bg-mainBackgroundColor  active:bg-black"
    onClick={() => {
        createTask(column.id);
    }}
    >
        <PlusIcon/>
        Añadir Tarea
    </button>
  </div>;
}

export default ColumnContainer