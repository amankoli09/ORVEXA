"use client";

import {
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  BarChart3,
  Clock,
} from "lucide-react";

export interface KnowledgeGapItem {
  id: string;
  topic: string;
  severity: "critical" | "moderate" | "minor";
  explanation: string;
  recommendedAction: string;
}

export interface GapDiagnosticData {
  title: string;
  retentionScore: number;
  totalConceptsAudited: number;
  criticalGapsCount: number;
  gaps: KnowledgeGapItem[];
  highYieldSuggestions: string[];
}

interface GapAnalyzerCardProps {
  data: GapDiagnosticData;
}

export function GapAnalyzerCard({ data }: GapAnalyzerCardProps) {
  const getSeverityBadge = (severity: KnowledgeGapItem["severity"]) => {
    switch (severity) {
      case "critical":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800 border border-amber-200/70">
            <AlertTriangle className="size-3 text-amber-600" />
            Critical Gap
          </span>
        );
      case "moderate":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700 border border-neutral-200">
            Moderate
          </span>
        );
      case "minor":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-600 border border-neutral-200/60">
            Refinement
          </span>
        );
    }
  };

  return (
    <div className="my-3 w-full rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-xs sm:p-5">
      {/* Header section with score */}
      <div className="flex flex-col gap-4 border-b border-neutral-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-md bg-neutral-900 text-white">
              <BarChart3 className="size-3.5" />
            </span>
            <h4 className="text-sm font-semibold text-neutral-950 sm:text-base">
              {data.title}
            </h4>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Audited {data.totalConceptsAudited} syllabus core concepts · Identified {data.criticalGapsCount} high-priority revision gaps
          </p>
        </div>

        {/* Retention Score Pill */}
        <div className="flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/70 px-3 py-2 sm:self-auto">
          <div className="flex flex-col text-right sm:text-left">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
              Readiness Score
            </span>
            <span className="text-lg font-bold text-neutral-900 leading-tight">
              {data.retentionScore}%
            </span>
          </div>
          <div className="h-8 w-1 rounded-full bg-neutral-200 overflow-hidden">
            <div
              className="h-full bg-neutral-900 rounded-full"
              style={{ width: "100%", height: `${data.retentionScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Identified Knowledge Gaps List */}
      <div className="mt-4 space-y-3">
        <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Identified Gaps & Weak Spots
        </h5>
        <div className="space-y-2.5">
          {data.gaps.map((gap) => (
            <div
              key={gap.id}
              className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-3 transition-colors hover:border-neutral-200 hover:bg-neutral-50"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-900">
                      {gap.topic}
                    </span>
                    {getSeverityBadge(gap.severity)}
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {gap.explanation}
                  </p>
                </div>
              </div>
              <div className="mt-2.5 flex items-center gap-1.5 border-t border-neutral-200/50 pt-2 text-[11px] text-neutral-500">
                <span className="font-medium text-neutral-700">Recommended fix:</span>
                <span>{gap.recommendedAction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High Yield Revision Tips */}
      {data.highYieldSuggestions.length > 0 && (
        <div className="mt-4 rounded-xl border border-neutral-200/70 bg-neutral-50/40 p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800">
            <Sparkles className="size-3.5 text-neutral-600" />
            <span>High-Yield Next Steps</span>
          </div>
          <ul className="mt-2 space-y-1 text-xs text-neutral-600">
            {data.highYieldSuggestions.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1 size-1 rounded-full bg-neutral-400 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

