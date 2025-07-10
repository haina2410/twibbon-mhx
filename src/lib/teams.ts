export interface Team {
  id: string;
  name: string;
  color: string;
  frameUrl: string;
  description?: string;
}

export const teams: Team[] = [
  {
    id: "red-team",
    name: "Red Team",
    color: "#EF4444",
    frameUrl: "/frames/red-team.svg",
    description: "Environmental Conservation Team",
  },
  {
    id: "blue-team",
    name: "Blue Team",
    color: "#3B82F6",
    frameUrl: "/frames/blue-team.svg",
    description: "Community Outreach Team",
  },
  {
    id: "green-team",
    name: "Green Team",
    color: "#10B981",
    frameUrl: "/frames/green-team.svg",
    description: "Education & Literacy Team",
  },
  {
    id: "yellow-team",
    name: "Yellow Team",
    color: "#F59E0B",
    frameUrl: "/frames/yellow-team.svg",
    description: "Healthcare Support Team",
  },
  {
    id: "purple-team",
    name: "Purple Team",
    color: "#8B5CF6",
    frameUrl: "/frames/purple-team.svg",
    description: "Technology & Innovation Team",
  },
];
