/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Share2, Siren, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import {
  type EmergencyContact,
  loadContacts,
  loadPoliceNumber,
  getCurrentPosition,
  buildAlertMessage,
  callLink,
} from "@/lib/safety";
import { useCreateAlertMutation } from "@/redux/features/alert/alert.api";

type Props = {
  activeRideId?: string | null;
};

export default function SOSButton({ activeRideId }: Props) {
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [policeNumber, setPoliceNumber] = useState<string>("999");
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(false);

  const [createAlert, { isLoading: sendingAlert }] = useCreateAlertMutation();

  const hasActiveRide = Boolean(activeRideId);

  useEffect(() => {
    setContacts(loadContacts());
    setPoliceNumber(loadPoliceNumber());
  }, []);

  async function ensureLocation() {
    if (loc) return loc;
    try {
      setLoadingLoc(true);
      const pos = await getCurrentPosition();
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setLoc(coords);
      toast.success("Location acquired");
      return coords;
    } catch (e: any) {
      toast.error(e?.message || "Failed to get location");
      throw e;
    } finally {
      setLoadingLoc(false);
    }
  }

  async function onCallPolice() {
    await ensureLocation().catch(() => {});
    window.location.href = callLink(policeNumber);
  }

  async function onShareLocationAll() {
    try {
      const { lat, lng } = await ensureLocation();
      const text = buildAlertMessage({ who: "contact", rideId: activeRideId || undefined, lat, lng });

      await createAlert({
        rideId: activeRideId,
        location: { lat, lng },
        contacts,
        message: text,
      }).unwrap();

      toast.success("Emergency notifications sent 🚨");
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to send alerts");
    }
  }

  // async function onNotifyContact(c: EmergencyContact, channel: "whatsapp" | "sms" | "call" | "email") {
  //   try {
  //     const { lat, lng } = await ensureLocation();
  //     const text = buildAlertMessage({ who: "contact", rideId: activeRideId || undefined, lat, lng });

  //     if (channel === "whatsapp") {
  //       window.open(whatsappLink(c.phone, text), "_blank");
  //       toast.success(`WhatsApp ready for ${c.name}`);
  //     } else if (channel === "sms") {
  //       window.location.href = smsLink(c.phone, text);
  //     } else if (channel === "call") {
  //       window.location.href = callLink(c.phone);
  //     } else if (channel === "email") {
  //       if (c.email) {
  //         window.location.href = mailtoLink(c.email, "EMERGENCY ALERT", text);
  //       } else {
  //         toast.error("No email set for this contact");
  //       }
  //     }
  //   } catch {
  //     // already handled
  //   }
  // }

  if (!hasActiveRide) return null;

  return (
    <>
      {/* Floating action button */}
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        variant="destructive"
        aria-label="Open SOS"
      >
        <Siren className="h-5 w-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" /> Emergency / SOS
            </SheetTitle>
            <SheetDescription>
              Quickly contact help and share your live location. Ride: <span className="font-medium">{activeRideId}</span>
            </SheetDescription>
          </SheetHeader>

          {/* actions here ... */}
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card>
                <CardContent className="p-4 flex gap-3 items-center">
                  <Button className="w-full" variant="destructive" onClick={onCallPolice}>
                    <Phone className="mr-2 h-4 w-4" /> Call Police ({policeNumber})
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex gap-3 items-center">
                  <Button className="w-full" variant="secondary" onClick={onShareLocationAll} disabled={loadingLoc || sendingAlert}>
                    <Share2 className="mr-2 h-4 w-4" /> {sendingAlert ? "Sending..." : "Share Live Location"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
