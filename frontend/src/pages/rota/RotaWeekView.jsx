import React, { useState } from "react";
import VisitDrawer from "./VisitDrawer";

const TIME_START = 7; // 07:00
const TIME_END = 24; // 22:00
const TOTAL_MINUTES = (TIME_END - TIME_START) * 60;
const CONTAINER_HEIGHT_PX = 1440;
const PX_PER_MINUTE = CONTAINER_HEIGHT_PX / TOTAL_MINUTES;

const minutesSinceStart = (time) => {
  const [hour, minute] = time.split(":" ).map(Number);
  return (hour - TIME_START) * 60 + minute;
};

const durationInMinutes = (start, end) => {
  const [sh, sm] = start.split(":" ).map(Number);
  const [eh, em] = end.split(":" ).map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
};

const generateTimeLabels = () => {
  const times = [];
  for (let h = TIME_START; h <= TIME_END; h++) {
    times.push(`${h.toString().padStart(2, "0")}:00`);
  }
  return times;
};

const RotaWeekView = ({ visits, clients, employees, onVisitUpdate }) => {
  const [selectedVisit, setSelectedVisit] = useState(null);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const visitsByDay = days.map((day) =>
    visits.filter((v) => {
      const visitDay = new Date(v.date).toLocaleDateString("en-GB", { weekday: "long" });
      return visitDay === day;
    })
  );

  const timeLabels = generateTimeLabels();

  return (
    <div className="relative w-full overflow-x-auto">
      <div className="grid grid-cols-8 border-t">
        {/* LEFT TIME MARKERS */}
        <div className="col-span-1 border-r bg-white relative" style={{ height: `${CONTAINER_HEIGHT_PX}px` }}>
          {timeLabels.map((label, idx) => (
            <div
              key={label}
              className="absolute left-0 text-xs text-gray-500 px-2"
              style={{ top: `${(idx * 60) * PX_PER_MINUTE}px` }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* DAY COLUMNS */}
        {visitsByDay.map((visits, dayIndex) => (
          <div key={dayIndex} className="relative border-l bg-gray-50" style={{ height: `${CONTAINER_HEIGHT_PX}px` }}>
            <div className="sticky top-0 bg-white text-center py-1 font-medium border-b z-10">
              {days[dayIndex]}
            </div>
            <div className="relative" style={{ height: `${CONTAINER_HEIGHT_PX}px` }}>
              {visits.map((visit) => {
                console.log("Visit debug:", visit);
                const top = minutesSinceStart(visit.start_time) * PX_PER_MINUTE;
                const height = durationInMinutes(visit.start_time, visit.end_time) * PX_PER_MINUTE;
                return (
                  <div
                    key={visit.id}
                    className="absolute left-1 right-1 bg-white shadow rounded px-2 py-1 text-xs border border-blue-500 cursor-pointer hover:bg-blue-50"
                    style={{ top: `${top}px`, height: `${height}px`, zIndex: 5 }}
                    onClick={() => setSelectedVisit(visit)}
                  >
                    <div className="font-bold text-[10px] truncate">
                      {visit.client_name || `Client #${visit.client_id}`}
                    </div>
                    <div className="text-[10px]">
                      {visit.start_time} – {visit.end_time}
                    </div>
                    {visit.notes && (
                      <div className="mt-1 text-gray-600 text-[10px]">
                        {visit.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedVisit && (
        <VisitDrawer
          visit={selectedVisit}
          employees={employees}
          clients={clients}
          onClose={() => setSelectedVisit(null)}
          onSave={(updatedVisit) => {
            onVisitUpdate?.(updatedVisit);
            setSelectedVisit(null);
          }}
        />
      )}
    </div>
  );
};

export default RotaWeekView;
