
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-faktura-dark-blue mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">الصفحة غير موجودة</p>
        <p className="text-lg mb-8">عذرًا، الصفحة التي تبحث عنها غير موجودة.</p>
        <Button 
          onClick={() => navigate("/")} 
          className="bg-faktura-blue hover:bg-faktura-dark-blue"
        >
          العودة للصفحة الرئيسية
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
