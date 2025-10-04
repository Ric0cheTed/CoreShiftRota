from typing import List
from .interfaces import SuggestionProvider, Constraint, Scorer
from .models import VisitInput, Candidate, Suggestion, Reason, ScoreContext

class GreedyProvider(SuggestionProvider):
    name = "greedy_v1"
    def __init__(self, constraints: List[Constraint] = None, scorers: List[Scorer] = None):
        self.constraints = constraints or []
        self.scorers = scorers or []

    def suggest(self, visit: VisitInput, candidates: List[Candidate], ctx: ScoreContext) -> List[Suggestion]:
        ranked: List[Suggestion] = []
        for c in candidates:
            reasons: List[Reason] = []
            # No-op until constraints/scorers are implemented; return neutral reasons.
            total = 0.0
            ranked.append(Suggestion(employee_id=c.id, score=total, reasons=reasons))
        ranked.sort(key=lambda s: s.score, reverse=True)
        return ranked