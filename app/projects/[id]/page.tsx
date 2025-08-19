"use client";
import { useParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useEffect, useMemo, useState } from "react";
import PoseCard from "@/components/PoseCard";

type PoseLite = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  instructions: string;
  tags: string[];
};

// pokušaj da iz poseId izvučemo url (pošto je id: `${cat}-${idx}-${url}`)
function urlFromPoseId(poseId: string): string | null {
  const parts = poseId.split("-");
  if (parts.length < 3) return null;
  return parts.slice(2).join("-"); // spaja nazad "/images/.."
}
function titleFromUrl(url: string) {
  return url.split("/").pop()!.replace(/\.[^.]+$/, "").replace(/[-_]/g," ");
}

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { projects, updateProjectNotes, addChecklistItem, toggleChecklistItem, removeChecklistItem, addPoseToProject, removePoseFromProject } = useApp();
  const project = projects.find(p => p.id === params.id);

  const [adding, setAdding] = useState(false);
  const [list, setList] = useState<PoseLite[]>([]);
  const [notes, setNotes] = useState(project?.notes || "");
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    if (!project) return;
    // rekonstruiši minimalne podatke o pozama iz poseId
    const mapped = project.poseIds.map((pid) => {
      const url = urlFromPoseId(pid);
      if (!url) return null;
      const cat = pid.split("-")[0];
      return {
        id: pid,
        title: titleFromUrl(url),
        category: cat,
        imageUrl: url,
        instructions: "",
        tags: [],
      } as PoseLite;
    }).filter(Boolean) as PoseLite[];
    setList(mapped);
    setNotes(project.notes || "");
  }, [project]);

  if (!project) {
    return <main className="p-6 max-w-6xl mx-auto">Project not found.</main>;
  }

  const saveNotes = () => updateProjectNotes(project.id, notes);

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">{project.name}</h1>
          <div className="text-xs text-neutral-500">
            {project.category} {project.dateTimeISO ? `· ${new Date(project.dateTimeISO).toLocaleString()}` : ""}
          </div>
        </div>
        <button className="btn-primary rounded-xl" onClick={() => setAdding(true)}>+ Add poses</button>
      </div>

      {/* Gallery */}
      <section>
        <h2 className="font-semibold mb-2">Poses ({list.length})</h2>
        {list.length === 0 && <div className="text-neutral-500">No poses yet. Click “Add poses”.</div>}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {list.map((p) => (
            <div key={p.id} className="relative">
              <PoseCard pose={p as any} />
              <button
                className="absolute top-2 left-2 text-xs px-2 py-1 rounded-lg border bg-white/90 hover:bg-blue-50"
                onClick={() => removePoseFromProject(project.id, p.id)}
                title="Remove from project"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Notes */}
      <section>
        <h2 className="font-semibold mb-2">Notes</h2>
        <textarea
          value={notes}
          onChange={(e)=>setNotes(e.target.value)}
          onBlur={saveNotes}
          placeholder="Write your notes for this shoot..."
          className="w-full min-h-[120px] rounded-xl border p-3"
        />
        <div className="text-xs text-neutral-500 mt-1">Notes auto-save on blur.</div>
      </section>

      {/* Checklist */}
      <section>
        <h2 className="font-semibold mb-2">Checklist</h2>
        <div className="flex gap-2 mb-2">
          <input
            value={newItem}
            onChange={(e)=>setNewItem(e.target.value)}
            placeholder="Add checklist item…"
            className="flex-1 rounded-xl border px-3 py-2"
          />
          <button
            className="px-3 py-2 rounded-xl border hover:bg-blue-50"
            onClick={() => { if(newItem.trim()){ addChecklistItem(project.id, newItem.trim()); setNewItem(""); } }}
          >
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {(project.checklist || []).map(it => (
            <li key={it.id} className="flex items-center justify-between rounded-xl border px-3 py-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={it.done}
                  onChange={()=>toggleChecklistItem(project.id, it.id)}
                />
                <span className={it.done ? "line-through text-neutral-500" : ""}>{it.text}</span>
              </label>
              <button className="text-xs px-2 py-1 rounded-lg border hover:bg-blue-50" onClick={()=>removeChecklistItem(project.id, it.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Add Poses Modal (loads from same category) */}
      {adding && (
        <AddPosesModal
          category={project.category}
          onClose={()=>setAdding(false)}
          onAdd={(poseId)=>addPoseToProject(project.id, poseId)}
        />
      )}
    </main>
  );
}

function AddPosesModal({ category, onClose, onAdd }:{ category: string; onClose: ()=>void; onAdd:(poseId:string)=>void }) {
  const [files, setFiles] = useState<string[]>([]);
  useEffect(() => {
    fetch(`/api/list-images?category=${category}`)
      .then(r=>r.json())
      .then((d:{files:string[]})=>setFiles(d.files||[]));
  }, [category]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-4 w-full max-w-3xl" onClick={(e)=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Add poses from {category}</h3>
          <button className="px-3 py-1 rounded-lg border" onClick={onClose}>Close</button>
        </div>
        {files.length === 0 && <div className="text-neutral-500">No images found.</div>}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[60vh] overflow-auto">
          {files.map((url, idx) => {
            const poseId = `${category}-${idx}-${url}`;
            return (
              <button
                key={poseId}
                onClick={()=>onAdd(poseId)}
                className="rounded-xl overflow-hidden border hover:ring-4 ring-blue-300/60 transition"
                title="Add to project"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-28 object-cover" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
