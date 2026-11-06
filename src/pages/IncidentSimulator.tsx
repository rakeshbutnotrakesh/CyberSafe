import React, { useState } from 'react';
import {
  Compass,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  Shield,
  BookOpen,
  ArrowRight,
  AlertOctagon,
  Clock,
  Sparkles,
} from 'lucide-react';
import { INCIDENT_SCENARIOS } from '../services/incidentService';
import { IncidentScenario, IncidentChoice } from '../types/security';

interface IncidentSimulatorProps {
  onSimulationCompleted: (scenarioTitle: string, score: number) => void;
}

export const IncidentSimulator: React.FC<IncidentSimulatorProps> = ({
  onSimulationCompleted,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(INCIDENT_SCENARIOS[0].id);
  const [currentStepId, setCurrentStepId] = useState<string>(INCIDENT_SCENARIOS[0].initialStepId);
  const [accumulatedScore, setAccumulatedScore] = useState<number>(0);
  const [selectedChoice, setSelectedChoice] = useState<IncidentChoice | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [decisionHistory, setDecisionHistory] = useState<
    { stepTitle: string; choiceText: string; feedback: string; isOptimal: boolean }[]
  >([]);

  const scenario =
    INCIDENT_SCENARIOS.find((s) => s.id === selectedScenarioId) || INCIDENT_SCENARIOS[0];
  const step = scenario.steps[currentStepId];

  const handleSelectScenario = (scen: IncidentScenario) => {
    setSelectedScenarioId(scen.id);
    setCurrentStepId(scen.initialStepId);
    setAccumulatedScore(0);
    setSelectedChoice(null);
    setIsFinished(false);
    setDecisionHistory([]);
  };

  const handleMakeChoice = (choice: IncidentChoice) => {
    setSelectedChoice(choice);
  };

  const handleProceedNext = () => {
    if (!selectedChoice) return;

    const newScore = Math.max(0, accumulatedScore + selectedChoice.scoreImpact);
    setAccumulatedScore(newScore);

    setDecisionHistory((prev) => [
      ...prev,
      {
        stepTitle: step.title,
        choiceText: selectedChoice.text,
        feedback: selectedChoice.feedback,
        isOptimal: selectedChoice.isOptimal,
      },
    ]);

    if (selectedChoice.nextStepId && scenario.steps[selectedChoice.nextStepId]) {
      setCurrentStepId(selectedChoice.nextStepId);
      setSelectedChoice(null);
    } else {
      setIsFinished(true);
      onSimulationCompleted(scenario.title, newScore);
    }
  };

  const handleRestart = () => {
    setCurrentStepId(scenario.initialStepId);
    setAccumulatedScore(0);
    setSelectedChoice(null);
    setIsFinished(false);
    setDecisionHistory([]);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-purple-400" />
          <span>Interactive Cyber Incident & Breach Simulator</span>
        </h2>
        <p className="text-xs text-slate-400">
          Walk through realistic cyber crisis decision trees grounded in NIST SP 800-61 and CISA incident handling playbooks.
        </p>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {INCIDENT_SCENARIOS.map((scen) => {
          const isSelected = scen.id === scenario.id;
          return (
            <button
              key={scen.id}
              type="button"
              onClick={() => handleSelectScenario(scen)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-purple-500 bg-purple-950/20 text-white shadow-sm'
                  : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                <span className="text-purple-400 uppercase">{scen.category}</span>
                <span className="text-slate-400">{scen.estimatedMinutes} min</span>
              </div>
              <h3 className="text-xs font-semibold text-slate-100 line-clamp-1">{scen.title}</h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{scen.synopsis}</p>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Card */}
      {!isFinished ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 space-y-6">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
            <div>
              <span className="text-xs font-mono uppercase text-purple-400 font-semibold">
                Scenario Stage: {step?.title || 'Triage'}
              </span>
              <h3 className="text-lg md:text-xl font-bold text-white mt-0.5">{scenario.title}</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Tactical Score:</span>
              <strong className="text-emerald-400 text-sm tabular-nums">{accumulatedScore} pts</strong>
            </div>
          </div>

          {/* Situation Prose */}
          <div className="space-y-3">
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
              {step?.situation}
            </p>

            {step?.urgentNotice && (
              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-900/50 text-xs text-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{step.urgentNotice}</span>
              </div>
            )}
          </div>

          {/* Decision Choices */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono block">
              What is your tactical decision?
            </span>
            {step?.choices.map((choice) => {
              const isPicked = selectedChoice?.id === choice.id;
              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => handleMakeChoice(choice)}
                  className={`w-full text-left p-4 rounded-xl border text-xs md:text-sm transition-all flex items-start justify-between gap-3 ${
                    isPicked
                      ? 'border-purple-500 bg-purple-950/40 text-white font-medium shadow-md shadow-purple-500/10'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <span className="leading-relaxed">{choice.text}</span>
                  {isPicked && <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Real-Time Feedback Callout when choice selected */}
          {selectedChoice && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 ${
                selectedChoice.isOptimal
                  ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-800/80 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-mono font-bold uppercase text-[11px]">
                {selectedChoice.isOptimal ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
                <span>
                  {selectedChoice.isOptimal ? 'Optimal Action' : 'Sub-Optimal / Risky Action'} (
                  {selectedChoice.scoreImpact > 0 ? `+${selectedChoice.scoreImpact}` : selectedChoice.scoreImpact} pts)
                </span>
              </div>
              <p className="text-slate-300 pl-6">{selectedChoice.feedback}</p>
            </div>
          )}

          {/* Proceed Button */}
          <div className="flex items-center justify-end pt-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleProceedNext}
              disabled={!selectedChoice}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <span>{selectedChoice?.nextStepId ? 'Execute Action & Proceed' : 'Finalize Incident Response'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Finished Resolution Screen */
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center space-y-5 shadow-xl">
            <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                Simulation Debrief
              </span>
              <h3 className="text-2xl font-extrabold text-white">Incident Contained</h3>
              <div className="text-sm font-mono text-emerald-400 font-bold mt-1">
                Total Incident Handling Score: {accumulatedScore} Points
              </div>
            </div>

            <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
              {scenario.finalResolution.summary}
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 max-w-xl mx-auto space-y-2 text-left">
              <div>
                <strong className="text-cyan-400 font-mono">Core Tactical Rule: </strong>
                {scenario.finalResolution.keyTakeaway}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Framework standard: {scenario.finalResolution.frameworkReference}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRestart}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Scenario</span>
              </button>
            </div>
          </div>

          {/* Action Log History */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-300">
              Chronological Incident Triage Log
            </h4>
            <div className="space-y-3">
              {decisionHistory.map((d, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
                    d.isOptimal
                      ? 'bg-emerald-950/10 border-emerald-900/50'
                      : 'bg-rose-950/10 border-rose-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="font-semibold text-slate-200">Step {i + 1}: {d.stepTitle}</span>
                    <span className={d.isOptimal ? 'text-emerald-400' : 'text-rose-400'}>
                      {d.isOptimal ? 'Optimal' : 'Sub-Optimal'}
                    </span>
                  </div>
                  <p className="text-slate-300">"{d.choiceText}"</p>
                  <p className="text-[11px] text-slate-400 italic">{d.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
