import type { ActivityLogActor, ActivityLogDetailActor } from "./types";

export function formatEvent(event: string) {
  return event
    .replace(/\./g, " ")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

export function formatEntityType(entityType: string) {
  return entityType.charAt(0).toUpperCase() + entityType.slice(1);
}

export function formatState(state?: string) {
  if (!state) return "—";
  return state.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}

export function formatTimestamp(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatActor(
  actor: ActivityLogActor | ActivityLogDetailActor | "system" | null,
) {
  if (!actor || actor === "system") return "System";
  return actor.name;
}

export function getActorId(actor: ActivityLogActor | "system" | null) {
  if (!actor || actor === "system") return null;
  return actor.id;
}