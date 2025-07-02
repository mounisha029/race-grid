
import { useState, ReactNode } from 'react';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';
import { Card } from "@/components/ui/card";

interface SwipeableTabContentProps {
  tabs: {
    id: string;
    label: string;
    content: ReactNode;
  }[];
  defaultTab?: string;
}

const SwipeableTabContent = ({ tabs, defaultTab }: SwipeableTabContentProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);

  const goToNextTab = () => {
    const nextIndex = (currentIndex + 1) % tabs.length;
    setActiveTab(tabs[nextIndex].id);
  };

  const goToPrevTab = () => {
    const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    setActiveTab(tabs[prevIndex].id);
  };

  const swipeHandlers = useSwipeGestures({
    onSwipeLeft: goToNextTab,
    onSwipeRight: goToPrevTab,
    threshold: 75
  });

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto scrollbar-hide mb-4">
        <div className="flex space-x-1 min-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                min-w-0 whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'bg-f1-red text-white shadow-lg' 
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <Card
        className="min-h-64 touch-pan-x"
        {...swipeHandlers}
      >
        <div className="p-4">
          {tabs.find(tab => tab.id === activeTab)?.content}
        </div>
      </Card>

      {/* Swipe Indicator */}
      <div className="flex justify-center space-x-2 mt-4">
        {tabs.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex ? 'bg-f1-red' : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SwipeableTabContent;
