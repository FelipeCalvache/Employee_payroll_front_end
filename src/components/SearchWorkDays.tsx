import { useState, useEffect } from 'react';
import {
  Input,
  Box,
} from '@chakra-ui/react';

interface ProcessedWorkDay {
  employeeName: string;
  employeeIdentification: string;
  projectName: string;
  duration: number;
}

interface SearchWorkDaysProps {
  workDays: ProcessedWorkDay[];
  onSearchResults: (results: ProcessedWorkDay[]) => void;
}

export const SearchWorkDays = ({ workDays, onSearchResults }: SearchWorkDaysProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if(searchTerm != ""){
    const timeoutId = setTimeout(() => {
      const filteredWorkDays = workDays.filter(workDay => 
        workDay.employee.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      onSearchResults(filteredWorkDays);
    }, 300); // 300ms de debounce
    return () => clearTimeout(timeoutId);
}
      onSearchResults([]);

  }, [searchTerm]);

  return (
    <Box>
      <Input
        placeholder="Buscar por nombre de empleado"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        border="dotted"
      />
    </Box>
  );
};