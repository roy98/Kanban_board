import React, { useState } from "react";
import Task from "./Task";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import DateAdapter from "@mui/lab/AdapterMoment";
import sytemLabels from "../data/systemLabels";
import moment from "moment";

function Column({
  column,
  tasks,
  index,
  renameColumn,
  addTask,
  deleteColumnTask,
}) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newColumnName, setNewColumnName] = useState(column.columnName);

  const [showAddNewTask, setShowAddNewTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskLabels, setTaskLabels] = useState();
  const [labels] = useState(sytemLabels);

  // use to control the open state of the calendar
  const [openC, setOpenC] = useState(false);

  const handleColumnNewName = (e) => {
    e.preventDefault();
    if (newColumnName == "") {
      setIsFormVisible(false);
      setNewColumnName(column.columnName);
      return;
    }

    if (newColumnName == column.columnName) {
      setIsFormVisible(false);
      return;
    }

    const updatedItem = {
      id: column.id,
      columnName: newColumnName,
      tasks: tasks,
    };

    renameColumn(updatedItem, index);
    setIsFormVisible(false);
  };

  const handleNewTask = (e) => {
    e.preventDefault();
    if (taskName === "") {
      return;
    }

    const newTask = {
      id: `T${
        Date.now().toString(36) +
        Math.random().toString(36).substr(2) +
        column.id +
        tasks.length +
        1
      }`,
      title: taskName,
      deadline: taskDeadline,
      labels: taskLabels,
    };

    addTask(newTask, index);
    setShowAddNewTask(false);
    resetTaskForm();
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    ...draggableStyle,
    userSelect: "none",
    background: isDragging ? "rgba(40,50,60,0.99)" : "#a9a9a959",
  });

  const closeTaskForm = () => {
    setShowAddNewTask(false);
    resetTaskForm();
  };

  const resetTaskForm = () => {
    setTaskName("");
    setTaskDeadline("");
    setTaskLabels();
  };

  const deleteTask = (taskIndex) => {
    deleteColumnTask(index, taskIndex);
  };

  return (
    <Draggable draggableId={column.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          className="app-column"
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          <div className="app-column-header" {...provided.dragHandleProps}>
            {!isFormVisible ? (
              <h3
                onClick={() => setIsFormVisible(true)}
                className="app-column-title"
              >
                {column.columnName}
              </h3>
            ) : (
              <form
                className="app-column-title"
                onSubmit={(e) => handleColumnNewName(e)}
                onBlur={(e) => handleColumnNewName(e)}
              >
                <TextField
                  id="outlined-basic"
                  variant="filled"
                  size="small"
                  defaultValue={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  autoFocus={true}
                />
              </form>
            )}

            {tasks && tasks.length > 0 && (
              <div className="app-column-task-counter">{tasks.length}</div>
            )}
          </div>
          <div
            onClick={() => setShowAddNewTask(true)}
            className="app-column-add"
          >
            <span>+</span>
          </div>
          {showAddNewTask && (
            <form className="app-new-task" onSubmit={(e) => handleNewTask(e)}>
              <div onClick={() => closeTaskForm()} className="app-close">
                <CloseIcon color="action" fontSize={"10px"} />
              </div>
              <div className="app-task-form">
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  label="Name of the task"
                  size="small"
                  defaultValue={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  autoFocus={true}
                  fullWidth={true}
                  margin="dense"
                  style={{}}
                />
                <LocalizationProvider dateAdapter={DateAdapter}>
                  <DatePicker
                    value={taskDeadline}
                    open={openC}
                    onOpen={() => setOpenC(true)}
                    onClose={() => setOpenC(false)}
                    onChange={(newValue) => {
                      const date = moment(newValue, ["YYYY-MM-DD"])
                        .utc()
                        .format();
                      setTaskDeadline(date);
                    }}
                    renderInput={({ inputRef, inputProps, InputProps }) => (
                      <div className="app-task-form-deadline">
                        {InputProps?.endAdornment}
                        <span
                          onClick={(e) => {
                            setOpenC(true);
                          }}
                          style={{ marginLeft: "10px", fontSize: "15px" }}
                          ref={inputRef}
                        >
                          {taskDeadline
                            ? taskDeadline.split("T")[0]
                            : "Set the deadline"}
                        </span>
                      </div>
                    )}
                  />
                </LocalizationProvider>
                <div className="app-task-form-labels">
                  <LocalOfferIcon color="action" />
                  <Autocomplete
                    multiple
                    fullWidth
                    freeSolo
                    size="small"
                    limitTags={2}
                    id="multiple-limit-tags"
                    options={labels}
                    getOptionLabel={(option) => option.title || option}
                    onChange={(e, value) => setTaskLabels(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="filled"
                        label="Select labels"
                        InputProps={{
                          ...params.InputProps,
                          disableUnderline: true,
                        }}
                      />
                    )}
                  />
                </div>
              </div>
              <div
                onClick={(e) => handleNewTask(e)}
                className="app-new-task-submit"
              >
                <span>Add a new task</span>
              </div>
            </form>
          )}
          <Droppable droppableId={column.id.toString()} type="tasks">
            {(provided, snapshot) => (
              <div
                className="app-column-tasks"
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  background: snapshot.isDraggingOver
                    ? "#a9a9a933"
                    : snapshot.draggingFromThisWith
                    ? "#20b2aa96"
                    : "inherit",
                }}
              >
                {tasks &&
                  tasks.map((task, index) => (
                    <Task
                      deleteTask={deleteTask}
                      key={task.id}
                      task={task}
                      index={index}
                    />
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default Column;
