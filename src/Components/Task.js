import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import Chip from "@mui/material/Chip";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import DateAdapter from "@mui/lab/AdapterMoment";
import moment from "moment";
import Autocomplete from "@mui/material/Autocomplete";
import sytemLabels from "../data/systemLabels";
import TextField from "@mui/material/TextField";

const getItemStyle = (isDragging, draggableStyle) => ({
  ...draggableStyle,
  userSelect: "none",
  background: isDragging ? "#eafdff" : "#fff",
  color: "black",
});

function Task({ task, index, deleteTask }) {
  const [labels] = useState(sytemLabels);

  const handleDeleteTask = () => {
    deleteTask(index);
  };

  const deleteLabel = (label, index) => {
    const newLabelsArray = [...taskLabels];
    newLabelsArray.splice(index, 1);
    setTaskLabels(newLabelsArray);
  };

  const [taskDeadline, setTaskDeadline] = useState(task.deadline);
  // use to control the open state of the calendar
  const [openC, setOpenC] = useState(false);

  const [taskLabels, setTaskLabels] = useState(task.labels);
  // use to control the open state of the Label selectors
  const [openL, setOpenL] = useState(false);

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          className="app-task"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          <div onClick={() => handleDeleteTask()} className="app-close">
            <DeleteForeverIcon color="action" fontSize={"10px"} />
          </div>
          <p style={{ marginTop: "22px" }}>{task.title}</p>
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DatePicker
              value={taskDeadline}
              open={openC}
              onOpen={() => setOpenC(true)}
              onClose={() => setOpenC(false)}
              onChange={(newValue) => {
                const date = moment(newValue, ["YYYY-MM-DD"]).utc().format();
                setTaskDeadline(date);
              }}
              renderInput={({ inputRef, inputProps, InputProps }) => (
                <div
                  style={{ marginTop: "10px", marginBottom: "15px" }}
                  className="app-task-form-deadline"
                >
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
          {!openL && (
            <div className="app-task-labels">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {task.labels &&
                  taskLabels.map((label, index) => {
                    return (
                      <div key={index} className="app-task-label">
                        <Chip
                          label={label.title || label}
                          color="primary"
                          style={{
                            backgroundColor: label.color && label.color,
                          }}
                          onDelete={() => deleteLabel(label, index)}
                        />
                      </div>
                    );
                  })}
                <div onClick={() => setOpenL(true)} className="app-labels-add">
                  <AddIcon color="action" />
                </div>
              </div>
            </div>
          )}
          {openL && (
            <Autocomplete
              style={{}}
              multiple
              fullWidth
              freeSolo
              open={openL}
              onOpen={() => setOpenL(true)}
              onClose={() => setOpenL(false)}
              size="small"
              limitTags={2}
              id="multiple-limit-tags2"
              options={labels}
              value={taskLabels}
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
          )}
        </div>
      )}
    </Draggable>
  );
}

export default Task;
