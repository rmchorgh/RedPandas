import { trpc } from "../../lib/client/trpc";
import { Table } from "@mantine/core";
import ErrorMessage from "../ErrorMessage";
import Loading from "../Loading";

export interface DatasetProps {
  projectId: string;
}

export default function Dataset({ projectId }: DatasetProps) {
  const { data, error } = trpc.project.getDataset.useQuery({
    projectId,
  });

  if (error) return <ErrorMessage />;
  if (!data) return <Loading />;

  return (
    <Table>
      <thead>
        <tr>
          {data.columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
