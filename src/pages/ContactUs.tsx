
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";

const ContactUs: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <MessageCircle className="mx-auto h-12 w-12 text-mortgage-primary mb-4" />
        <h1 className="text-2xl font-bold mb-4">Coming Soon!</h1>
        <p className="text-gray-600 mb-8">
          Our mortgage experts will be available to help you choose the right loan type for your needs. Check back soon!
        </p>
        <Button 
          variant="outline"
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Calculator
        </Button>
      </div>
    </div>
  );
};

export default ContactUs;
