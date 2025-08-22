import { PlusIcon } from "lucide-react"
import { Accordion as AccordionPrimitive } from "radix-ui"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion"
import Logo from "@/assets/icons/Logo"
import { Link } from "react-router"

const items = [
  {
    id: "1",
    title: "How do I book a ride?",
    content:
      "Booking a ride is simple! Just open the app, enter your pickup and destination locations, select your preferred vehicle type, and confirm your booking. You'll see the estimated fare and arrival time before confirming. Once confirmed, you can track your driver's location in real-time.",
  },
  {
    id: "2",
    title: "What payment methods are accepted?",
    content:
      "We accept various payment methods including credit/debit cards, mobile wallets, and cash. You can set your preferred payment method in the app settings. All digital payments are securely processed and encrypted for your safety.",
  },
  {
    id: "3",
    title: "How do I become a driver/rider on your platform?",
    content:
      "To join as a driver/rider, download our partner app, complete the registration process, submit required documents (license, vehicle registration, insurance), and pass our background check. Once approved, you can start accepting rides and earning money immediately.",
  },
  {
    id: "4",
    title: "What if I need to cancel my ride?",
    content:
      "You can cancel your ride free of charge within the first 2 minutes of booking. After that, a cancellation fee may apply depending on how long the driver has been waiting. Cancellation policies are clearly displayed before you confirm the booking.",
  },
]

export default function FAQ() {
  return (
    <div className="container mx-auto flex flex-col justify-center items-center space-y-4 mt-20">
      <Link to="/"><Logo></Logo></Link>
      <h2 className="text-xl font-bold mt-5">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full" defaultValue="3">
        {items.map((item) => (
          <AccordionItem value={item.id} key={item.id} className="py-2">
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left text-sm text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
                {item.title}
                <PlusIcon
                  size={16}
                  className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                  aria-hidden="true"
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className="text-muted-foreground pb-2">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
