import { redirect } from "next/navigation";

/**
 * The former demo page contained a non-playing placeholder video and invented
 * performance/accessibility numbers. Free assets are the real hands-on trial
 * surface, so the legacy URL now leads there.
 */
export default function DemoPage() {
  redirect("/freebies");
}
