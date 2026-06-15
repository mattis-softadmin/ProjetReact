import { useState } from "react";

interface Tache {
  id: number;
  titre: string;
  avancement: number;
  priorite: "haute" | "moyenne" | "basse";
  terminee: boolean;
}

export default function App() {
  const [taches, setTaches] = useState<Tache[]>([]);
  const [titre, setTitre] = useState("");
  const [priorite, setPriorite] = useState<Tache["priorite"]>("basse");
  const [onglet, setOnglet] = useState<"encours" | "terminees">("encours");

  function ajouterTache() {
    if (!titre.trim()) return;
    const nouvelle: Tache = {
      id: Date.now(),
      titre,
      avancement: 0,
      priorite,
      terminee: false,
    };
    setTaches([...taches, nouvelle]);
    setTitre("");
  }

  function supprimerTache(id: number) {
    setTaches(taches.filter((t) => t.id !== id));
  }

  function changerAvancement(id: number, valeur: number) {
    if (valeur === 100) {
      const confirmer = confirm("La tâche est-elle bien terminée ?");
      if (confirmer) {
        setTaches(taches.map((t) => t.id === id ? { ...t, avancement: 100, terminee: true } : t));
        return;
      } else {
        setTaches(taches.map((t) => t.id === id ? { ...t, avancement: 80 } : t));
        return;
      }
    }
    setTaches(taches.map((t) => t.id === id ? { ...t, avancement: valeur } : t));
  }

  const tachesFiltrees = taches.filter((t) =>
    onglet === "terminees" ? t.terminee : !t.terminee
  );

  return (
    <div className="container">
      <h1>Gestionnaire de tâches</h1>

      {/* Onglets */}
      <div className="onglets">
        <button className={onglet === "encours" ? "onglet actif" : "onglet"} onClick={() => setOnglet("encours")}>En cours</button>
        <button className={onglet === "terminees" ? "onglet actif" : "onglet"} onClick={() => setOnglet("terminees")}>Terminées</button>
      </div>

      {/* Formulaire */}
      {onglet === "encours" && (
        <div className="form">
          <input
            type="text"
            placeholder="Nouvelle tâche..."
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ajouterTache()}
          />
          <select value={priorite} onChange={(e) => setPriorite(e.target.value as Tache["priorite"])}>
            <option value="basse">🟢 Basse</option>
            <option value="moyenne">🟡 Moyenne</option>
            <option value="haute">🔴 Haute</option>
          </select>
          <button onClick={ajouterTache}>Ajouter</button>
        </div>
      )}

      {/* Liste */}
      <ul className="task-list">
        {tachesFiltrees.map((t) => (
          <li key={t.id}>
            <span className="titre">{t.titre}</span>
            <span className={`prio ${t.priorite}`}>{t.priorite}</span>
            <select
              value={t.avancement}
              disabled={t.terminee}
              onChange={(e) => changerAvancement(t.id, Number(e.target.value))}
            >
              {[0, 20, 50, 80, 100].map((v) => (
                <option key={v} value={v}>{v}%</option>
              ))}
            </select>
            <button onClick={() => supprimerTache(t.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}