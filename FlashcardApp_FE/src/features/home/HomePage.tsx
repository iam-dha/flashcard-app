import { useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

import { Droppable } from "./Droppable";
import { Draggable } from "./Draggable";
import { Button } from "@/components/ui/button";

// export default function HomePage() {
//   const containers: string[] = ["A", "B", "C"];
//   const draggables = ["a", "b", "c"];

//   const [parents, setParents] = useState<Record<string, string | null>>({
//     a: null,
//     b: null,
//     c: null,
//   });

//   function handleDragEnd(event: DragEndEvent): void {
//     const { active, over } = event;
//     const draggedId = active.id as string;

//     setParents((prev) => ({
//       ...prev,
//       [draggedId]: over ? (over.id as string) : null,
//     }));
//   }

//   const createDraggableMarkup = (id: string) => (
//     <Draggable key={id} id={id}>
//       <Button>{id}</Button>
//     </Draggable>
//   );

//   return (
//     <div>
//       <h1 className="pb-6 text-2xl font-bold">Drag and drop demo for Word Scramble game</h1>
//       <DndContext onDragEnd={handleDragEnd}>
//         {/* Render draggables that are not in any container */}
//         <div className="mb-4 flex gap-2">{draggables.map((id) => (parents[id] === null ? createDraggableMarkup(id) : null))}</div>
//         {/* Render containers */}
//         {containers.map((containerId) => (
//           <div key={containerId} className="mb-2 flex items-center">
//             <span className="mr-2">Container {containerId}:</span>
//             <div className="border-2 border-dashed border-gray-300 text-gray-500">
//               <Droppable id={containerId}>
//                 {draggables.filter((dragId) => parents[dragId] === containerId).map((dragId) => createDraggableMarkup(dragId))}
//                 {draggables.every((dragId) => parents[dragId] !== containerId) && <div className="h-10 w-10"></div>}
//               </Droppable>
//             </div>
//           </div>
//         ))}
//       </DndContext>
//     </div>
//   );
// }

export default function HomePage() {
  return (
    <div>
      <h1 className="pb-6 text-2xl font-bold">Home Page</h1>
    </div>
  );
}