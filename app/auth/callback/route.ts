import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const returnTo = "/welcome";
  const errorUrl = new URL("/", request.url);

  if (!code) {
    errorUrl.searchParams.set("error", "missing_code");
    return NextResponse.redirect(errorUrl);
  }

  try {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) throw exchangeError;

    // getUser verifies the session with Supabase Auth. Identity and email never come from form fields.
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.email) throw new Error("Could not verify the Google profile.");

    const { error: insertError } = await supabase
      .from("waitlist")
      .upsert({ user_id: user.id, email: user.email }, { onConflict: "user_id", ignoreDuplicates: true })
      .select("id")
      .maybeSingle();

    if (insertError) {
      const failed = new URL("/", request.url);
      failed.searchParams.set("error", "save_failed");
      return NextResponse.redirect(failed);
    }

    return NextResponse.redirect(new URL(returnTo, request.url));
  } catch {
    errorUrl.searchParams.set("error", "auth_failed");
    return NextResponse.redirect(errorUrl);
  }
}
