import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft } from 'lucide-react';

const ProfileHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Simply navigate to home for now
    navigate('/');
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <Button
        variant="outline"
        onClick={() => navigate('/dashboard')}
        className="gap-2 bg-white/10 backdrop-blur-lg border border-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <Button
        variant="outline"
        onClick={handleLogout}
        className="gap-2 bg-white/10 backdrop-blur-lg border border-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};

export default ProfileHeader;
