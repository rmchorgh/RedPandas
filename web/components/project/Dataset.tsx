import { trpc } from "../../lib/client/trpc";
import ErrorMessage from "../ErrorMessage";
import Loading from "../Loading";
import { memo } from "react";

export interface DatasetProps {
  datasetId: string;
  revision: number;
}

function Dataset({ datasetId, revision }: DatasetProps) {
  const { data, error } = trpc.project.getDataset.useQuery({
    datasetId,
    revision,
  });

  if (error) {
    return <ErrorMessage />;
  }
  if (!data) {
    return <Loading />;
  }

  return (
    <div className={"  bg-[transparent] text-xs"}>
      <table>
        <thead>
          <tr className={"sticky top-0 bg-[#F8F8F8]"}>
            {data.columns.map((column) => (
              <th
                key={column}
                className={" mr-2 border-r border-l border-gray-100 py-6 px-2"}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i} className={`${i % 2 != 0 ? "bg-gray-50" : "bg-white"}`}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={"mr-2 border-r border-l border-[#F9FAFBAC] py-6"}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default memo(Dataset);
