import React, { useState, useEffect } from "react";
import { axiosWithAuth } from './../utils/axiosWithAuth';

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [colorToAdd, setColorToAdd] = useState(initialColor);

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = e => {
    e.preventDefault();
    axiosWithAuth()
      .put(`http://localhost:5000/api/colors/${colorToEdit.id}`, colorToEdit)
      .then(res => {
        const updatedList = colors.map(color => {
          if(color.id === colorToEdit.id) {
            return res.data
          } else {
            return color
          }
        })
        updateColors(updatedList);
      })
      .catch(err => console.log(err.response));
    setEditing(false);
  };

  const deleteColor = color => {
    axiosWithAuth()
      .delete(`http://localhost:5000/api/colors/${color.id}`)
      .then(res => {
        const updatedList = colors.filter(item => item.id !== color.id);
        updateColors(updatedList);
      })
      .catch(err => console.log(err.response));
  };

  const addColor = e => {
    e.preventDefault();
    axiosWithAuth()
      .post(`http://localhost:5000/api/colors`, colorToAdd)
      .then(res => {
        updateColors(res.data);
      })
      .catch(err => console.log(err.response));
  }

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => {
                                          if (adding) setAdding(false);
                                          editColor(color)}}>
            <span>
              <span className="delete" onClick={() => deleteColor(color)}>
                x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      <button onClick={() => {
        if (editing) setEditing(false);
        setAdding(true)}} style={{display: 'block', marginLeft: '40px'}}>+ add</button>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      {adding && 
        <form onSubmit={addColor}>
            <legend>add color</legend>
            <label>
              color name:
              <input
                onChange={e =>
                  setColorToAdd({ ...colorToAdd, color: e.target.value })
                }
                value={colorToAdd.color}
              />
            </label>
            <label>
              hex code:
              <input
                onChange={e =>
                  setColorToAdd({
                    ...colorToAdd,
                    code: { hex: e.target.value }
                  })
                }
                value={colorToAdd.code.hex}
              />
            </label>
            <div className="button-row">
              <button type="submit">add</button>
              <button onClick={() => setEditing(false)}>cancel</button>
            </div>
        </form>
       }
      <div className="spacer" />
      {/* stretch - build another form here to add a color */}
    </div>
  );
};

export default ColorList;
