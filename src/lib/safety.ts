export type EmergencyContact = {
  id: string;
  name: string;
  phone: string;   // E.164 (e.g., +15551234567) preferred for WhatsApp
  email?: string;
};

const LS_KEY = "999";
const POLICE_KEY = "999";

export function loadContacts(): EmergencyContact[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveContacts(contacts: EmergencyContact[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(contacts));
}

export function loadPoliceNumber(): string {
  return localStorage.getItem(POLICE_KEY) || "999"; // change default to your region
}

export function savePoliceNumber(num: string) {
  localStorage.setItem(POLICE_KEY, num);
}

export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Geolocation not supported"));
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });
}

export function mapsLink(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export function buildAlertMessage(opts: {
  who: "police" | "contact";
  rideId?: string;
  lat?: number;
  lng?: number;
}) {
  const lines: string[] = [];
  lines.push("🚨 EMERGENCY ALERT");
  if (opts.rideId) lines.push(`Ride ID: ${opts.rideId}`);
  if (opts.lat != null && opts.lng != null) lines.push(`Location: ${mapsLink(opts.lat, opts.lng)}`);
  lines.push("Please help immediately.");
  return lines.join("\n");
}

// Deep links
export function smsLink(phone: string, body: string) {
  // RFC: some platforms use ?body=, others &body=. This covers most.
  return `sms:${encodeURIComponent(phone)}?&body=${encodeURIComponent(body)}`;
}

export function callLink(phone: string) {
  return `tel:${encodeURIComponent(phone)}`;
}

export function whatsappLink(phone: string, text: string) {
  // phone must be E.164 without '+' sometimes; both widely supported:
  const normalized = phone.replace(/\D/g, "");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}

export function mailtoLink(email: string, subject: string, body: string) {
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
