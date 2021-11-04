import { useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import initialState from "./data/initialData";
import Column from "./Components/Column";
import "./App.css";
import TextField from "@mui/material/TextField";

function App() {
  const [state, setState] = useState(initialState);
  const [newColumn, setNewColumn] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  const createNewColumn = (e) => {
    e.preventDefault();
    if (newColumn !== "") {
      const newItem = {
        id: `C${state.length + 1}`,
        columnName: newColumn,
        tasks: [],
      };
      const newState = [...state, newItem];
      setState(newState);
      setNewColumn("");
    }
    setIsFormVisible(false);
  };

  const renameColumn = (updatedColumn, index) => {
    const newState = [...state];
    newState[index] = updatedColumn;
    setState(newState);
  };

  const addTask = (newTask, index) => {
    const newState = [...state];
    let columnTasks = newState[index].tasks;
    columnTasks = [newTask, ...columnTasks];
    newState[index].tasks = columnTasks;
    setState(newState);
  };

  const deleteColumn = (columnIndex) => {
    const newState = [...state];
    newState.splice(columnIndex, 1);
    setState(newState);
  };

  const deleteColumnTask = (columnIndex, taskIndex) => {
    const newState = [...state];
    let columnTasks = newState[columnIndex].tasks;
    columnTasks.splice(taskIndex, 1);
    newState[columnIndex].tasks = columnTasks;
    setState(newState);
  };

  const onDragEnd = (result) => {
    const { draggableId, source, destination, type } = result;
    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (type === "main-droppable") {
      const newOrderedColumns = Array.from(state);
      const removedItem = newOrderedColumns.splice(source.index, 1);
      newOrderedColumns.splice(destination.index, 0, ...removedItem);
      setState(newOrderedColumns);
      return;
    }

    // The new state to be returned
    const newState = [...state];
    const startColumn = state.find((c) => c.id == source.droppableId);
    const endColumn = state.find((c) => c.id == destination.droppableId);

    if (startColumn.id === endColumn.id) {
      const draggableItem = startColumn.tasks.find((t) => t.id == draggableId);

      const reoderedTasks = Array.from(startColumn.tasks);
      reoderedTasks.splice(source.index, 1);
      reoderedTasks.splice(destination.index, 0, draggableItem);

      const newColumn = {
        ...startColumn,
        tasks: reoderedTasks,
      };

      newState[state.findIndex((c) => c.id == source.droppableId)] = newColumn;
    } else {
      const draggableItem = startColumn.tasks.find((t) => t.id == draggableId);

      const destinationReoderedTasks = Array.from(
        endColumn.tasks ? endColumn.tasks : []
      ); // Array of task For the destination column
      const sourceReoderedTasks = Array.from(startColumn.tasks); // Array of task For the source column

      destinationReoderedTasks.splice(destination.index, 0, draggableItem);
      sourceReoderedTasks.splice(source.index, 1);

      /* set the tasks array on source and destination columns */
      const destinationNewColumn = {
        ...endColumn,
        tasks: destinationReoderedTasks,
      };
      const sourceNewColumn = {
        ...startColumn,
        tasks: sourceReoderedTasks,
      };

      /* update the source and destination columns of the new state */
      newState[state.findIndex((c) => c.id == destination.droppableId)] =
        destinationNewColumn;
      newState[state.findIndex((c) => c.id == source.droppableId)] =
        sourceNewColumn;
    }

    setState(newState);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="main-droppable"
        direction="horizontal"
        type="main-droppable"
      >
        {(provided, snapshot) => (
          <div className="App">
            <h1>Kanban Board</h1>
            <hr className="separator" />
            <main
              className="App-main"
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                backgroundColor: snapshot.isDraggingOver ? "#fbf9f9" : "#fff",
                height: snapshot.isDraggingOver ? "100vh" : "auto",
                borderRadius: snapshot.isDraggingOver ? "10px" : "0",
              }}
            >
              {state &&
                state.map((column, index) => {
                  const tasks = column.tasks;
                  return (
                    <Column
                      key={column.id}
                      column={column}
                      tasks={tasks}
                      index={index}
                      renameColumn={renameColumn}
                      addTask={addTask}
                      deleteColumnTask={deleteColumnTask}
                      deleteColumn={deleteColumn}
                    />
                  );
                })}
              {provided.placeholder}
              {state && state.length < 4 && !isFormVisible && (
                <div
                  onClick={() => setIsFormVisible(true)}
                  className="app-column-add app-column-btn"
                >
                  Add a new column{" "}
                  <em style={{ fontSize: "25px", marginLeft: "5px" }}> + </em>
                </div>
              )}
              {isFormVisible && (
                <form
                  onSubmit={(e) => createNewColumn(e)}
                  onBlur={(e) => createNewColumn(e)}
                >
                  <TextField
                    id="outlined-basic"
                    label="Column name"
                    variant="filled"
                    size="small"
                    defaultValue={newColumn}
                    onChange={(e) => setNewColumn(e.target.value)}
                    style={{ margin: "10px" }}
                    autoFocus={true}
                  />
                </form>
              )}
            </main>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default App;
