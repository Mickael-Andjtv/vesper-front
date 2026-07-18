# Blinky Robot Eyes — Next.js

Ce projet a été converti depuis TanStack Start (Vite) vers **Next.js (App Router)**, avec **pnpm** comme gestionnaire de paquets.

## Ce qui a changé

- `src/routes/index.tsx` → `app/page.tsx`
- `src/routes/__root.tsx` → `app/layout.tsx` (+ `app/not-found.tsx` et `app/error.tsx` pour les pages 404 / erreur)
- `src/styles.css` → `app/globals.css` (Tailwind v4, syntaxe adaptée pour Next.js)
- `src/components/`, `src/hooks/`, `src/lib/` → déplacés à la racine (`components/`, `hooks/`, `lib/`), inchangés sinon l'ajout de `"use client"` là où nécessaire
- Suppression des fichiers spécifiques à TanStack Start / Lovable (`router.tsx`, `start.ts`, `server.ts`, `routeTree.gen.ts`, `lib/error-*.ts`, `.lovable/`) qui n'ont pas d'équivalent nécessaire en Next.js
- `vite.config.ts` → `next.config.ts` + `postcss.config.mjs`
- `bun.lock` → sera remplacé par `pnpm-lock.yaml` après `pnpm install`

L'alias `@/*` pointe maintenant vers la racine du projet (au lieu de `src/`), donc `@/components/...`, `@/lib/utils`, `@/hooks/...` fonctionnent tels quels.

## Installation

```bash
pnpm install
```

## Développement

```bash
pnpm dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Build de production

```bash
pnpm build
pnpm start
```

## Note

L'environnement dans lequel ce projet a été généré n'a pas d'accès réseau, donc `pnpm install` / `pnpm build` n'ont pas pu être exécutés ici pour valider le build. Merci de lancer `pnpm install` puis `pnpm dev` en local pour vérifier que tout fonctionne — n'hésite pas à me signaler toute erreur, je pourrai la corriger.
