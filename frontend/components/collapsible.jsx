"use client"

import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.Trigger

const CollapsibleContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden transition-all"
    {...props}>
    {children}
  </CollapsiblePrimitive.Content>
))
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }

