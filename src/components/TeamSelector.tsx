"use client";

import { Team, teams, campaignConfig } from "@/data";
import Image from "next/image";

interface TeamSelectorProps {
  selectedTeam: Team | null;
  onTeamSelect: (team: Team) => void;
}

export default function TeamSelector({
  selectedTeam,
  onTeamSelect,
}: TeamSelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {campaignConfig.instructions.chooseTeam}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            onClick={() => onTeamSelect(team)}
            className={`
              relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:scale-105
              ${
                selectedTeam?.id === team.id
                  ? "border-blue-500 shadow-lg ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }
            `}
          >
            <div className="p-4">
              {/* Frame Preview */}
              <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden">
                <Image
                  src={team.frameUrl}
                  alt={`${team.name} frame`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Team Info */}
              <div className="text-center">
                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  {team.name}
                </h3>
                {team.description && (
                  <p className="text-sm text-gray-600">{team.description}</p>
                )}
              </div>

              {/* Color Indicator */}
              <div className="flex justify-center mt-2">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: team.color }}
                />
              </div>
            </div>

            {/* Selection Indicator */}
            {selectedTeam?.id === team.id && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
