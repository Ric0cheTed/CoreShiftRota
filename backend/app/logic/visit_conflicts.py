from collections import defaultdict
from datetime import date, time

def detect_visit_conflicts(visits, employees):
    emp_visit_map = defaultdict(list)

    for v in visits:
        # ✅ Skip invalid entries
        if not v or not v.date or not v.start_time or v.employee_id is None:
            continue
        emp_visit_map[v.employee_id].append(v)

    conflict_map = defaultdict(list)

    for emp_id, emp_visits in emp_visit_map.items():
        # ✅ Safely sort even with mixed types or missing fields
        emp_visits_sorted = sorted(
            emp_visits,
            key=lambda v: (
                v.date if isinstance(v.date, date) else date.min,
                v.start_time if isinstance(v.start_time, time) else time.min
            )
        )

        for i in range(1, len(emp_visits_sorted)):
            prev = emp_visits_sorted[i - 1]
            curr = emp_visits_sorted[i]

            if not prev.end_time or not curr.start_time:
                continue  # skip incomplete

            if prev.end_time > curr.start_time:
                conflict_map[curr.id].append("Overlapping visit with previous")

    return conflict_map
