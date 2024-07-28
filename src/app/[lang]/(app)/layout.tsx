import AppFooter from "@/components/global/footer";
import AppHeader from "@/components/global/header";

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-full flex flex-col text-sm">
            <AppHeader />
            <main>
                {children}
            </main>
            <AppFooter />
        </div>
    );
}