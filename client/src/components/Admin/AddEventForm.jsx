import { useState } from "react";
import moment from "moment";

export default function AddEventForm({ onAddEvent }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(moment());
  const [end, setEnd] = useState(moment());

  function handleSubmit(event) {
    event.preventDefault();
    const newEvent = {
      title,
      start,
      end,
    };
    onAddEvent(newEvent);
    setTitle("");
    setStart(moment());
    setEnd(moment());
  }

  return (
    <div className="addEventForm">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div>
          <label>Inicio:</label>
          <input
            type="datetime-local"
            value={start.format("YYYY-MM-DDTHH:mm:ss")}
            onChange={(event) => setStart(moment(event.target.value))}
          />
        </div>
        <div>
          <label>Fin:</label>
          <input
            type="datetime-local"
            value={end.format("YYYY-MM-DDTHH:mm:ss")}
            onChange={(event) => setEnd(moment(event.target.value))}
          />
        </div>
        <button type="submit">Agregar evento</button>
      </form>
    </div>
  );
}
