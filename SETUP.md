# AdGo waitlist setup

This project contains the AdGo landing page, Google sign-in, and a private waitlist table. It does not include advertising campaign management. Google sign-in will work after you add your own Supabase and Google configuration.

## 1. Create a Supabase project

1. Sign in to [Supabase](https://supabase.com/) and create a project.
2. Choose a project name, a strong database password, and a region appropriate for your users.
3. Wait for the project to finish provisioning.

## 2. Copy the Supabase app settings

In the Supabase dashboard, open **Project Settings → API** (or the project's **Connect** dialog).

- Copy the **Project URL**.
- Copy the **Publishable key**. It is intended for browser apps and is protected by your database's RLS policies.
- Do not use or expose a `service_role` or secret key in this app.

Copy `.env.example` to `.env.local` in the project root, then replace the placeholders:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

`.env.local` is ignored by Git. Restart the development server after changing it.

## 3. Create the waitlist table and policies

In Supabase, open **SQL Editor → New query**. Copy and run the contents of [`supabase/migrations/20261104000000_create_waitlist.sql`](supabase/migrations/20261104000000_create_waitlist.sql).

The migration creates `public.waitlist` with one row per Auth user. RLS is enabled. Anonymous users have no table access. Signed-in users can read only their own row and can insert only a row whose user ID and email match their verified Supabase identity. Authenticated users cannot update or delete rows. The database unique constraint on `user_id` and conflict-safe insert prevent duplicate registrations.

The app inserts through its OAuth callback using the user returned by Supabase `getUser()`. It does not accept an email or user ID from an editable form. If insertion fails, the app returns to the landing page with an error instead of showing a success screen.

## 4. Create Google OAuth credentials

1. In [Google Cloud Console](https://console.cloud.google.com/), select or create a project.
2. Open **Google Auth Platform** (or **APIs & Services → OAuth consent screen**) and set up the consent screen. Choose **External** if the app is for public Google accounts, then enter the app name and support contact details.
3. While the consent screen is in testing, add the Google accounts you will use under **Audience → Test users**.
4. Open **Clients** (or **Credentials → Create credentials → OAuth client ID**) and create a **Web application** client.
5. In **Authorized JavaScript origins**, add `http://localhost:3000` for local development.
6. In **Authorized redirect URIs**, add the Supabase Auth callback shown in your Supabase dashboard under **Authentication → Sign In / Providers → Google**. It has this form:

   ```text
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```

   Use the exact callback URI displayed for your project. This Google redirect URI points to **Supabase Auth**, not to this Next.js app.
7. Copy the Google client ID and client secret into Supabase's Google provider settings, enable Google, and save. Do not put the Google client secret in this Next.js project.

## 5. Configure Supabase's app redirect URLs

In Supabase, open **Authentication → URL Configuration**:

- Set **Site URL** to `http://localhost:3000` for local development.
- Add `http://localhost:3000/auth/callback` to **Redirect URLs**.

This is the **Next.js app callback URL**. Supabase redirects back to it after Google returns to Supabase. The two callbacks are different:

| Setting | URL | Where to configure it |
| --- | --- | --- |
| Google authorized redirect URI | `https://<your-project-ref>.supabase.co/auth/v1/callback` | Google Cloud OAuth client; copy the exact URI from Supabase |
| Next.js app callback | `http://localhost:3000/auth/callback` | Supabase Authentication URL Configuration |

For a deployed app later, add its HTTPS callback URL to Supabase's Redirect URLs and update its Site URL. Do not invent a production URL before you have a deployment domain.

## 6. Run and test locally

From the project directory, install packages and start Next.js:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then:

1. Choose **Pievienoties ar Google**.
2. Sign in using a Google account listed as a test user if the consent screen is still in testing.
3. Confirm you return to `/welcome` and see your name, Google profile picture (if available), email, and the collapsible profile metadata.
4. Expand **Google profila informācija** to review the metadata returned by Google through Supabase.
5. Refresh the page; the session should remain active. Sign out, then sign in again. You should still have only one waitlist row.
6. In Supabase, open **Table Editor → waitlist** and confirm that your user ID, verified email, and creation time appear. The table itself never stores the Google profile metadata.

If you see a Supabase configuration message, check the two `.env.local` values and restart Next.js. If sign-in returns an error, check the Supabase Auth logs and the policies/table migration.

## Troubleshooting `redirect_uri_mismatch`

This error usually means the redirect URI sent to Google differs from the URI registered on the Google OAuth client. Open the Supabase Google provider settings and copy its exact callback URI into Google Cloud under **Authorized redirect URIs**. It should be the Supabase Auth URL ending in `/auth/v1/callback`, not `http://localhost:3000/auth/callback`. Then make sure Supabase **Authentication → URL Configuration → Redirect URLs** includes the Next.js app callback `http://localhost:3000/auth/callback`. Check for typos, extra spaces, a different project reference, or `http`/`https` differences.

## How the login and waitlist flow works

The browser starts Google sign-in through Supabase Auth. Google returns to Supabase, and Supabase redirects to the Next.js callback with a short-lived authorization code. The callback exchanges that code for a cookie-based session, asks Supabase Auth to verify the user, then inserts the verified user ID and email into `waitlist`. PostgreSQL RLS checks the same identity and email, while a unique constraint makes repeat sign-ins safe. The app then renders the personalized confirmation page from that verified session.
