# Tenant Management App

Multi-tenant admin app for managing Users, Roles, Sites, and Dashboard metrics. Auth via JWT + RBAC, UI built with React + Mantine

## Tech Stack

- Backend: Node.js, Express, MongoDB (Atlas), JWT, RBAC
- Frontend: React (Vite), React Router, Mantine UI
- Deployment: Backend on Render/Railway, Frontend on Vercel/Netlify

## Features

- Auth:
  - Email/password login (`/api/auth/login`)
  - JWT tokens, role + permissions in payload
  - Seeded admin (`/api/auth/seed-admin` → `admin@tenantapp.local` / `Admin@123`)
- Users:
  - List with pagination, search, filters
  - Create, update, deactivate
  - Fields: name, email, role, site, status
- Roles:
  - CRUD with `permissions[]`
  - Prevent deletion when role is assigned to users
- Sites:
  - CRUD, fields: name, location, timezone, status
  - Prevent deletion when assigned to users
- Dashboard:
  - Total users, active users, total roles, total sites
- Timezones:
  - `/api/timezones` proxy to timeapi for timezone dropdowns

