import React from 'react';
import TerminalWindow from './TerminalWindow';
import QueryOutput from './QueryOutput';
import KeyboardOverlay from './KeyboardOverlay';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import Scanlines from './Scanlines';

const TerminalLayout = () => (
  <div className="w-screen h-screen bg-black text-white font-mono grid grid-cols-12 grid-rows-[auto_1fr_auto] overflow-hidden relative">
    <Scanlines />

    {/* Top header */}
    <div className="col-span-12 px-4 py-2 border-b border-gray-600 text-xs">
      17:14:29 | SYSTEM CONSOLE - FinRAG v1.0
    </div>

    {/* Left sidebar */}
    <SidebarLeft />

    {/* Main terminal content */}
    <div className="col-span-8 p-4 overflow-y-auto">
      <TerminalWindow />
      <QueryOutput />
    </div>

    {/* Right sidebar */}
    <SidebarRight />

    {/* Footer keyboard overlay */}
    <div className="col-span-12 border-t border-gray-600 p-4">
      <KeyboardOverlay />
    </div>
  </div>
);

export default TerminalLayout;
