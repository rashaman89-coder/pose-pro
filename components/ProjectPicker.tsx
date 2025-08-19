"use client";
import { useApp } from "@/context/AppContext";
import { useState } from "react";
import type { Category } from "@/lib/types";

const categories: Category[] = ["single","couple","wedding","portrait","family","newborn","maternity","studio","outdoor","pets","fashion"];

export default function ProjectPicker({ poseId, onClose }: { poseId: string; onClose: () => void; }) {
  const { projects, addPoseToProject, createProject } = useApp();
  const [mode, setMode] = useState<"choose"|"create">("choose");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("wedding");
  const [dateTime, setDateTime] = useState("");

  const addTo = (pid: string) => { addPoseToProject(pid, poseId); onClose(); };
  const create = () => { const id = createProject({ name, category, dateTimeISO: dateTime }); addTo(id); };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-4 w-full max-w-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Add pose to project</h3>
          <button onClick={onClose} className="text-sm">Close</button>
        </div>

        {mode === "choose" ? (
          <div className="space-y-3">
            <button onClick={() => setMode("create")} className="w-full py-2 rounded-xl bg-black text-white">+ Create new project</button>
            <div className="max-h-64 overflow-auto divide-y">
              {projects.length === 0 && <div className="text-sm text-neutral-500 p-2">No projects yet.</div>}
              {projects.map(p => (
                <div key={p.id} className="flex items-center justify-between p-2">
                  <div>
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-neutral-500">{p.category} • {p.dateTimeISO?.slice(0,16).replace("T"," ")}</div>
                  </div>
                  <button onClick={() => addTo(p.id)} className="text-sm px-3 py-1 rounded-lg bg-neutral-900 text-white">Add</button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <input placeholder="Project name (e.g. Miljana & Marko)" className="w-full border rounded-xl px-3 py-2" value={name} onChange={e=>setName(e.target.value)} />
            <select className="w-full border rounded-xl px-3 py-2" value={category} onChange={e=>setCategory(e.target.value as Category)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="datetime-local" className="w-full border rounded-xl px-3 py-2" value={dateTime} onChange={e=>setDateTime(e.target.value)} />
            <button onClick={create} disabled={!name} className="w-full py-2 rounded-xl bg-black text-white disabled:opacity-50">Create & Add</button>
          </div>
        )}
      </div>
    </div>
  );
}
