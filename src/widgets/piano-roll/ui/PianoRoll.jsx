import { useEffect, useRef, useState } from "react";
import { clamp, formatCents, formatTime, roundTo } from "../../../shared/lib/format";
import { SNAP_SECONDS, getBarMarks } from "../../../entities/note";
import { isBlackKey } from "../../../entities/note";

export function PianoRoll({
  notes,
  pitchRows,
  selectedId,
  tool,
  totalDuration,
  currentTime,
  onSelect,
  onClearSelection,
  onSeek,
  onEditStart,
  onEditEnd,
  onPreviewNote,
  onCommitNote,
  onSplitNoteAt,
  onDeleteNote
}) {
  const gridRef = useRef(null);
  const dragRef = useRef(null);
  const callbacksRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const [hoverTime, setHoverTime] = useState(null);

  callbacksRef.current = { onEditStart, onEditEnd, onPreviewNote, onSplitNoteAt };

  useEffect(() => {
    if (draggingId === null) return undefined;

    function handlePointerMove(event) {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (Math.abs(dx) < 2 && Math.abs(dy) < 2) return;

      if (!drag.edited) {
        drag.edited = true;
        callbacksRef.current.onEditStart();
      }

      if (drag.mode === "resize") {
        const delta = (dx / drag.width) * drag.duration;
        const nextDuration = clamp(
          drag.original.duration + delta,
          0.2,
          drag.duration - drag.original.start
        );
        callbacksRef.current.onPreviewNote(drag.noteId, {
          duration: roundTo(nextDuration, SNAP_SECONDS)
        });
        return;
      }

      const deltaTime = (dx / drag.width) * drag.duration;
      const nextStart = clamp(
        drag.original.start + deltaTime,
        0,
        drag.duration - drag.original.duration
      );
      const rowDelta = Math.round(dy / drag.rowHeight);
      const nextRow = clamp(drag.original.row + rowDelta, 0, drag.pitchRows.length - 1);
      callbacksRef.current.onPreviewNote(drag.noteId, {
        start: roundTo(nextStart, SNAP_SECONDS),
        row: nextRow,
        pitch: drag.pitchRows[nextRow]
      });
    }

    function finishDrag() {
      const wasEditing = Boolean(dragRef.current?.edited);
      dragRef.current = null;
      setDraggingId(null);
      if (wasEditing) callbacksRef.current.onEditEnd?.();
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", finishDrag);
    window.addEventListener("pointercancel", finishDrag);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", finishDrag);
      window.removeEventListener("pointercancel", finishDrag);
    };
  }, [draggingId]);

  function timeFromClientX(clientX, element) {
    const rect = element.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    return ratio * totalDuration;
  }

  function handleGridPointerDown(event) {
    if (event.target.closest?.(".note-block")) return;
    onClearSelection();
    onSeek(timeFromClientX(event.clientX, event.currentTarget));
    setHoverTime(null);
  }

  function handleRulerPointerDown(event) {
    onSeek(timeFromClientX(event.clientX, event.currentTarget));
  }

  function handlePointerMoveOnGrid(event) {
    if (dragRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    setHoverTime(ratio * totalDuration);
  }

  function beginInteraction(event, note, mode) {
    if (event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();
    onSelect(note.id);

    if (tool === "split") {
      onSplitNoteAt(note.id, timeFromClientX(event.clientX, gridRef.current));
      return;
    }

    if (tool === "select" && mode !== "resize") return;

    const grid = gridRef.current;
    if (!grid) return;
    const rect = grid.getBoundingClientRect();
    dragRef.current = {
      noteId: note.id,
      mode: tool === "resize" ? "resize" : mode,
      startX: event.clientX,
      startY: event.clientY,
      original: { ...note },
      width: rect.width,
      rowHeight: rect.height / pitchRows.length,
      duration: totalDuration,
      pitchRows,
      edited: false
    };
    setDraggingId(note.id);
  }

  function handleNoteKeyDown(event, note) {
    const maxStart = Math.max(0, totalDuration - note.duration);
    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      onDeleteNote(note.id);
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      onCommitNote(note.id, {
        start: roundTo(clamp(note.start + direction * 0.1, 0, maxStart), SNAP_SECONDS)
      });
      return;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const direction = event.key === "ArrowUp" ? -1 : 1;
      const row = clamp(note.row + direction, 0, pitchRows.length - 1);
      onCommitNote(note.id, { row, pitch: pitchRows[row] });
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(note.id);
    }
  }

  const marks = getBarMarks(totalDuration);

  return (
    <div className="piano-roll">
      <div className="roll-ruler-row">
        <div className="ruler-corner">
          <span>COMPÁS</span>
          <span className="mono">4/4</span>
        </div>
        <div
          className="ruler-track"
          onPointerDown={handleRulerPointerDown}
          role="slider"
          aria-label="Posición temporal"
          aria-valuemin={0}
          aria-valuemax={Math.round(totalDuration)}
          aria-valuenow={Math.round(currentTime)}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") onSeek(clamp(currentTime + 0.5, 0, totalDuration));
            if (event.key === "ArrowLeft") onSeek(clamp(currentTime - 0.5, 0, totalDuration));
          }}
        >
          {marks.map((mark) => (
            <span
              key={mark.index}
              className={`ruler-mark ${mark.left >= 99.9 ? "at-end" : ""}`}
              style={{ left: `${mark.left}%` }}
            >
              <strong>{mark.index}</strong>
              <small className="mono">{formatTime(mark.time)}</small>
            </span>
          ))}
          {hoverTime !== null && (
            <span className="ruler-hover-time mono" style={{ left: `${(hoverTime / totalDuration) * 100}%` }}>
              {formatTime(hoverTime)}
            </span>
          )}
          <span
            className="ruler-playhead"
            style={{ left: `${(currentTime / totalDuration) * 100}%` }}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="roll-body">
        <div className="piano-keys" aria-hidden="true">
          {pitchRows.map((pitch) => (
            <div
              key={pitch}
              className={`piano-key ${isBlackKey(pitch) ? "is-black" : "is-white"} ${
                pitch.startsWith("C") ? "is-c" : ""
              }`}
            >
              <span>{pitch}</span>
            </div>
          ))}
        </div>

        <div
          className="roll-grid"
          ref={gridRef}
          onPointerDown={handleGridPointerDown}
          onPointerMove={handlePointerMoveOnGrid}
          onPointerLeave={() => setHoverTime(null)}
        >
          <div className="piano-rows" aria-hidden="true">
            {pitchRows.map((pitch) => (
              <div key={pitch} className={`piano-row ${isBlackKey(pitch) ? "is-black" : ""}`} />
            ))}
          </div>
          <div className="grid-lines" aria-hidden="true" />

          {notes.map((note) => (
            <div
              key={note.id}
              className={`note-block ${selectedId === note.id ? "note-selected" : ""} ${
                note.corrected ? "note-corrected" : ""
              } ${draggingId === note.id ? "is-dragging" : ""}`}
              role="button"
              tabIndex={0}
              aria-pressed={selectedId === note.id}
              style={{
                top: `calc(${note.row} * var(--row-h))`,
                left: `${(note.start / totalDuration) * 100}%`,
                width: `${(note.duration / totalDuration) * 100}%`
              }}
              onPointerDown={(event) => beginInteraction(event, note, "move")}
              onKeyDown={(event) => handleNoteKeyDown(event, note)}
              onFocus={() => onSelect(note.id)}
              title={`${note.pitch} · ${formatCents(note.cents)} cents · ${formatTime(note.start)}`}
            >
              <span className="note-pitch">{note.pitch}</span>
              <span className={`note-cents mono ${note.corrected ? "is-clean" : ""}`}>
                {formatCents(note.cents)}
              </span>
              <span className="sr-only">
                {" "}cents · {note.duration.toFixed(2)} segundos
              </span>
              <span
                className="note-resize-handle"
                onPointerDown={(event) => beginInteraction(event, note, "resize")}
                aria-hidden="true"
              />
            </div>
          ))}

          <span
            className="roll-playhead"
            style={{ left: `${(currentTime / totalDuration) * 100}%` }}
            aria-hidden="true"
          >
            <i />
          </span>

          {hoverTime !== null && (
            <span
              className="roll-hover-line"
              style={{ left: `${(hoverTime / totalDuration) * 100}%` }}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </div>
  );
}
