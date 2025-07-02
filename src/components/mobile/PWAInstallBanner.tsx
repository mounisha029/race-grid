
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, X } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

const PWAInstallBanner = () => {
  const [dismissed, setDismissed] = useState(false);
  const { isInstallable, installPWA } = usePWA();

  if (!isInstallable || dismissed) {
    return null;
  }

  return (
    <Card className="mx-4 mb-4 bg-gradient-to-r from-f1-red to-f1-orange">
      <CardContent className="p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <Download className="w-5 h-5" />
            <div>
              <h3 className="font-semibold text-sm">Install F1 Box Box</h3>
              <p className="text-xs opacity-90">Get the full app experience</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              variant="secondary"
              onClick={installPWA}
              className="text-xs px-3 py-1"
            >
              Install
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setDismissed(true)}
              className="text-white hover:bg-white/20 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PWAInstallBanner;
