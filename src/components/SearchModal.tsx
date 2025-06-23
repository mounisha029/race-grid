
import { useState, useEffect } from "react";
import { Search, Users, Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  name: string;
  type: "driver" | "team";
  subtitle?: string;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Mock data - in a real app, this would come from your API
  const mockDrivers = [
    { id: "verstappen", name: "Max Verstappen", type: "driver" as const, subtitle: "Red Bull Racing" },
    { id: "hamilton", name: "Lewis Hamilton", type: "driver" as const, subtitle: "Mercedes" },
    { id: "leclerc", name: "Charles Leclerc", type: "driver" as const, subtitle: "Ferrari" },
    { id: "norris", name: "Lando Norris", type: "driver" as const, subtitle: "McLaren" },
  ];

  const mockTeams = [
    { id: "red-bull", name: "Red Bull Racing", type: "team" as const, subtitle: "Oracle Red Bull Racing" },
    { id: "mercedes", name: "Mercedes", type: "team" as const, subtitle: "Mercedes-AMG Petronas F1 Team" },
    { id: "ferrari", name: "Ferrari", type: "team" as const, subtitle: "Scuderia Ferrari" },
    { id: "mclaren", name: "McLaren", type: "team" as const, subtitle: "McLaren F1 Team" },
  ];

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      const allItems = [...mockDrivers, ...mockTeams];
      const filtered = allItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === "driver") {
      navigate("/drivers");
    } else {
      navigate("/teams");
    }
    onClose();
    setQuery("");
  };

  const handleClose = () => {
    onClose();
    setQuery("");
    setResults([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search Drivers & Teams</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search for drivers or teams..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="max-h-80 overflow-y-auto space-y-1">
            {isLoading && (
              <div className="text-center text-muted-foreground py-4">
                Searching...
              </div>
            )}

            {!isLoading && query && results.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                No results found for "{query}"
              </div>
            )}

            {!isLoading && results.map((result) => (
              <Button
                key={result.id}
                variant="ghost"
                className="w-full justify-start h-auto p-3"
                onClick={() => handleResultClick(result)}
              >
                <div className="flex items-center space-x-3">
                  {result.type === "driver" ? (
                    <Users className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Trophy className="w-4 h-4 text-orange-500" />
                  )}
                  <div className="text-left">
                    <div className="font-medium">{result.name}</div>
                    {result.subtitle && (
                      <div className="text-sm text-muted-foreground">
                        {result.subtitle}
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {!query && (
            <div className="text-center text-muted-foreground text-sm py-4">
              Start typing to search for drivers and teams
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
