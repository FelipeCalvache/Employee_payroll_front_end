// import { useState } from 'react'
import "./App.css";
import {
  Box,
  FileUpload,
  For,
  SimpleGrid,
  Table,
  Tabs,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu";
import { ExcelUploadForm } from "./components/ExcelUploadForm";
import { SearchWorkDays } from "./components/SearchWorkDays";
import ExcelDownloader from "./components/ExcelDownloader";

interface Employee {
  id: string;
  name: string;
  identification: string;
  password: string;
  role: string;
}

interface Project {
  id: string;
  name: string;
  costCenter: string;
}

interface ProcessedWorkDay {
  employeeName: string;
  employeeIdentification: string;
  projectName: string;
  duration: number;
}

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [workDays, setWorkDays] = useState<ProcessedWorkDay[]>([]);
  const [upDateData, setUpDateData] = useState<boolean>(false);
  const [filterWorkDays, setFilterWorkDays] = useState<ProcessedWorkDay[]>([]);

  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado de error

  // 📌 useEffect se ejecuta cuando el componente se monta
  useEffect(() => {
    fetch("http://localhost:8080/api/employees")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        return response.json();
      })
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/projects")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        return response.json();
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/employees/workdays")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        return response.json();
      })
      .then((data) => {
        setWorkDays(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [upDateData]);

  function handleSetUpDateData() {
    console.log("Se actulaizo el estado de handleSetUpDateData");
    setUpDateData(!upDateData);
  }

  function onSearchResults(filteredWorkDays) {
    console.log(JSON.stringify(filteredWorkDays));
    setFilterWorkDays(filteredWorkDays);
  }

  return (
    <Tabs.Root key={"line"} defaultValue="members" variant={"line"}>
      <Tabs.List>
        <Tabs.Trigger value="members">
          <LuUser />
          Empleados
        </Tabs.Trigger>
        <Tabs.Trigger value="projects">
          <LuFolder />
          Projects
        </Tabs.Trigger>
        <Tabs.Trigger value="tasks">
          <LuSquareCheck />
          Horas por empleado
        </Tabs.Trigger>
        <Tabs.Trigger value="ExcelDownloader">
          <LuSquareCheck />
          Descargar excel
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="members">
        <Table.Root size="sm" striped>
          <Table.Header>
            <Table.Row>
              <For
                each={
                  employees && employees.length > 0
                    ? Object.keys(employees[0])
                    : []
                }
              >
                {(key) => (
                  <Table.ColumnHeader key={key}>{key}</Table.ColumnHeader>
                )}
              </For>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {employees?.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell key={item.id}>{item.id}</Table.Cell>
                <Table.Cell key={item.name}>{item.name}</Table.Cell>
                <Table.Cell key={item.identification}>
                  {item.identification}
                </Table.Cell>
                <Table.Cell key={item.password}>{item.password}</Table.Cell>
                <Table.Cell textAlign="end">{item.role}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Tabs.Content>
      <Tabs.Content value="projects">
        <Table.Root size="sm" striped>
          <Table.Header>
            <Table.Row>
              <For
                each={
                  projects && projects.length > 0
                    ? Object.keys(projects[0])
                    : []
                }
              >
                {(key) => <Table.ColumnHeader>{key}</Table.ColumnHeader>}
              </For>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {projects?.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell key={item.id}>{item.id}</Table.Cell>
                <Table.Cell key={item.name}>{item.name}</Table.Cell>
                <Table.Cell key={item.costCenter}>{item.costCenter}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Tabs.Content>
      <Tabs.Content value="tasks">
        <ExcelUploadForm
          handleSetUpDateData={handleSetUpDateData}
        ></ExcelUploadForm>
        <SearchWorkDays workDays={workDays} onSearchResults={onSearchResults} />
        <Table.Root size="sm" striped>
          <Table.Header>
            <Table.Row>
              <For
                each={
                  workDays && workDays.length > 0
                    ? Object.keys(workDays[0])
                    : []
                }
              >
                {(key) => <Table.ColumnHeader>{key}</Table.ColumnHeader>}
              </For>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filterWorkDays.length == 0
              ? workDays?.map((item) => (
                  <Table.Row
                    // backgroundColor={item.end ? "none" : "red"}
                    key={item.id}
                  >
                    <Table.Cell>{item.id}</Table.Cell>
                    <Table.Cell>{`${item.start.date} : ${item.start.time} `}</Table.Cell>
                    {item.end ? (
                      <Table.Cell>{`${item.end?.date} : ${item.end?.time} `}</Table.Cell>
                    ) : (
                      <Table.Cell>⚠️Revisar</Table.Cell>
                    )}
                    <Table.Cell>{item.employee.name}</Table.Cell>
                    <Table.Cell>{item.duration}</Table.Cell>
                  </Table.Row>
                ))
              : filterWorkDays?.map((item) => (
                  <Table.Row
                    // backgroundColor={item.end ? "none" : "red"}
                    key={item.id}
                  >
                    <Table.Cell>{item.id}</Table.Cell>
                    <Table.Cell>{`${item.start.date} : ${item.start.time} `}</Table.Cell>
                    {item.end ? (
                      <Table.Cell>{`${item.end?.date} : ${item.end?.time} `}</Table.Cell>
                    ) : (
                      <Table.Cell>⚠️Revisar</Table.Cell>
                    )}
                    <Table.Cell>{item.employee.name}</Table.Cell>
                    <Table.Cell>{item.duration}</Table.Cell>
                  </Table.Row>
                ))}
          </Table.Body>
        </Table.Root>
      </Tabs.Content>
      <Tabs.Content value="ExcelDownloader">
        <ExcelDownloader/>
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default App;
