import { planetaryDaysElapsed } from "./planetTimer.js";
const clockOutside = document.querySelector(".clockOutside");
const clockInside = document.querySelector(".clockInside");

const legends = document.querySelectorAll(".legend");

const calculateBoxShadow = (
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  opts = { maxLen: 36, minLen: 10, maxBlur: 48, minBlur: 16, alpha: 0.6 }
) => {
  // const now = new Date();
  const now = new Date();

  // Get local time in the requested timezone
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZone,
  }).formatToParts(now);

  const H = +parts.find((p) => p.type === "hour").value;
  const M = +parts.find((p) => p.type === "minute").value;
  const S = +parts.find((p) => p.type === "second").value;

  // Dynamic shadow during daytime (roughly 6:00–18:00 local time)
  const isDay = H >= 6 && H < 18;
  if (!isDay) {
    // Default, more pronounced night shadow (fixed direction/size)
    return "5px 5px 10px rgba(0,0,0,0.55), -5px -5px 10px rgba(0,0,0,0.45)";
  }

  // Fraction of the day [0..1]
  const dayFrac = (H + M / 60 + S / 3600) / 24;

  // Angle of incoming light. We shift so that NOON is "from top".
  // CSS box-shadows use +x right, +y down. We'll compute a unit vector.
  const lightAngle = dayFrac * 2 * Math.PI + Math.PI / 2; // noon -> from top
  // Shadow goes in the opposite direction of light
  const shadowAngle = lightAngle + Math.PI;
  const dx = Math.cos(shadowAngle);
  const dy = Math.sin(shadowAngle);

  // Simple “sun elevation” proxy: peaks at noon, zero at midnight
  const daylight = Math.max(0, Math.sin(Math.PI * dayFrac)); // [0..1]

  // Longer shadows when the sun is low: length ∝ (1 - daylight)
  const len = opts.minLen + (opts.maxLen - opts.minLen) * (1 - daylight);
  const blur =
    opts.minBlur + (opts.maxBlur - opts.minBlur) * (1 - 0.6 * daylight);
  const x = (dx * len).toFixed(2);
  const y = (dy * len).toFixed(2);
  const a = (opts.alpha * (0.25 + 0.75 * (1 - daylight))).toFixed(3); // darker at night

  // Return a nice layered shadow (hard + soft)
  return `${x}px ${y}px ${Math.round(blur / 2)}px rgba(0,0,0,${a}),
          ${x}px ${y}px ${Math.round(blur)}px rgba(0,0,0,${(a * 0.7).toFixed(
    3
  )})`;
};

const secondsHand = document.querySelector(".secondHand");
const minutesHand = document.querySelector(".minuteHand");
const tick2 = document.querySelector("#tick2");
const lightOverlay = document.querySelector(".lightOverlay");

const soundOn = document.querySelector(".soundOn");
const soundOff = document.querySelector(".soundOff");
let sound = true;

let selectedDate = new Date("2001-01-04T00:00:00.000Z");

soundOn.addEventListener("click", () => {
  sound = false;
  soundOff.style.display = "block";
  soundOn.style.display = "none";
});
soundOff.addEventListener("click", () => {
  sound = true;

  soundOn.style.display = "block";
  soundOff.style.display = "none";
});

const positionClockLegendNumbers = () => {
  const radius = clockOutside.offsetWidth / 2;
  const centerX = clockOutside.offsetWidth / 2;
  const centerY = clockOutside.offsetHeight / 2;

  for (let i = 0; i < legends.length; i++) {
    const legend = legends[i];

    // angle per legend (12 divisions)
    // start at -90° (Math.PI/2) so 12 is at the top
    const angle = (i / legends.length) * 2 * Math.PI - Math.PI / 2;

    // position
    const x = centerX + (radius - 20) * Math.cos(angle);
    const y = centerY + (radius - 20) * Math.sin(angle);

    legend.style.position = "absolute";
    legend.style.left = x + "px";
    legend.style.top = y + "px";
  }

  if (sound) {
    soundOn.style.display = "block";
    soundOff.style.display = "none";
  } else {
    soundOff.style.display = "block";
    soundOn.style.display = "none";
  }
};

const rotateHands = () => {
  const now = new Date();
  planetaryDaysElapsed(selectedDate);
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();

  // Degrees
  const secondsDegree = (seconds / 60) * 360;
  const minutesDegree = (minutes / 60) * 360;
  const hourDegree = hours * 30 - 15;

  clockInside.style.transform = `rotate(${hourDegree}deg)`;

  secondsHand.style.transform = `translate(-50%, -100%) rotate(${secondsDegree}deg)`;

  minutesHand.style.transform = `translate(-50%, -100%) rotate(${minutesDegree}deg)`;
  // TIck every second
  if (sound) {
    tick2.play();
  } else {
    tick2.pause();
  }
  const shadow = calculateBoxShadow("Asia/Kolkata");
  clockInside.style.boxShadow = shadow;
  secondsHand.style.boxShadow = shadow;

  // Update directional light gradient angle
  try {
    const nowTz = new Date(time);
    const parts = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
      timeZone: "Asia/Kolkata",
    }).formatToParts(nowTz);
    const H = +parts.find((p) => p.type === "hour").value;
    const M = +parts.find((p) => p.type === "minute").value;
    const S = +parts.find((p) => p.type === "second").value;
    const dayFrac = (H + M / 60 + S / 3600) / 24;
    const lightAngleRad = dayFrac * 2 * Math.PI + Math.PI / 2;
    const lightAngleDeg = ((lightAngleRad * 180) / Math.PI) % 360;
    if (lightOverlay)
      lightOverlay.style.setProperty("--light-angle", lightAngleDeg + "deg");
  } catch (_) {
    // ignore if Intl timeZone not available
  }
};

setInterval(rotateHands, 1000);
rotateHands();
positionClockLegendNumbers();
