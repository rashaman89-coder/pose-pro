"use client";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useState } from "react";

export default function ProjectsPage() {
  const { projects, deleteProject, createProject } = useApp();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("wedding");
  const [dt, setDt] = useState("");

  const create = () => {
    if (!name.trim()) return;
    createProject({ name: name.trim(), category: category as any, dateTimeISO: dt || undefined });
    setOpen(false);
    setName(""); setDt("");
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">My Projects</h1>
        <button onClick={() => setOpen(true)} className="btn-primary rounded-xl">+ New Project</button>
      </div>

      {projects.length === 0 && <div className="text-neutral-500">No projects yet.</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {projects.map((p) => (
          <div key={p.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link href={`/projects/${p.id}`} className="font-semibold hover:underline">{p.name}</Link>
                <div className="text-xs text-neutral-500">
                  {p.category} {p.dateTimeISO ? `· ${new Date(p.dateTimeISO).toLocaleString()}` : ""}
                </div>
              </div>
              <button
                onClick={() => deleteProject(p.id)}
                className="text-xs px-2 py-1 rounded-lg border hover:bg-blue-50"
                title="Delete project"
              >
                Delete
              </button>
            </div>
            <div className="text-xs text-neutral-500 mt-2">{p.poseIds.length} poses</div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl p-4 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-semibold mb-3">New Project</h2>
            <div className="space-y-2">
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full px-3 py-2 rounded-lg border" />
              <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg border">
                {["single","couple","wedding","portrait","family","newborn","maternity","studio","outdoor","pets","fashion"].map(c=>(
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input value={dt} onChange={e=>setDt(e.target.value)} type="datetime-local" className="w-full px-3 py-2 rounded-lg border" />
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button className="px-3 py-2 rounded-lg border" onClick={()=>setOpen(false)}>Cancel</button>
              <button className="btn-primary rounded-xl" onClick={create}>Create</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
