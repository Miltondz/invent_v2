import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-4">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
        <p className="text-red-500">{message}</p>
      </div>
    </div>
  );
}