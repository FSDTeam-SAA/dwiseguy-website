"use client";

import React from "react";
import {
  Lightbulb,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  BarChart3,
  Award,
} from "lucide-react";
import { useGetStudentQuizMyAttempts } from "../../quiz/hooks/useGetStudentQuizMyAttempts";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { QuizAttempt } from "../../quiz/types/quize";
import { Skeleton } from "@/components/ui/skeleton";

const columnHelper = createColumnHelper<QuizAttempt>();

const columns = [
  columnHelper.accessor("quizName", {
    header: () => (
      <span className="text-left text-xs uppercase tracking-wider pl-4">
        Quiz Title
      </span>
    ),
    cell: (info) => (
      <div className="flex flex-col text-left pl-4">
        <span className="font-bold text-white tracking-tight leading-tight">
          {info.getValue()}
        </span>
        <span className="text-[10px] text-gray-500 font-medium">
          Attempt ID: {info.row.original.attemptId.slice(-8).toUpperCase()}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor("score", {
    header: () => <span className="text-xs uppercase tracking-wider">Result</span>,
    cell: (info) => (
      <div className="flex flex-col items-center">
        <span className="font-mono text-sm text-white">
          {info.getValue()} / {info.row.original.totalMarks}
        </span>
        <div className="w-16 h-1.5 bg-white/5 rounded-full mt-1 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${info.row.original.percentage}%` }}
          ></div>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor("percentage", {
    header: () => <span className="text-xs uppercase tracking-wider">Grade</span>,
    cell: (info) => (
      <span className="font-black text-white/90">{info.getValue()}%</span>
    ),
  }),
  columnHelper.accessor("status", {
    header: () => <span className="text-xs uppercase tracking-wider">Status</span>,
    cell: (info) => {
      const status = info.getValue();
      return (
        <div className="flex justify-center">
          {status === "pass" ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-wider">
                Pass
              </span>
            </div>
          ) : status === "retake_suggested" ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-wider">
                Retake
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-500 rounded-full border border-red-500/20">
              <XCircle className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-wider">
                Fail
              </span>
            </div>
          )}
        </div>
      );
    },
  }),
  columnHelper.accessor("submittedAt", {
    header: () => <span className="text-xs uppercase tracking-wider">Date</span>,
    cell: (info) => (
      <div className="flex items-center justify-center gap-1.5 text-gray-500">
        <Calendar className="w-3.5 h-3.5" />
        <span className="text-xs tabular-nums">
          {new Date(info.getValue()).toLocaleDateString()}
        </span>
      </div>
    ),
  }),
];

const QuizeTrack = () => {
  const { data, isLoading, error } = useGetStudentQuizMyAttempts();

  const table = useReactTable({
    data: data?.data?.attempts || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="bg-slate-950/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 space-y-6">
        <div className="flex gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 flex-1 bg-white/5 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-96 w-full bg-white/5 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-950/40 backdrop-blur-xl border border-red-500/20 rounded-3xl p-12 text-center animate-in fade-in zoom-in duration-500">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-white mb-2">Sync Interrupted</h2>
        <p className="text-gray-400 max-w-xs mx-auto text-sm leading-relaxed">
          Could not retrieve your performance data. Please check your connection.
        </p>
      </div>
    );
  }

  const stats = data?.data;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Summary Stats Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-purple-600/20 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative bg-slate-950/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
              <Award className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                Average Grade
              </p>
              <h3 className="text-2xl font-black text-white leading-none tabular-nums">
                {stats?.averagePercentage}%
              </h3>
            </div>
          </div>
        </div>

        <div className="relative group text-center">
            <div className="absolute -inset-0.5 bg-linear-to-r from-green-500/20 to-emerald-600/20 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-slate-950/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-center">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Pass Ratio</p>
                <div className="flex items-center justify-center gap-2">
                    <h3 className="text-2xl font-black text-white tabular-nums">{stats?.totalPassed}</h3>
                    <span className="text-gray-600">/</span>
                    <span className="text-lg font-bold text-gray-500 tabular-nums">{stats?.totalQuizzesAttempted}</span>
                </div>
            </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-linear-to-r from-orange-500/20 to-amber-600/20 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative bg-slate-950/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20">
              <BarChart3 className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                Total Attempts
              </p>
              <h3 className="text-2xl font-black text-white leading-none tabular-nums">
                {stats?.totalQuizzesAttempted}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="relative bg-slate-950/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:border-white/20">
        <div className="p-8 border-b border-white/5 bg-linear-to-b from-white/2 to-transparent">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#FF8A7A]/20 rounded-2xl border border-[#FF8A7A]/30">
              <Lightbulb className="w-7 h-7 text-[#FF8A7A]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase italic leading-none mb-1">
                Performance Log
              </h2>
              <p className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">
                Detailed Quiz History
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-white/5">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-5 text-gray-500 font-black text-center"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-white/3">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="group/row hover:bg-white/2 transition-colors duration-300"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!stats?.attempts || stats.attempts.length === 0) && (
          <div className="py-20 text-center">
            <p className="text-gray-500 font-medium tracking-wide">
              No performance records found in this sequence.
            </p>
          </div>
        )}

        <div className="p-4 bg-white/2 border-t border-white/5 text-center">
          <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em]">
            Sync status: Nominal // Protocol 04.Q
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizeTrack;