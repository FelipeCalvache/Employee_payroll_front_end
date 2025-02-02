import { useState } from "react";

const ExcelDownloader = () => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);

      const response = await fetch("http://localhost:8080/api/download/excel", {
        method: "GET",
        headers: {
          Accept:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });

      if (!response.ok) {
        throw new Error("Error al descargar el archivo");
      }

      // Convertir la respuesta a blob
      const blob = await response.blob();

      // Crear URL del blob
      const downloadUrl = window.URL.createObjectURL(blob);

      // Crear un elemento <a> temporal para la descarga
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "reporte.xlsx";

      // Simular clic y limpiar
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Liberar el objeto URL
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al descargar el archivo");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {downloading ? "Descargando..." : "Descargar Excel"}
      </button>
    </div>
  );
};

export default ExcelDownloader;
