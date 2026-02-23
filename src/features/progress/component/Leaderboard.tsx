"use client";

import React from "react";
import { Trophy, Medal, Crown, Star, TrendingUp } from "lucide-react";
import { useLeaderboard } from "../hooks/useLeaderboard";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { LeaderboardUser } from "../types/progress.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { Lock } from "lucide-react";

const columnHelper = createColumnHelper<LeaderboardUser>();

const columns = [
  columnHelper.display({
    id: "rank",
    header: () => <span className="text-xs uppercase tracking-wider">Rank</span>,
    cell: (info) => {
      const rank = info.row.index + 1;
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold">
          {rank === 1 ? (
            <Crown className="w-6 h-6 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
          ) : rank === 2 ? (
            <Medal className="w-5 h-5 text-gray-300" />
          ) : rank === 3 ? (
            <Medal className="w-5 h-5 text-amber-600" />
          ) : (
            <span className="text-gray-400">{rank}</span>
          )}
        </div>
      );
    },
  }),
  columnHelper.accessor((row) => row, {
    id: "user",
    header: () => (
      <span className="text-left text-xs uppercase tracking-wider pl-4">
        Musician
      </span>
    ),
    cell: (info) => {
      const user = info.getValue();
      return (
        <div className="flex items-center gap-3 pl-4 py-2">
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-primary/50 to-purple-600/50 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <Avatar className="h-10 w-10 border-2 border-white/10 relative">
              <AvatarImage src={user.avatar?.url} alt={user.name} />
              <AvatarFallback className="bg-slate-800 text-slate-200">
                {user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-white tracking-tight leading-none mb-1">
              {user.name}
            </span>
            <span className="text-[10px] text-gray-500 font-medium">
              @{user.username}
            </span>
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("instrumentsStarted", {
    header: () => (
      <span className="text-xs uppercase tracking-wider">Instruments</span>
    ),
    cell: (info) => (
      <div className="flex items-center justify-center gap-1.5">
        <Star className="w-3.5 h-3.5 text-blue-400" />
        <span className="font-mono text-blue-100">{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor("totalCompletedSteps", {
    header: () => (
      <span className="text-xs uppercase tracking-wider">Steps Done</span>
    ),
    cell: (info) => (
      <div className="flex items-center justify-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 w-fit mx-auto">
        <TrendingUp className="w-3.5 h-3.5 text-primary" />
        <span className="font-bold text-primary">{info.getValue()}</span>
      </div>
    ),
  }),
];

const Leaderboard = () => {
  const { status: sessionStatus } = useSession();
  const { data, isLoading, error } = useLeaderboard();

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="bg-slate-950/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-8 w-48 bg-white/5" />
          <Skeleton className="h-6 w-24 bg-white/5 rounded-full" />
        </div>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full bg-white/5 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-16 text-center animate-in fade-in zoom-in duration-700 relative overflow-hidden group">
        <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-purple-600/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
        <div className="relative">
          <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
            <Lock className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase italic">
            Vault Locked
          </h2>
          <p className="text-gray-400 max-w-sm mx-auto text-sm leading-relaxed mb-8">
            The Global Hall of Fame is reserved for registered musicians. Please
            log in to synchronize your progress and climb the ranks.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-8 py-3 bg-white text-black font-black uppercase text-xs tracking-widest rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            Access Terminal
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-950/40 backdrop-blur-xl border border-red-500/20 rounded-3xl p-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-8 h-8 text-red-500 opacity-50" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Sync Error</h2>
        <p className="text-gray-400 max-w-xs mx-auto text-sm leading-relaxed">
          The leaderboard frequency is currently out of sync. Please refresh the transmission.
        </p>
      </div>
    );
  }

  return (
    <div className="group relative">
      {/* Decorative Glow */}
      <div className="absolute -inset-0.5 bg-linear-to-r from-primary/20 to-purple-600/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>

      <div className="relative bg-slate-950/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:border-white/20">
        <div className="p-8 border-b border-white/5 bg-linear-to-b from-white/2 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
                <Trophy className="w-7 h-7 text-primary shadow-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight uppercase italic leading-none mb-1">
                  Global Hall of Fame
                </h2>
                <p className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">
                  Top Performing Artists
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-white uppercase tracking-wider">
                Live Data
              </span>
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

        {(!data?.data || data.data.length === 0) && (
          <div className="py-20 text-center">
            <p className="text-gray-500 font-medium tracking-wide">
              No entries found in the archives.
            </p>
          </div>
        )}

        <div className="p-4 bg-white/2 border-t border-white/5 text-center">
          <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em]">
            Sync status: Nominal // Protocol 09.X
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;