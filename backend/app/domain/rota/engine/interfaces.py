from typing import Protocol, List
from .models import VisitInput, Candidate, Suggestion, Reason, ScoreContext

class Constraint(Protocol):
    name: str
    hard: bool
    def check(self, visit: VisitInput, candidate: Candidate, ctx: ScoreContext) -> float: ...

class Scorer(Protocol):
    name: str
    weight: float
    def score(self, visit: VisitInput, candidate: Candidate, ctx: ScoreContext) -> float: ...

class SuggestionProvider(Protocol):
    name: str
    def suggest(self, visit: VisitInput, candidates: List[Candidate], ctx: ScoreContext) -> List[Suggestion]: ...