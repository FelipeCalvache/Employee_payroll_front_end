import { useState, ChangeEvent, FormEvent, FC } from "react";
import { Box, Button, Input } from "@chakra-ui/react";

interface ChildProps {
  handleSetUpDateData: () => void;
}

export const ExcelUploadForm: FC<ChildProps> = ({ handleSetUpDateData }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      console.log("entro al chage");
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      console.log("No se cargo archivo");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      console.log("entra al try");
      const response = await fetch(
        "http://localhost:8080/api/attendance/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error(`Error al subir el archivo: ${response.statusText}`);
      }
      console.log("Subida exitosamente");
      handleSetUpDateData();
    } catch (error) {
      console.error("Error en la subida", error);
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <Box flexDir="column" maxW="md" mx="auto" p={4}>
      <form onSubmit={handleSubmit}>
        <Input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          disabled={loading}
          padding={1}
        />
      <Button mt={4} type="submit" color="red">
        Subir
      </Button>
      </form>
    </Box>
  );
};
