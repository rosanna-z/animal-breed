import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initailizeTwoTables, dragAndDrop } from "./slices/breedsSlice";
import axios from "axios";
import Error from "./Error";
import Button from "./Button";
import "./App.css";

const API = "https://dog.ceo/api/breeds/list/all";

const App = () => {
  const dispatch = useDispatch();
  const { tableOneBreeds, tableTwoBreeds, error } = useSelector(
    (state) => state.breeds
  );

  // Upon first render, get data from API & initialize two tables
  useEffect(() => {
    const getBreedsData = async () => {
      const response = await axios.get(API);
      return dispatch(initailizeTwoTables(response.data.message));
    };
    getBreedsData();
  }, [dispatch]);

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/index", e.target.dataset.index);
    e.dataTransfer.setData("text/table", e.target.dataset.table);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropEndIndex = e.target.dataset.index;
    const dropEndTable = e.target.dataset.table;
    const dragStartIndex = e.dataTransfer.getData("text/index");
    const dragStartTable = e.dataTransfer.getData("text/table");
    dispatch(
      dragAndDrop({
        dragStart: {
          index: dragStartIndex,
          table: dragStartTable,
        },
        dropEnd: {
          index: dropEndIndex,
          table: dropEndTable,
        },
      })
    );
  };

  return (
    <div className="App">
      {error && <Error />}
      <div className="table">
        <table>
          <thead>
            <tr className="table-header">
              <th>Rank</th>
              <th>Breed 1</th>
            </tr>
          </thead>
          <tbody>
            {tableOneBreeds.map((breed, index) => (
              <tr
                key={breed}
                data-index={index}
                data-table="1"
                draggable="true"
                onDrop={handleDrop}
                onDragStart={handleDragStart}
                onDragOver={(e) => e.preventDefault()}
              >
                <td data-index={index} data-table="1">
                  {index + 1}
                </td>
                <td data-index={index} data-table="1">
                  {breed}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <table>
          <thead>
            <tr className="table-header">
              <th>Rank</th>
              <th>Breed 2</th>
            </tr>
          </thead>
          <tbody>
            {tableTwoBreeds.map((breed, index) => (
              <tr
                key={breed}
                data-index={index}
                data-table="2"
                draggable="true"
                onDrop={handleDrop}
                onDragStart={handleDragStart}
                onDragOver={(e) => e.preventDefault()}
              >
                <td data-index={index} data-table="2">
                  {index + 1}
                </td>
                <td data-index={index} data-table="2">
                  {breed}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <Button />
    </div>
  );
};

export default App;
