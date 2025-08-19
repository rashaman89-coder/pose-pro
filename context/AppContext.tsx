"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Category =
  | "single" | "couple" | "wedding" | "portrait" | "family"
  | "newborn" | "maternity" | "studio" | "outdoor" | "pets" | "fashion";

export type SavedPose = {
  id: string;
  title: string;
  category: Category;
  imageUrl: string;
};

export type ChecklistItem = { id: string; text: string; done: boolean };

export type Project = {
  id: string;
  name: string;
  category: Category;
  dateTimeISO?: string;
  poseIds: string[];          // id-evi poza (sadrže i url deo)
  notes?: string;             // free-form notes
  checklist?: ChecklistItem[];// simple checklist
  links?: string[];           // external links (optional)
  team?: string;              // team info (optional)
};

export type FavoriteCollection = {
  id: string;
  name: string;     // e.g. "Favorites", "City"
  poses: SavedPose[]; // snapshot of saved poses
};

type AppState = {
  // favorites
  favoriteCollections: FavoriteCollection[];
  addPoseToFavoriteCollection: (pose: SavedPose, collectionId: string) => void;
  removePoseFromFavoriteCollection: (poseId: string, collectionId: string) => void;
  removePoseFromAllFavoriteCollections: (poseId: string) => void;
  deleteFavoriteCollection: (collectionId: string) => void;
  getCollectionsContaining: (poseId: string) => FavoriteCollection[];
  createFavoriteCollection: (name: string) => string;
  isInAnyFavoriteCollection: (poseId: string) => boolean;
  favorites: string[]; // default collection ids
  toggleFavorite: (pose: SavedPose) => void;

  // projects
  projects: Project[];
  createProject: (data: { name: string; category: Category; dateTimeISO?: string; initialPoseId?: string }) => string;
  deleteProject: (projectId: string) => void;
  addPoseToProject: (projectId: string, poseId: string) => void;
  removePoseFromProject: (projectId: string, poseId: string) => void;
  updateProjectNotes: (projectId: string, notes: string) => void;
  addChecklistItem: (projectId: string, text: string) => void;
  toggleChecklistItem: (projectId: string, itemId: string) => void;
  removeChecklistItem: (projectId: string, itemId: string) => void;
};

const AppCtx = createContext<AppState | null>(null);
const LS_KEY = "posepro-state-v4";

type PersistShape = {
  favoriteCollections: FavoriteCollection[];
  projects: Project[];
};

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [favoriteCollections, setFavoriteCollections] = useState<FavoriteCollection[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed: PersistShape = JSON.parse(raw);
        setFavoriteCollections(parsed.favoriteCollections ?? []);
        setProjects(parsed.projects ?? []);
      } else {
        setFavoriteCollections([{ id: "default", name: "Favorites", poses: [] }]);
      }
    } catch {
      setFavoriteCollections([{ id: "default", name: "Favorites", poses: [] }]);
    }
  }, []);

  useEffect(() => {
    const data: PersistShape = { favoriteCollections, projects };
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  }, [favoriteCollections, projects]);

  // favorites helpers
  const favorites = useMemo(() => {
    const def = favoriteCollections.find((c) => c.id === "default");
    return def ? def.poses.map((p) => p.id) : [];
  }, [favoriteCollections]);

  const isInAnyFavoriteCollection = (poseId: string) =>
    favoriteCollections.some((c) => c.poses.some((p) => p.id === poseId));

  const getCollectionsContaining = (poseId: string) =>
    favoriteCollections.filter((c) => c.poses.some((p) => p.id === poseId));

  const addPoseToFavoriteCollection = (pose: SavedPose, collectionId: string) => {
    setFavoriteCollections((prev) =>
      prev.map((c) => {
        if (c.id !== collectionId) return c;
        if (c.poses.some((p) => p.id === pose.id)) return c;
        return { ...c, poses: [pose, ...c.poses] };
      })
    );
  };

  const removePoseFromFavoriteCollection = (poseId: string, collectionId: string) => {
    setFavoriteCollections((prev) =>
      prev.map((c) =>
        c.id === collectionId ? { ...c, poses: c.poses.filter((p) => p.id !== poseId) } : c
      )
    );
  };

  const removePoseFromAllFavoriteCollections = (poseId: string) => {
    setFavoriteCollections((prev) =>
      prev.map((c) => ({ ...c, poses: c.poses.filter((p) => p.id !== poseId) }))
    );
  };

  const deleteFavoriteCollection = (collectionId: string) => {
    setFavoriteCollections((prev) => prev.filter((c) => c.id !== collectionId));
  };

  const createFavoriteCollection = (name: string) => {
    const id = `${name.trim().toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    setFavoriteCollections((prev) => [{ id, name: name.trim(), poses: [] }, ...prev]);
    return id;
  };

  const toggleFavorite = (pose: SavedPose) => {
    setFavoriteCollections((prev) => {
      const idx = prev.findIndex((c) => c.id === "default");
      if (idx === -1) {
        return [{ id: "default", name: "Favorites", poses: [pose] }, ...prev];
      }
      const col = prev[idx];
      const has = col.poses.some((p) => p.id === pose.id);
      const updated: FavoriteCollection = {
        ...col,
        poses: has ? col.poses.filter((p) => p.id !== pose.id) : [pose, ...col.poses],
      };
      const next = [...prev];
      next[idx] = updated;
      return next;
    });
  };

  // project helpers
  const createProject = (data: { name: string; category: Category; dateTimeISO?: string; initialPoseId?: string }) => {
    const id = `${data.name.trim().toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const poseIds = data.initialPoseId ? [data.initialPoseId] : [];
    setProjects((prev) => [
      { id, name: data.name.trim(), category: data.category, dateTimeISO: data.dateTimeISO, poseIds, notes: "", checklist: [] },
      ...prev,
    ]);
    return id;
  };

  const deleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const addPoseToProject = (projectId: string, poseId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId && !p.poseIds.includes(poseId)
          ? { ...p, poseIds: [poseId, ...p.poseIds] }
          : p
      )
    );
  };

  const removePoseFromProject = (projectId: string, poseId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, poseIds: p.poseIds.filter((id) => id !== poseId) } : p
      )
    );
  };

  const updateProjectNotes = (projectId: string, notes: string) => {
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, notes } : p)));
  };

  const addChecklistItem = (projectId: string, text: string) => {
    const item: ChecklistItem = { id: `i-${Date.now()}`, text, done: false };
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, checklist: [...(p.checklist || []), item] }
          : p
      )
    );
  };

  const toggleChecklistItem = (projectId: string, itemId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              checklist: (p.checklist || []).map((it) =>
                it.id === itemId ? { ...it, done: !it.done } : it
              ),
            }
          : p
      )
    );
  };

  const removeChecklistItem = (projectId: string, itemId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, checklist: (p.checklist || []).filter((it) => it.id !== itemId) }
          : p
      )
    );
  };

  const value: AppState = {
    favoriteCollections,
    addPoseToFavoriteCollection,
    removePoseFromFavoriteCollection,
    removePoseFromAllFavoriteCollections,
    deleteFavoriteCollection,
    getCollectionsContaining,
    createFavoriteCollection,
    isInAnyFavoriteCollection,
    favorites,
    toggleFavorite,

    projects,
    createProject,
    deleteProject,
    addPoseToProject,
    removePoseFromProject,
    updateProjectNotes,
    addChecklistItem,
    toggleChecklistItem,
    removeChecklistItem,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
