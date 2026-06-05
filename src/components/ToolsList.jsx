import { collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../firebaseConfig";
import React from "react";

const fallbackTools = [
  { id: "js1", nombre: "JAVASCRIPT", categoria: "language", nivel: "expert" },
  { id: "react1", nombre: "REACT JS", categoria: "development", nivel: "advanced" },
  { id: "figma1", nombre: "FIGMA", categoria: "design", nivel: "expert" },
  { id: "unity1", nombre: "UNITY", categoria: "game", nivel: "expert" },
  { id: "ux", nombre: "USER EXPERIENCE", categoria: "methodology", nivel: "expert" },
  { id: "team", nombre: "TEAMWORK", categoria: "skill", nivel: "advanced" },
];

const groupLabels = {
  development: "FRONTEND",
  language: "LENGUAJES",
  design: "DISEÑO",
  game: "JUEGOS",
  productivity: "HERRAMIENTAS",
  hard: "TECH STACK",
  methodology: "PROCESO",
  skill: "MINDSET",
  soft: "MINDSET",
  other: "OTRAS",
};

const categoryMap = {
  tool: "productivity",
  tools: "productivity",
  herramienta: "productivity",
  herramientas: "productivity",
  technical: "hard",
  tech: "hard",
  code: "development",
};

const levelValueMap = {
  basic: 1,
  basico: 1,
  "básico": 1,
  beginner: 1,
  junior: 1,
  intermediate: 2,
  intermedio: 2,
  medium: 2,
  advanced: 3,
  avanzado: 3,
  senior: 3,
  expert: 4,
  experto: 4,
  master: 4,
};

const normalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const getGroupId = (tool) => {
  const rawCategory = normalize(tool.categoria || tool.category || tool.tipo || "hard");
  const mappedCategory = categoryMap[rawCategory] || rawCategory;
  if (groupLabels[mappedCategory]) return mappedCategory;

  const name = normalize(tool.nombre || tool.name);
  if (["react", "next", "html", "css", "javascript", "typescript", "firebase", "node"].some((term) => name.includes(term))) {
    return "development";
  }
  if (["unity", "godot", "unreal", "construct"].some((term) => name.includes(term))) return "game";
  if (["figma", "photoshop", "illustrator", "blender", "design"].some((term) => name.includes(term))) return "design";
  return "other";
};

const getLevelValue = (tool) => {
  const rawLevel = tool.nivel ?? tool.level ?? tool.proficiency ?? 2;
  if (typeof rawLevel === "number") return Math.max(1, Math.min(4, Math.round(rawLevel)));
  return levelValueMap[normalize(rawLevel)] || 2;
};

const SkillBars = ({ value }) => (
  <span className="skill-bars" aria-label={`Nivel ${value} de 4`}>
    {[1, 2, 3, 4].map((bar) => (
      <span key={bar} className={bar <= value ? "is-filled" : ""} />
    ))}
  </span>
);

const ToolsList = () => {
  const q = collection(db, "herramientas");
  const [herramientas, loading, error] = useCollectionData(q, { idField: "id" });

  if (loading) return <p className="text-current animate-pulse font-mono uppercase">Cargando habilidades...</p>;
  if (error) return <p className="text-red-500 font-bold uppercase">Error: {error.message}</p>;

  const baseData = herramientas && herramientas.length > 0 ? herramientas : fallbackTools;
  const groupedSkills = baseData.reduce((groups, tool) => {
    const groupId = getGroupId(tool);
    if (!groups[groupId]) {
      groups[groupId] = {
        id: groupId,
        label: groupLabels[groupId] || groupId.toUpperCase(),
        items: [],
      };
    }

    groups[groupId].items.push({
      ...tool,
      name: tool.nombre || tool.name || "Skill",
      level: getLevelValue(tool),
    });

    return groups;
  }, {});

  const groups = Object.values(groupedSkills).filter((group) => group.items.length > 0);

  return (
    <div className="skill-tree">
      {groups.map((group, groupIndex) => (
        <section key={group.id} className="skill-tree-group">
          <h3 className="skill-tree-parent">{group.label}</h3>
          <div className="skill-tree-children">
            {group.items.map((skill, index) => (
              <div key={skill.id || `${group.id}-${skill.name}-${index}`} className="skill-tree-row">
                <span className="skill-tree-branch" aria-hidden="true">
                  {index === group.items.length - 1 ? "└─" : "├─"}
                </span>
                <span className="skill-tree-name">{skill.name}</span>
                <SkillBars value={skill.level} />
              </div>
            ))}
          </div>
          {groupIndex < groups.length - 1 && <div className="skill-tree-gap" aria-hidden="true" />}
        </section>
      ))}
    </div>
  );
};

export default ToolsList;
