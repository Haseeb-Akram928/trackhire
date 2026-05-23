import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { Topbar } from "@/components/layout/Topbar/Topbar";
import styles from "./layout.module.css";

export default async function DashboardLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.contentWrapper}>
        <Topbar user={user} />
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}
