import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Card, CardHeader } from "../ui/Card";
import BurgerMenu from "./BurgerMenu";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CustomDragLayer from "../CustomDragLayer";
import { InstallPrompt } from "../InstallPrompt";
import { OfflineIndicator } from "../OfflineIndicator";
import { SyncButton } from "../SyncButton";
import { PWAFallback } from "../PWAFallback";
import { SyncLoadingOverlay } from "../SyncLoadingOverlay";
import { GitHubAuthStatus } from "../GitHubAuthStatus";
import { LoadModelButton } from "../LoadModelButton";

const Layout: React.FC = () => {
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="min-h-screen p-4 sm:py-8 sm:px-4 flex flex-col items-center bg-gray-100 text-gray-900 h-screen">
                <CustomDragLayer />
                <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
                <SyncLoadingOverlay />
                <PWAFallback />
                <Card className="w-full max-w-5xl shadow-2xl flex flex-col flex-grow">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <BurgerMenu className="mr-2" />
                                <div className="text-xl sm:text-2xl font-bold">Themis</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 flex items-center justify-center">
                                    <InstallPrompt />
                                </div>
                                <div className="w-10 h-10 flex items-center justify-center">
                                    <SyncButton variant="icon-only" />
                                </div>
                                <div className="w-10 h-10 flex items-center justify-center">
                                    <GitHubAuthStatus />
                                </div>
                                <div className="w-10 h-10 flex items-center justify-center">
                                    <LoadModelButton />
                                </div>
                                <div className="w-10 h-10 flex items-center justify-center">
                                    <OfflineIndicator />
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    {/* Main content area, using Outlet for routing */}
                    <Outlet />
                </Card>

                <footer className="mt-4 sm:mt-8 text-center text-xs sm:text-sm text-gray-500">
                    <p>Drag & drop to re-organize. Hover over nodes for actions.</p>
                    <p>Powered by React, Tailwind CSS, Framer Motion. Clipboard actions use system clipboard.</p>
                    <p>&copy; 2025 Thomas Klok Rohde. All rights reserved.</p>
                </footer>
            </div>
        </DndProvider>
    );
};

export default Layout;
