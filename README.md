# Vecchio Restaurant 

A mobile-first React prototype for 6012CEM CW2 usability testing.

## Run locally

1. Install Node.js 18+.
2. Open this folder in Terminal.
3. Run:

```bash
npm install
npm run dev
```

4. Open the local URL shown by Vite.

## Testing login

- Phone: `0123456789`
- Password: `demo123`

The login form also accepts any phone number with at least 8 digits and any password with at least 4 characters.

## Main completed flow

Login → Home → Menu → New Reservation → Date/Time/Guests → Special Request → Table Selection → Review → Confirmation → My Bookings.

The app stores bookings in browser localStorage so Task 5 can be completed after Task 4.

See `TESTING_TASKS.md` for the exact five tasks to use on both Lo-Fi and Hi-Fi prototypes.
