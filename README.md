# K Grand Hotel

Official website of K Grand Hotel, built with React, Vite, and Tailwind CSS.

## Requirements

- Node.js 22 (see [.nvmrc](.nvmrc)). Run `nvm use` in the project folder.

## Run Locally

1. Install dependencies:
   `npm install`
2. Start the dev server (http://localhost:3000):
   `npm run dev`

## Build

- `npm run build` creates a production build in `dist/`
- `npm run preview` serves the production build locally

## Booking System

Rooms, rates, availability, and bookings come from the K Grand admin system (`/root/k-grand-hotel`) through its public API.
nginx forwards `https://thekgrandhotel.com/api/public/` to the admin server on port 5051 (see `src/lib/bookingApi.ts`).
Website bookings arrive in the admin as **on hold** with source **Website**, and the guest pays at the hotel.

