import React, { useEffect, useState } from "react";

const SysinfoPanel = () => {
  const [now, setNow] = useState(new Date());
  const [uptime, setUptime] = useState("0d00:00");
  const [osType, setOsType] = useState("UNIX");
  const [battery, setBattery] = useState("ON");

  useEffect(() => {
    const tick = () => setNow(new Date());
    const clockTimer = setInterval(tick, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  useEffect(() => {
    updateUptime();
    updateOSType();
    updateBattery();
    const uptimeTimer = setInterval(updateUptime, 60000);
    const batteryTimer = setInterval(updateBattery, 5000);
    return () => {
      clearInterval(uptimeTimer);
      clearInterval(batteryTimer);
    };
  }, []);

  const updateUptime = () => {
    const seconds = Math.floor(performance.now() / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = String(Math.floor((seconds % 86400) / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    setUptime(`${days}d${hours}:${minutes}`);
  };

  const updateOSType = () => {
    const platform = navigator.userAgent.toLowerCase();
    if (platform.includes("win")) setOsType("WIN");
    else if (platform.includes("mac")) setOsType("macOS");
    else if (platform.includes("linux")) setOsType("LINUX");
    else setOsType("UNIX");
  };

  const updateBattery = async () => {
    if (navigator.getBattery) {
      const bat = await navigator.getBattery();
      if (bat.charging) setBattery("CHARGE");
      else if (bat.level < 0.05) setBattery("LOW");
      else setBattery(`${Math.round(bat.level * 100)}%`);
    } else {
      setBattery("ON");
    }
  };

  const year = now.getFullYear();
  const month = now.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = now.getDate();

  return (
    <div className="sysinfo-panel">
      <div className="sysinfo-block">
        <div className="sysinfo-label">YEAR</div>
        <div>{year}</div>
        <div>{month} {day}</div>
      </div>
      <div className="sysinfo-block">
        <div className="sysinfo-label">UPTIME</div>
        <div className="sysinfo-value">{uptime}</div>
      </div>
      <div className="sysinfo-block">
        <div className="sysinfo-label">TYPE</div>
        <div>{osType}</div>
      </div>
      <div className="sysinfo-block">
        <div className="sysinfo-label">POWER</div>
        <div>{battery}</div>
      </div>
    </div>
  );
};

export default SysinfoPanel;
