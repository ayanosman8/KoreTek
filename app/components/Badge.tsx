import React from 'react';
import { Badge } from "@/components/ui/badge";

export default function WorkBadge() {
  return (
    
      <Badge className="border-green-600 absolute  top-16 right-40  text-white hover:bg-green-600 transition-all duration-300 p-2 rounded-md flex items-center space-x-2">
        <p className="font-semibold">Available for Work</p>

        <div className="absolute w-24 h-3 rounded-full bg-green-700 animate-pulse transition-all duration-300 inset-0.5 top-[-0.25rem] right-[-0.25rem]" />
      </Badge>
 
  );
}
