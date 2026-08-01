"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ChecklistItem, ClientResponse, Project, ShotItem } from "./types";
import { PLANS, type PlanId } from "./brand";
import {
  FREE,
  needsRecheck,
  readCached,
  refreshInBackground,
  deactivate as clearLicence,
  type Entitlement,
} from "./license";

/**
 * All studio state lives in the browser. No accounts, no database, no server
 * bill — which is what lets the free tier stay free and the app stay up.
 */

const STORAGE_KEY = "cuecard.studio.v1";

interface Persisted {
  projects: Project[];
  studioName: string;
}

interface StudioState {
  ready: boolean;
  projects: Project[];
  studioName: string;
  setStudioName: (name: string) => void;

  entitlement: Entitlement;
  plan: PlanId;
  isPro: boolean;
  limits: (typeof PLANS)[PlanId]["limits"];
  applyEntitlement: (next: Entitlement) => void;
  deactivate: () => void;

  createProject: (input: {
    name: string;
    dateTimeISO?: string;
    location?: string;
  }) => string;
  deleteProject: (id: string) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  getProject: (id: string) => Project | undefined;

  addPose: (projectId: string, poseId: string) => void;
  removePose: (projectId: string, poseId: string) => void;
  togglePose: (projectId: string, poseId: string) => void;
  setPoses: (projectId: string, poseIds: string[]) => void;

  addShotItem: (projectId: string, item: Omit<ShotItem, "id">) => void;
  toggleShotItem: (projectId: string, itemId: string) => void;
  removeShotItem: (projectId: string, itemId: string) => void;

  addChecklistItem: (projectId: string, text: string) => void;
  toggleChecklistItem: (projectId: string, itemId: string) => void;
  removeChecklistItem: (projectId: string, itemId: string) => void;

  recordResponse: (projectId: string, response: ClientResponse) => void;
}

const Ctx = createContext<StudioState | null>(null);

function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [studioName, setStudioNameState] = useState("");
  const [entitlement, setEntitlement] = useState<Entitlement>(FREE);
  const hydrated = useRef(false);

  // Load once on mount. Everything before this point renders the empty state,
  // which keeps the static HTML identical for every visitor.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Persisted;
        setProjects(Array.isArray(parsed.projects) ? parsed.projects : []);
        setStudioNameState(parsed.studioName ?? "");
      }
    } catch {
      /* Corrupt or unavailable storage starts the studio empty rather than crashing. */
    }
    setEntitlement(readCached());
    hydrated.current = true;
    setReady(true);
  }, []);

  // Persist after hydration only, so an early write can't wipe saved work.
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      const payload: Persisted = { projects, studioName };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* Quota or private mode — the session keeps working, it just won't persist. */
    }
  }, [projects, studioName]);

  // Quietly confirm a cached licence about once a week.
  useEffect(() => {
    if (!ready || !needsRecheck(entitlement)) return;
    let cancelled = false;
    refreshInBackground(entitlement).then((next) => {
      if (!cancelled && next !== entitlement) setEntitlement(next);
    });
    return () => {
      cancelled = true;
    };
  }, [ready, entitlement]);

  const patchProject = useCallback(
    (id: string, fn: (p: Project) => Project) => {
      setProjects((prev) => prev.map((p) => (p.id === id ? fn(p) : p)));
    },
    [],
  );

  const value = useMemo<StudioState>(() => {
    const plan = entitlement.plan;
    return {
      ready,
      projects,
      studioName,
      setStudioName: setStudioNameState,

      entitlement,
      plan,
      isPro: plan === "pro",
      limits: PLANS[plan].limits,
      applyEntitlement: setEntitlement,
      deactivate: () => setEntitlement(clearLicence()),

      createProject: ({ name, dateTimeISO, location }) => {
        const id = newId("shoot");
        const project: Project = {
          id,
          name: name.trim() || "Untitled shoot",
          category: "wedding",
          dateTimeISO,
          location,
          poseIds: [],
          notes: "",
          checklist: [],
          shotList: [],
          responses: [],
        };
        setProjects((prev) => [project, ...prev]);
        return id;
      },

      deleteProject: (id) => setProjects((prev) => prev.filter((p) => p.id !== id)),

      updateProject: (id, patch) => patchProject(id, (p) => ({ ...p, ...patch })),

      getProject: (id) => projects.find((p) => p.id === id),

      addPose: (projectId, poseId) =>
        patchProject(projectId, (p) =>
          p.poseIds.includes(poseId)
            ? p
            : { ...p, poseIds: [...p.poseIds, poseId] },
        ),

      removePose: (projectId, poseId) =>
        patchProject(projectId, (p) => ({
          ...p,
          poseIds: p.poseIds.filter((id) => id !== poseId),
        })),

      togglePose: (projectId, poseId) =>
        patchProject(projectId, (p) => ({
          ...p,
          poseIds: p.poseIds.includes(poseId)
            ? p.poseIds.filter((id) => id !== poseId)
            : [...p.poseIds, poseId],
        })),

      setPoses: (projectId, poseIds) =>
        patchProject(projectId, (p) => ({ ...p, poseIds })),

      addShotItem: (projectId, item) =>
        patchProject(projectId, (p) => ({
          ...p,
          shotList: [...(p.shotList ?? []), { ...item, id: newId("shot") }],
        })),

      toggleShotItem: (projectId, itemId) =>
        patchProject(projectId, (p) => ({
          ...p,
          shotList: (p.shotList ?? []).map((s) =>
            s.id === itemId ? { ...s, done: !s.done } : s,
          ),
        })),

      removeShotItem: (projectId, itemId) =>
        patchProject(projectId, (p) => ({
          ...p,
          shotList: (p.shotList ?? []).filter((s) => s.id !== itemId),
        })),

      addChecklistItem: (projectId, text) =>
        patchProject(projectId, (p) => {
          const item: ChecklistItem = { id: newId("todo"), text, done: false };
          return { ...p, checklist: [...(p.checklist ?? []), item] };
        }),

      toggleChecklistItem: (projectId, itemId) =>
        patchProject(projectId, (p) => ({
          ...p,
          checklist: (p.checklist ?? []).map((c) =>
            c.id === itemId ? { ...c, done: !c.done } : c,
          ),
        })),

      removeChecklistItem: (projectId, itemId) =>
        patchProject(projectId, (p) => ({
          ...p,
          checklist: (p.checklist ?? []).filter((c) => c.id !== itemId),
        })),

      recordResponse: (projectId, response) =>
        patchProject(projectId, (p) => ({
          ...p,
          // Newest first; a couple who re-sends replaces nothing, they just add.
          responses: [response, ...(p.responses ?? [])].slice(0, 20),
        })),
    };
  }, [ready, projects, studioName, entitlement, patchProject]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStudio must be used inside <StudioProvider>");
  return ctx;
}
